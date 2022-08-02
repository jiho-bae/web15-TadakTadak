import { TadakContainer, TadakWrapper } from './style';
import RoomSideBar from '@components/sideBar/Room';
import VideoController from '@components/video/VideoController';
import VideoList from '@components/video/VideoList';
import Loader from '@components/common/Loader';
import useAgora from '@src/hooks/useAgora';
import { useUser } from '@contexts/userContext';
import { RoomInfoType } from '@src/types';
import { useMicrophoneAndCameraTracks } from '@src/components/video/config';

interface LocationProps {
  pathname: string;
  state: RoomInfoType;
}

interface TadakProps {
  location: LocationProps;
}

const Tadak = ({ location }: TadakProps): JSX.Element => {
  const { agoraAppId, agoraToken, uuid, owner, maxHeadcount } = location?.state;
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const userInfo = useUser();
  const { users, start, setStart } = useAgora({
    agoraAppId,
    agoraToken,
    uuid,
    userInfo,
    agoraType: 'tadak',
    ready,
    tracks,
  });

  return (
    <TadakWrapper>
      {!start ? (
        <Loader isWholeScreen={true} />
      ) : (
        <>
          <RoomSideBar uuid={uuid} hostNickname={owner?.nickname} maxHeadcount={maxHeadcount} />
          <TadakContainer>
            {start && tracks && <VideoList users={users} tracks={tracks} />}
            {ready && tracks && <VideoController tracks={tracks} setStart={setStart} uuid={uuid} ownerId={owner?.id} />}
          </TadakContainer>
        </>
      )}
    </TadakWrapper>
  );
};
export default Tadak;
