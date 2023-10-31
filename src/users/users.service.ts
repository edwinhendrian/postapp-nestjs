import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { hashPassword } from 'src/utils/bcrypt.utils';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
      },
    });
  }

  async findOne(username: string): Promise<UserEntity> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email: username,
          },
        ],
      },
    });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password)
      updateUserDto.password = await hashPassword(updateUserDto.password);

    return this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
      },
    });
  }
}
