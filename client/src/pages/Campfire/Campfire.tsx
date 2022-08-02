import { useState, useEffect } from 'react';
import { RoomContainer, RoomWrapper } from '@pages/Campfire/style';
import RoomSideBar from '@components/sideBar/Room';
import FireAnimation from '@src/components/fireAnimation/Campfire';
import CampfireController from '@src/components/campfire/Controller';
import CamperList from '@src/components/campfire/CamperList';
import Loader from '@components/common/Loader';
import BGMContextProvider from '@contexts/bgmContext';
import { useUser } from '@contexts/userContext';
import useCampfireAgora from '@src/hooks/useCampfireAgora';
import { RoomType } from '@utils/constant';
import { RoomInfoType } from '@src/types';

interface LocationProps {
  pathname: string;
  state: RoomInfoType;
}

interface RoomProps {
  location: LocationProps;
}

const Campfire = ({ location }: RoomProps): JSX.Element => {
  const { agoraAppId, agoraToken, uuid, owner, maxHeadcount } = location.state;
  const [fireOn, setFireOn] = useState(false);
  const userInfo = useUser();
  const { users, start, setStart, track } = useCampfireAgora({
    agoraAppId,
    agoraToken,
    uuid,
    userInfo,
    agoraType: 'campfire',
  });

  useEffect(() => setFireOn(true), []);

  return (
    <BGMContextProvider>
      {!start ? (
        <Loader isWholeScreen={true} />
      ) : (
        <RoomWrapper>
          <RoomSideBar
            uuid={uuid}
            hostNickname={owner?.nickname}
            maxHeadcount={maxHeadcount}
            roomType={RoomType.campfire}
          />
          <RoomContainer>
            <FireAnimation fireOn={fireOn} setFireOn={setFireOn} />
            {track && <CamperList users={users} track={track} />}
            {track && <CampfireController track={track} setStart={setStart} uuid={uuid} ownerId={owner?.id} />}
          </RoomContainer>
        </RoomWrapper>
      )}
    </BGMContextProvider>
  );
};
export default Campfire;
