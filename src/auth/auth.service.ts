import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const isUserPasswordValid = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!isUserPasswordValid) throw new UnauthorizedException("username or password incorrect!");

    const payload: JwtPayload = { username: authCredentialsDto.username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
