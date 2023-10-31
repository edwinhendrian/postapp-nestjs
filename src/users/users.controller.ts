import { Controller, Get, Post, Body, Request, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/index';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get('profile')
  @ApiBearerAuth('token')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Patch()
  @ApiBearerAuth('token')
  @ApiOkResponse({ type: UserEntity })
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }
}
