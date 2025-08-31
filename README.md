Human Activity Recognition and Pose Tracking Suite
A real-time analytics suite for human activity recognition and pose tracking, leveraging YOLOv11 for pose detection and multi-person tracking. This project is designed for applications in sports training (e.g., analyzing athlete postures), physiotherapy (e.g., monitoring rehabilitation exercises), and industrial worker safety (e.g., detecting unsafe postures like improper lifting).
Table of Contents..

Project Overview
Features
Tech Stack
Installation
Prerequisites
Backend Setup
Frontend Setup


Usage
Project Structure
Limitations
Future Enhancements
Contributing
License

Project Overview
This suite combines YOLOv11-pose for pose detection with multi-person tracking to analyze human activities in real-time. The backend processes video or image inputs using a Python-based FastAPI server, while the frontend, built with React.js and Material-UI (MUI), provides an intuitive interface for uploading media and viewing annotated results with activity labels.
The system is sellable for:

Sports Training: Analyze athletes' movements to improve technique.
Physiotherapy: Monitor patient exercises for correct posture.
Workplace Safety: Detect unsafe worker postures to prevent injuries.

Features

Pose Detection: Uses YOLOv11-pose to detect human keypoints (e.g., shoulders, hips, knees).
Multi-Person Tracking: Tracks multiple individuals across video frames with persistent IDs.
Activity Recognition: Rule-based classification of activities (e.g., standing, sitting, bending).
Real-Time Processing: Processes videos frame-by-frame for near real-time analytics.
Frontend Dashboard: Upload videos/images and view results with a modern MUI-styled interface.
Cross-Origin Support: Backend configured with CORS for seamless frontend integration.

Tech Stack

Backend: Python, FastAPI, Ultralytics YOLOv11, OpenCV, NumPy
Frontend: React.js, Material-UI (MUI), Axios
Model: YOLOv11-pose with ByteTrack for tracking
Dependencies: See backend/requirements.txt and frontend/package.json

Installation
Prerequisites

Python 3.10+: For backend processing.
Node.js 18+: For frontend development.
Git: For cloning the repository.
Optional: GPU (CUDA-enabled) for faster YOLOv11 processing.

Backend Setup

Clone the repository:git clone <repository-url>
cd <repository-folder>/backend


Create a virtual environment and activate it:python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install dependencies:pip install -r requirements.txt


Run the FastAPI server:uvicorn app:app --host 0.0.0.0 --port 8000 --reload

The backend will be available at http://127.0.0.1:8000.

Frontend Setup

Navigate to the frontend directory:cd <repository-folder>/frontend


Install dependencies:npm install


Start the React development server:npm start

The frontend will be available at http://localhost:3000.

Usage

Start the Backend: Ensure the FastAPI server is running (uvicorn app:app).
Start the Frontend: Run npm start in the frontend/ directory.
Upload a Video:
Open the frontend in a browser (http://localhost:3000).
Use the "Choose Video" button to select a video file (e.g., MP4).
Click "Analyze Video" to send the video to the backend.


View Results:
The backend processes the video, detecting poses and classifying activities.
Results are displayed in a scrollable list, showing frame-by-frame detections with person IDs and activity labels (e.g., "Person 1: standing").


Optional: For real-time webcam support, extend the frontend to capture frames and send them via WebSocket (not implemented in this version).

Note: For production, configure a reverse proxy (e.g., Nginx) and secure the API with authentication.
Project Structure
├── backend/
│   ├── app.py              # FastAPI server with YOLOv11 processing
│   ├── requirements.txt    # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component with MUI styling
│   ├── package.json        # Frontend dependencies
├── README.md               # This file

Limitations

Activity Recognition: Uses basic rule-based logic (e.g., keypoint positions for standing, sitting). For complex activities, train a custom classifier on keypoint data.
Real-Time Performance: CPU-based processing may be slow for high-resolution videos; use a GPU for production.
Webcam Support: Not implemented; requires WebSocket or WebRTC integration.
Output Visualization: Current frontend shows text-based results; add a video player for annotated video playback in production.

Future Enhancements

Add support for real-time webcam streaming.
Implement advanced activity recognition with a trained machine learning model.
Enhance frontend with a video player to display annotated frames.
Add export options for analytics reports (e.g., CSV, JSON).
Optimize YOLOv11 for edge devices (e.g., Jetson Nano) for industrial deployments.

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.