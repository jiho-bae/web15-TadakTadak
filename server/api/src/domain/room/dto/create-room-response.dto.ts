import { Room, RoomType } from '../room.entity';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { UserResponseDtoBuilder } from '../../../builder/user/user-response.dto.builder';
import { User } from '../../user/user.entity';

export class CreateRoomResponseDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  roomType: RoomType;
  uuid: string;
  agoraAppId: string;
  agoraToken: string;
  owner: UserResponseDto;

  constructor(room: Room) {
    const owner: User = room.owner;
    this.id = room.id;
    this.createdAt = room.createdAt;
    this.updatedAt = room.updatedAt;
    this.title = room.title;
    this.description = room.description;
    this.roomType = room.roomType;
    this.uuid = room.uuid;
    this.agoraAppId = room.agoraAppId;
    this.agoraToken = room.agoraToken;
    this.owner = new UserResponseDtoBuilder()
      .setId(room.owner.id)
      .setNickName(owner.nickName)
      .setEmail(owner.email)
      .setImageUrl(owner.imageUrl)
      .setImageName(owner.imageName)
      .setIntroduction(owner.introduction)
      .setIsSocial(owner.isSocial)
      .setLastCheckIn(owner.lastCheckIn)
      .build();
  }
}
