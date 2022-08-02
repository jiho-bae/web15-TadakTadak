import { useCallback, useEffect, useState } from 'react';
import { UserInfoType } from '@src/types';
import { useClient, useMicrophoneAndCameraTracks } from '@src/components/video/config';
import { IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { userPublished, userUnpublished, userChanged, muteTrack, publishTrack } from '@src/agora/util';

type UseAgoraProps = {
  agoraAppId: string;
  agoraToken: string;
  uuid: string;
  userInfo: UserInfoType;
  agoraType: 'tadak' | 'campfire';
};

type UseAgoraReturns = {
  users: IAgoraRTCRemoteUser[];
  start: boolean;
  ready: boolean;
  track?: IMicrophoneAudioTrack | null;
  tracks?: [IMicrophoneAudioTrack, ICameraVideoTrack] | null;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
};

function useTadakAgora({ agoraAppId, agoraToken, uuid, userInfo, agoraType }: UseAgoraProps): UseAgoraReturns {
  const client = useClient();
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState(false);
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const addUsers = useCallback((user: IAgoraRTCRemoteUser) => {
    setUsers((prevUsers) => [...new Set([...prevUsers, user])]);
  }, []);

  const removeUsers = useCallback((user: IAgoraRTCRemoteUser) => {
    setUsers((prevUsers) => {
      return prevUsers.filter((User) => User.uid !== user.uid);
    });
  }, []);

  const listenAgora = useCallback(() => {
    client.on('user-published', userPublished(agoraType, client, addUsers));
    client.on('user-unpublished', userUnpublished(agoraType));
    client.on('user-joined', userChanged(addUsers));
    client.on('user-left', userChanged(removeUsers));
  }, [agoraType, client, addUsers, removeUsers]);

  const startAgora = useCallback(async () => {
    await client.join(agoraAppId, uuid, agoraToken, encodeURI(userInfo.nickname ?? ''));
    await publishTrack(client, tracks);
    await muteTrack({ tracks });

    setStart(true);
  }, [uuid, agoraAppId, agoraToken, client, tracks, userInfo]);

  useEffect(() => {
    if (ready && tracks) {
      listenAgora();
      startAgora();
    }
  }, [listenAgora, startAgora, ready, tracks]);

  return { users, start, ready, tracks, setStart };
}

export default useTadakAgora;
