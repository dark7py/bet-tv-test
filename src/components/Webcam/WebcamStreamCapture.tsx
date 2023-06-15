import Webcam from 'react-webcam';

import s from './Webcam.module.css';

type TProps = {
  webacamRef: React.LegacyRef<Webcam> | undefined;
};

export const WebcamStreamCapture = ({ webacamRef }: TProps) => {
  return (
    <>
      <Webcam audio={false} ref={webacamRef} mirrored className={s.webcam} />
    </>
  );
};
