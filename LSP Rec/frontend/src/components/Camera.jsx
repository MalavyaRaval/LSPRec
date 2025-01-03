import React, { useRef, useEffect, useState } from 'react';
import '../CSS/Camera.css';
import symbol from '../images/symbol.jpg';
import Navbar from './Nav/Navbar';

const Camera = () => {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startStreaming = () => {
    const constraints = {
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream) => {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setStreaming(true);

        const recorder = new MediaRecorder(mediaStream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };
        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch((err) => {
        console.error("Error accessing the camera and microphone: ", err);
        alert('Please allow access to the camera and microphone.');
      });
  };

  const stopStreaming = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
      setStreaming(false);
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <>
      <Navbar />
      <div className="camera-container">
        <h1 className="camera-header">Project</h1>
        <video ref={videoRef} autoPlay className="camera-video"></video>
        <div className="camera-controls">
          {/* {!streaming ? (
            <button onClick={startStreaming} className="camera-button">Start Livestreaming</button>
          ) : (
            <button onClick={stopStreaming} className="camera-button">Stop Livestreaming</button>
          )} */}
        </div>
      </div>
    </>
  );
};

export default Camera;
