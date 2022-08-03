import { memo } from 'react';
import {
  RoomCardWrapper,
  RoomCardTop,
  RoomCardBottom,
  RoomTopMenu,
  RoomTitle,
  RoomFieldType,
  RoomDescription,
  RoomOwnerNickname,
  RoomAdmitNumber,
} from './style';
import { RoomInfoType } from '@src/types';

interface RoomCardProps {
  roomInfo: RoomInfoType;
  idx: number;
}

const RoomCard = memo(({ roomInfo, idx }: RoomCardProps): JSX.Element => {
  const { title, description, nowHeadcount, maxHeadcount, owner } = roomInfo;

  return (
    <RoomCardWrapper className="room-card" data-idx={idx}>
      <RoomCardTop>
        <RoomTopMenu>
          <RoomTitle>{title}</RoomTitle>
          <RoomFieldType bgColor={owner?.devField?.name || 'None'}>{owner?.devField?.name}</RoomFieldType>
        </RoomTopMenu>
        <RoomDescription>{description}</RoomDescription>
      </RoomCardTop>
      <RoomCardBottom>
        <RoomOwnerNickname>호스트 : {owner?.nickname}</RoomOwnerNickname>
        <RoomAdmitNumber>
          {nowHeadcount} / {maxHeadcount}
        </RoomAdmitNumber>
      </RoomCardBottom>
    </RoomCardWrapper>
  );
});

export default RoomCard;
