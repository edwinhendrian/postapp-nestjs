import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PostEntity } from './entities/post.entity';
import { CreateLikeDto, DeleteLikeDto, DeletePostDto } from './dto';
import { LikeEntity } from './entities/like.entity';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(user_id: number, text: string): Promise<PostEntity> {
    return this.prisma.post.create({ data: { text, user_id } });
  }

  async createReply(
    user_id: number,
    post_id: number,
    text: string,
  ): Promise<PostEntity> {
    const post = await this.findOne(post_id);
    if (!post) throw new NotFoundException('Post is not found');

    const reply = await this.prisma.post.create({
      data: { text, post_id, user_id },
    });

    await this.prisma.post.update({
      data: { reply_count: { increment: 1 } },
      where: { id: reply.post_id },
    });

    return reply;
  }

  async findById(id: number): Promise<PostEntity> {
    return this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        text: true,
        post_id: true,
        post: {
          select: {
            id: true,
            text: true,
            reply_count: true,
            like_count: true,
            user_id: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            created_at: true,
            updated_at: true,
          },
        },
        replies: {
          select: {
            id: true,
            text: true,
            reply_count: true,
            like_count: true,
            user_id: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            created_at: true,
            updated_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 10,
        },
        reply_count: true,
        like_count: true,
        user_id: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });
  }

  async delete(deletePostDto: DeletePostDto) {
    const post = await this.findOne(deletePostDto.post_id);
    if (!post) throw new NotFoundException('Post is not found');
    if (post.user_id !== deletePostDto.user_id)
      throw new UnauthorizedException('Cannot delete post that are not yours');

    await this.deleteLikeByPost(post.id);

    if (post.post_id === null)
      return this.prisma.post.delete({ where: { id: post.id } });
    else {
      return Promise.all([
        this.prisma.post.delete({ where: { id: post.id } }),
        this.prisma.post.update({
          data: { reply_count: { decrement: 1 } },
          where: { id: post.id },
        }),
      ]);
    }
  }

  async like(createLikeDto: CreateLikeDto) {
    const post = await this.findOne(createLikeDto.post_id);
    if (!post) throw new NotFoundException('Post is not found');

    const liked = await this.findLike(createLikeDto);
    if (liked) throw new ConflictException('Already liked the post');

    await this.createLike(createLikeDto);

    return this.prisma.post.update({
      data: { like_count: { increment: 1 } },
      where: { id: createLikeDto.post_id },
    });
  }

  async unlike(deleteLikeDto: DeleteLikeDto) {
    const post = await this.findOne(deleteLikeDto.post_id);
    if (!post) throw new NotFoundException('Post is not found');

    const liked = await this.findLike(deleteLikeDto);
    if (!liked)
      throw new NotFoundException(
        'You can not unlike post you have not already liked',
      );

    await this.deleteLike(deleteLikeDto);

    return this.prisma.post.update({
      data: { like_count: { decrement: 1 } },
      where: { id: deleteLikeDto.post_id },
    });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async createLike(createLikeDto: CreateLikeDto): Promise<LikeEntity> {
    return this.prisma.like.create({ data: createLikeDto });
  }

  async findLike(createLikeDto: CreateLikeDto): Promise<LikeEntity> {
    return this.prisma.like.findFirst({ where: createLikeDto });
  }

  async deleteLike(deleteLikeDto: DeleteLikeDto) {
    return this.prisma.like.deleteMany({ where: deleteLikeDto });
  }

  async deleteLikeByPost(post_id: number) {
    return this.prisma.like.deleteMany({ where: { post_id } });
  }
}
