import React, { useEffect, useRef } from 'react';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';
import { useClient, useScreenVideoTrack } from '@components/video/config';

interface ScreenShareProps {
  preTracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  trackState: { video: boolean; audio: boolean };
  screenShare: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  toggleScreenShare: () => void;
}

const ScreenShare = ({
  preTracks,
  trackState,
  screenShare,
  setStart,
  toggleScreenShare,
}: ScreenShareProps): JSX.Element => {
  const client = useClient();
  const { ready, tracks, error } = useScreenVideoTrack();
  const firstRenderRef = useRef(true);

  useEffect(() => {
    const pulishScreenShare = async () => {
      await client.unpublish(preTracks[1]);
      await client.publish(tracks);
      if (!Array.isArray(tracks)) {
        tracks.on('track-ended', async () => {
          await client.unpublish(tracks);
          tracks.close();
          if (trackState.video) {
            await client.publish(preTracks[1]);
          }
          toggleScreenShare();
        });
      }
    };
    if (ready && tracks) pulishScreenShare();
    if (error) toggleScreenShare();

    return () => {
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }
      if (!error && !Array.isArray(tracks)) {
        client.unpublish(tracks);
        tracks.close();
      }
    };
  }, [setStart, toggleScreenShare, screenShare, client, preTracks, trackState, tracks, ready, error]);

  return <></>;
};

export default ScreenShare;
