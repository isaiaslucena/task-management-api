import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcryptjs from "bcryptjs";

@EntityRepository(User)
export class UserRepository extends Repository<User>  {
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcryptjs.hash(password, salt);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcryptjs.genSalt();

    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') throw new ConflictException(error.detail);
      throw new InternalServerErrorException(error.detail);
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<boolean> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    const isPasswordValid = await user.isPasswordValid(password);
    return user && isPasswordValid
  }
}