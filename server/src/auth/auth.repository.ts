import { EntityRepository, Repository } from 'typeorm';
import { User } from '../user/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async exists(user): Promise<boolean> {
    return (
      (await this.createQueryBuilder('user')
        .where('user.nick_name = :nick_name OR user.email = :email', {
          nickname: user.nickname,
          email: user.email,
        })
        .getCount()) > 0
    );
  }
}
