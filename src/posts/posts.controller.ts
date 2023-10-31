import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto';
import { PostEntity } from './entities/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiBearerAuth('token')
  @ApiCreatedResponse({ type: PostEntity })
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.sub, createPostDto.text);
  }

  @Post(':id')
  @ApiBearerAuth('token')
  @ApiCreatedResponse({ type: PostEntity })
  async createReply(
    @Request() req,
    @Param('id') id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createReply(req.user.sub, +id, createPostDto.text);
  }

  @Get(':id')
  @ApiBearerAuth('token')
  async findOne(@Param('id') id: string) {
    return this.postsService.findById(+id);
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  async delete(@Request() req, @Param('id') id: string) {
    return this.postsService.delete({ user_id: req.user.sub, post_id: +id });
  }

  @Get(':id/like')
  @ApiBearerAuth('token')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async like(@Request() req, @Param('id') id: string) {
    return this.postsService.like({ user_id: req.user.sub, post_id: +id });
  }

  @Get(':id/unlike')
  @ApiBearerAuth('token')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlike(@Request() req, @Param('id') id: string) {
    return this.postsService.unlike({ user_id: req.user.sub, post_id: +id });
  }
}
