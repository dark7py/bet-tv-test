import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WebcamStreamCapture } from './components';

import './App.css';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          webcamElement.srcObject = stream;
          videoElement.play();
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
        });
    }
  }, []);

  const handleStartCaptureClick = useCallback(() => {
    setIsCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setIsCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks(prev => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setIsCapturing(false);
  }, [mediaRecorderRef, setIsCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'react-webcam-stream-capture.webm';
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  // const handleRecord = () => {
  //   if (recording) {
  //     mediaRecorderRef.current?.stop();
  //   } else {
  //     setRecordedChunks([]);
  //     startRecording();
  //   }
  //   setRecording(prevRecording => !prevRecording);
  // };

  // const startRecording = () => {
  //   const videoElement = videoRef.current;
  //   // const webcamElement = webcamRef.current;

  //   if (videoElement) {
  //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  //       videoElement.srcObject = stream;
  //       videoElement.play();

  //       // const webcamStream = webcamElement.captureStream();
  //       const fullStream = new MediaStream([
  //         ...stream.getVideoTracks(),
  //         // ...webcamStream.getVideoTracks(),
  //       ]);
  //       mediaRecorderRef.current = new MediaRecorder(fullStream);
  //       mediaRecorderRef.current.addEventListener(
  //         'dataavailable',
  //         handleDataAvailable
  //       );
  //       mediaRecorderRef.current.start();
  //     });
  //   }
  // };

  // const handleDataAvailable = (event: BlobEvent) => {
  //   if (event.data.size > 0) {
  //     setRecordedChunks(prevChunks => [...prevChunks, event.data]);
  //   }
  // };

  // const saveRecording = () => {
  //   const fullRecording = new Blob(recordedChunks, {
  //     type: recordedChunks[0].type,
  //   });
  //   console.log(fullRecording);
  //   const url = URL.createObjectURL(fullRecording);
  //   const a = document.createElement('a');
  //   document.body.appendChild(a);
  //   a.style.display = 'none';
  //   a.href = url;
  //   a.download = 'recording.webm';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   setRecordedChunks([]);
  // };

  return (
    <>
      <div className='container'>
        {/* video from Youtube */}
        {/* <iframe
          ref={videoRef}
          width='932'
          height='524'
          src='https://www.youtube.com/embed/hu24nFCk3pA'
          title='Капибара: Самая большая водосвинка | Интересные факты про грызунов'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        ></iframe> */}

        <video
          src='video.mp4'
          ref={videoRef}
          width='100%'
          height='auto'
          controls
        />

        <WebcamStreamCapture webacamRef={webcamRef} />
      </div>

      <div className='buttonsBlock'>
        {isCapturing ? (
          <button onClick={handleStopCaptureClick}>Остановить запись</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Начать запись</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Скачать</button>
        )}
      </div>
    </>
  );
};

export default App;
