import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { SocketEvents } from '@socket/socketEvents';
import socket from '@socket/socket';
import RoomCard from '@components/room/RoomCard';
import { useUser } from '@contexts/userContext';
import { RoomInfoType } from '@src/types';
import { useToast } from '@hooks/useToast';
import { RoomType, TOAST_MESSAGE } from '@utils/constant';
import { getRoomByUuid, postEnterRoom } from '@src/apis';

interface ListGeneratorProps {
  list: RoomInfoType[];
}

function ListGenerator({ list }: ListGeneratorProps): JSX.Element {
  const { login, nickname } = useUser();
  const toast = useToast();
  const roomDataRef = useRef<RoomInfoType>();
  const history = useHistory();

  const verifyBySocket = useCallback(
    (uuid: string) => {
      socket.emit(SocketEvents.canIEnter, { uuid, nickname });
    },
    [nickname],
  );

  const getRoomData = useCallback(
    async (uuid: string) => {
      const { isOk, data } = await getRoomByUuid(uuid);
      if (isOk && data) {
        if (data.nowHeadcount >= data.maxHeadcount) {
          toast('error', TOAST_MESSAGE.exceedEntryCapacity);
          return false;
        }
        roomDataRef.current = data;
        return true;
      }
      toast('error', TOAST_MESSAGE.fetchError);
      return false;
    },
    [toast],
  );

  const onClickRoomCard = useCallback(
    async (e) => {
      if (!login) return toast('error', TOAST_MESSAGE.notAllowedNonLogin);

      const clickedCard = e.target.closest('.room-card');
      const { idx } = clickedCard.dataset;
      const clickedCardInfo = list[idx];
      const { uuid } = clickedCardInfo;

      const isSuccess = await getRoomData(uuid);
      if (isSuccess) verifyBySocket(uuid);
    },
    [list, login, toast, getRoomData, verifyBySocket],
  );

  const enterRoom = useCallback(
    (iCanEnter) => {
      if (!iCanEnter) return;
      if (!roomDataRef.current) return;

      const { roomType, uuid } = roomDataRef.current;
      const pathname = roomType === RoomType.tadak ? `/room/tadak/${uuid}` : `/room/campfire/${uuid}`;
      postEnterRoom(uuid);
      history.push({ pathname, state: roomDataRef.current });
    },
    [history, roomDataRef],
  );

  useEffect(() => {
    socket.removeListener(SocketEvents.youCanEnter);
    socket.on(SocketEvents.youCanEnter, enterRoom);
  }, [enterRoom]);

  return (
    <div onClick={onClickRoomCard}>
      {list.map((roomInfo, idx) => (
        <RoomCard key={roomInfo.uuid} roomInfo={roomInfo} idx={idx} />
      ))}
    </div>
  );
}

export default ListGenerator;
