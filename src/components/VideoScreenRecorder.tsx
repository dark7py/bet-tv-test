import React, { useRef, useState } from 'react';

export const VideoScreenRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia();
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const combinedStream = new MediaStream();
      screenStream.getTracks().forEach(track => combinedStream.addTrack(track));
      webcamStream.getTracks().forEach(track => combinedStream.addTrack(track));

      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.srcObject = combinedStream;
        videoElement.play();
      }

      const mediaRecorder = new MediaRecorder(combinedStream);
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: chunks[0].type });
        setVideoChunks(chunks);
        setStream(null);
        setRecording(prev => !prev);
        downloadVideo(videoBlob);
      };

      mediaRecorder.start();
      setStream(combinedStream);
      setRecording(prev => !prev);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.srcObject = null;
    }

    const mediaRecorder =
      stream && stream.active ? stream.getTracks()[0] : null;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  const downloadVideo = () => {
    console.log(videoChunks);
    const fullRecording = new Blob(videoChunks, {
      type: videoChunks[0].type,
    });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(fullRecording);
    downloadLink.download = 'recorded_video.webm';
    downloadLink.click();
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      {!recording ? (
        <button onClick={startRecording}>Начать запись</button>
      ) : (
        <button onClick={stopRecording}>Остановить запись</button>
      )}
      <button onClick={downloadVideo}>Скачать</button>
    </div>
  );
};
