import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { comparePassword } from 'src/utils/bcrypt.utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.username);
    if (!user) throw new UnauthorizedException('Username or password wrong');

    const isValid = await comparePassword(loginDto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Username or password wrong');

    return {
      token: await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
      }),
    };
  }

  async logout(username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new NotFoundException('User is not found');

    return 'OK';
  }
}
