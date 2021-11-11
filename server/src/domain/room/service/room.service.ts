import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room, RoomType } from '../room.entity';
import { Pagination, PaginationOptions } from '../../../paginate';
import { CreateRoomRequestDto } from '../dto/create-room-request.dto';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { v4 as uuidv4 } from 'uuid';
import { RoomRepository } from '../repository/room.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { CreateRoomResponseDto } from '../dto/create-room-response.dto';
import { UserException, RoomException } from '../../../exception';
import { Connection, DeleteResult, getConnection } from 'typeorm';
import { RoomBuilder } from '../../../builder';

@Injectable()
export class RoomService {
  constructor(
    private connection: Connection,
    @InjectRepository(RoomRepository)
    private readonly roomRepository: RoomRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getRoomByUUID(uuid: string): Promise<Room> {
    return await this.roomRepository.findRoomByUUID(uuid);
  }

  async getRoomListAll(options: PaginationOptions, roomType: RoomType): Promise<Pagination<Room>> {
    const [results, total] = await this.roomRepository.findByKeywordAndCount(options, roomType);
    return new Pagination<Room>({
      results,
      total,
    });
  }

  async createRoom(createRoomRequestDto: CreateRoomRequestDto): Promise<CreateRoomResponseDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    const { userId, title, description, maxHeadcount, roomType } = createRoomRequestDto;
    const uuid = uuidv4();
    const agoraAppID = process.env.AGORA_APP_ID;
    const agoraToken = this.createTokenWithChannel(userId, agoraAppID, uuid);
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw UserException.userNotFound();
    const existRoom = await this.roomRepository.findRoomByUserEmail(user.email);
    if (existRoom) throw RoomException.roomExistError();
    const newRoom = new RoomBuilder()
      .setTitle(title)
      .setDescription(description)
      .setNowHeadcount(1)
      .setMaxHeadcount(maxHeadcount)
      .setRoomType(roomType)
      .setUUID(uuid)
      .setAgoraAppID(agoraAppID)
      .setAgoraToken(agoraToken)
      .setOwner(user)
      .build();

    try {
      await queryRunner.startTransaction();
      await this.roomRepository.createRoom(newRoom);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw RoomException.roomCreateError();
    } finally {
      await queryRunner.release();
    }
    return new CreateRoomResponseDto(newRoom);
  }

  async deleteRoom(email: string, uuid: string): Promise<boolean> {
    const user = await this.userRepository.findUserByUserEmail(email);
    if (!user) throw UserException.userNotFound();
    const findRoom = await this.roomRepository.findRoomByUserEmailAndUUID(email, uuid);
    if (!findRoom) throw RoomException.roomNotFound();
    const deleteResult: DeleteResult = await this.roomRepository.deleteRoomByRoomID(findRoom.id);
    if (!deleteResult) throw RoomException.roomDeleteError();
    return true;
  }

  createTokenWithChannel(userId: number, appID: string, uuid: string): string {
    const HOUR_TO_SECOND = 3600;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const expirationTimeInSeconds = HOUR_TO_SECOND * 24;
    const role = RtcRole.PUBLISHER;
    const channel = uuid;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;
    return RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, userId, role, expirationTimestamp);
  }
}
