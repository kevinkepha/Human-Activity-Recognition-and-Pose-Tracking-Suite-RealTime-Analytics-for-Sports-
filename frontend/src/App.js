import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme,
  InputLabel,
  FormControl,
  styled,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue for primary actions
    },
    secondary: {
      main: '#dc004e', // Red for errors
    },
    background: {
      default: '#f5f5f5', // Light background for contrast
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h6: {
      fontWeight: 500,
      color: '#1565c0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Styled file input
const Input = styled('input')({
  display: 'none',
});

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Reset error on new file selection
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/process_video/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data.results);
      setError(null);
    } catch (err) {
      setError('Error processing video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Human Activity Recognition & Pose Tracking Suite
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Upload a video to analyze human poses and activities in real-time
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <FormControl>
            <InputLabel htmlFor="upload-video">
              <Input
                id="upload-video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFileIcon />}
                sx={{ mr: 2, py: 1.5 }}
              >
                Choose Video
              </Button>
            </InputLabel>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Processing...' : 'Analyze Video'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, mx: 'auto', maxWidth: '600px' }}>
            {error}
          </Alert>
        )}

        {results && (
          <Paper elevation={3} sx={{ p: 3, mt: 2, maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {results.map((frame) => (
                <ListItem
                  key={frame.frame_id}
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <ListItemText
                    primary={`Frame ${frame.frame_id}`}
                    secondary={
                      frame.detections.length > 0
                        ? frame.detections
                            .map((det) => `Person ${det.track_id}: ${det.activity}`)
                            .join(' | ')
                        : 'No persons detected'
                    }
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;