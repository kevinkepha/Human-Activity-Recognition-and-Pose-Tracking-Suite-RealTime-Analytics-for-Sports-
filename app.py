from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from ultralytics import YOLO
from typing import List
from pydantic import BaseModel
import math

app = FastAPI()

# Load YOLOv11 pose model
model = YOLO("yolo11n-pose.pt")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Detection(BaseModel):
    track_id: int
    keypoints: List[List[float]]  # List of [x, y, conf]
    activity: str

class FrameResult(BaseModel):
    frame_id: int
    detections: List[Detection]

@app.post("/process_video/")
async def process_video(file: UploadFile):
    # Read uploaded video
    video_bytes = await file.read()
    video_path = "temp_video.mp4"
    with open(video_path, "wb") as f:
        f.write(video_bytes)
    
    cap = cv2.VideoCapture(video_path)
    results = []
    frame_id = 0
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        
        # Run YOLOv11 pose tracking
        track_results = model.track(frame, persist=True, tracker="bytetrack.yaml")
        
        frame_detections = []
        for result in track_results:
            if result.keypoints is None:
                continue
            for i in range(len(result.keypoints.xy)):
                kpts = result.keypoints.xy[i].tolist()  # Keypoints for each person
                track_id = int(result.boxes.id[i]) if result.boxes.id is not None else -1
                activity = classify_activity(kpts)
                frame_detections.append(Detection(track_id=track_id, keypoints=kpts, activity=activity))
        
        results.append(FrameResult(frame_id=frame_id, detections=frame_detections))
        frame_id += 1
    
    cap.release()
    # In production, save annotated video and return URL; here return JSON results
    return {"results": results}

def classify_activity(keypoints):
    # Simple rule-based activity classification using keypoints (indices from COCO: 0=nose, 5/6=shoulders, 11/12=hips, 13/14=knees, etc.)
    if len(keypoints) < 17:
        return "unknown"
    
    # Extract relevant points (assume visible if present)
    nose_y = keypoints[0][1]
    left_hip_y = keypoints[11][1]
    right_hip_y = keypoints[12][1]
    left_knee_y = keypoints[13][1]
    right_knee_y = keypoints[14][1]
    
    hip_y = (left_hip_y + right_hip_y) / 2
    knee_y = (left_knee_y + right_knee_y) / 2
    
    # Standing: head > hips > knees
    if nose_y < hip_y < knee_y:
        return "standing"
    
    # Sitting/Bending: knees higher or closer to hips
    if abs(hip_y - knee_y) < 50:  # Pixel threshold, adjust based on image size
        return "sitting/bending"
    
    # Add more rules, e.g., for walking (movement over frames, but needs state)
    # For now, basic
    return "other"

# Similar endpoint for images can be added if needed