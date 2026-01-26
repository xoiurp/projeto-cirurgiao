import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { VoteTopicDto, VoteReplyDto } from './dto/vote.dto';

@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  // ==================== TÓPICOS ====================

  /**
   * Criar novo tópico
   */
  async createTopic(userId: string, createTopicDto: CreateTopicDto) {
    // Verificar se a categoria existe
    const category = await this.prisma.forumCategory.findUnique({
      where: { id: createTopicDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Se videoId foi fornecido, verificar se existe
    if (createTopicDto.videoId) {
      const video = await this.prisma.video.findUnique({
        where: { id: createTopicDto.videoId },
      });

      if (!video) {
        throw new NotFoundException('Vídeo não encontrado');
      }
    }

    return this.prisma.forumTopic.create({
      data: {
        ...createTopicDto,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        video: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            replies: true,
            votes: true,
          },
        },
      },
    });
  }

  /**
   * Listar tópicos (com filtros)
   */
  async findAllTopics(params?: {
    categoryId?: string;
    videoId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.categoryId) where.categoryId = params.categoryId;
    if (params?.videoId) where.videoId = params.videoId;

    const [topics, total] = await Promise.all([
      this.prisma.forumTopic.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isPinned: 'desc' }, // Fixados primeiro
          { createdAt: 'desc' }, // Mais recentes
        ],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: true,
          video: {
            select: {
              id: true,
              title: true,
            },
          },
          _count: {
            select: {
              replies: true,
              votes: true,
            },
          },
        },
      }),
      this.prisma.forumTopic.count({ where }),
    ]);

    return {
      data: topics,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar tópico por ID
   */
  async findOneTopic(id: string) {
    const topic = await this.prisma.forumTopic.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        video: {
          select: {
            id: true,
            title: true,
          },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
            votes: true,
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException('Tópico não encontrado');
    }

    // Incrementar visualizações
    await this.prisma.forumTopic.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return topic;
  }

  /**
   * Atualizar tópico
   */
  async updateTopic(
    userId: string,
    id: string,
    updateTopicDto: UpdateTopicDto,
    userRole: string,
  ) {
    const topic = await this.prisma.forumTopic.findUnique({
      where: { id },
    });

    if (!topic) {
      throw new NotFoundException('Tópico não encontrado');
    }

    // Apenas o autor ou ADMIN pode editar
    if (topic.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        'Você não tem permissão para editar este tópico',
      );
    }

    // Se tópico está fechado, apenas ADMIN pode editar
    if (topic.isClosed && userRole !== 'ADMIN') {
      throw new BadRequestException('Este tópico está fechado');
    }

    return this.prisma.forumTopic.update({
      where: { id },
      data: updateTopicDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });
  }

  /**
   * Deletar tópico
   */
  async removeTopic(userId: string, id: string, userRole: string) {
    const topic = await this.prisma.forumTopic.findUnique({
      where: { id },
    });

    if (!topic) {
      throw new NotFoundException('Tópico não encontrado');
    }

    // Apenas o autor ou ADMIN pode deletar
    if (topic.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este tópico',
      );
    }

    return this.prisma.forumTopic.delete({
      where: { id },
    });
  }

  // ==================== RESPOSTAS ====================

  /**
   * Criar resposta
   */
  async createReply(userId: string, createReplyDto: CreateReplyDto) {
    const topic = await this.prisma.forumTopic.findUnique({
      where: { id: createReplyDto.topicId },
    });

    if (!topic) {
      throw new NotFoundException('Tópico não encontrado');
    }

    if (topic.isClosed) {
      throw new BadRequestException(
        'Este tópico está fechado e não aceita novas respostas',
      );
    }

    return this.prisma.forumReply.create({
      data: {
        ...createReplyDto,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Atualizar resposta
   */
  async updateReply(
    userId: string,
    id: string,
    content: string,
    userRole: string,
  ) {
    const reply = await this.prisma.forumReply.findUnique({
      where: { id },
      include: { topic: true },
    });

    if (!reply) {
      throw new NotFoundException('Resposta não encontrada');
    }

    // Apenas o autor ou ADMIN pode editar
    if (reply.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta resposta',
      );
    }

    // Se tópico está fechado, apenas ADMIN pode editar
    if (reply.topic.isClosed && userRole !== 'ADMIN') {
      throw new BadRequestException('Este tópico está fechado');
    }

    return this.prisma.forumReply.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Deletar resposta
   */
  async removeReply(userId: string, id: string, userRole: string) {
    const reply = await this.prisma.forumReply.findUnique({
      where: { id },
    });

    if (!reply) {
      throw new NotFoundException('Resposta não encontrada');
    }

    // Apenas o autor ou ADMIN pode deletar
    if (reply.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta resposta',
      );
    }

    return this.prisma.forumReply.delete({
      where: { id },
    });
  }

  // ==================== VOTOS ====================

  /**
   * Votar em tópico
   */
  async voteOnTopic(userId: string, voteTopicDto: VoteTopicDto) {
    const topic = await this.prisma.forumTopic.findUnique({
      where: { id: voteTopicDto.topicId },
    });

    if (!topic) {
      throw new NotFoundException('Tópico não encontrado');
    }

    // Verificar se já votou
    const existingVote = await this.prisma.forumTopicVote.findFirst({
      where: {
        userId,
        topicId: voteTopicDto.topicId,
      },
    });

    if (existingVote) {
      // Se o voto é o mesmo, remover (toggle)
      if (existingVote.value === voteTopicDto.value) {
        await this.prisma.forumTopicVote.delete({
          where: { id: existingVote.id },
        });
        return { message: 'Voto removido' };
      }

      // Se o voto é diferente, atualizar
      await this.prisma.forumTopicVote.update({
        where: { id: existingVote.id },
        data: { value: voteTopicDto.value },
      });
      return { message: 'Voto atualizado' };
    }

    // Criar novo voto
    await this.prisma.forumTopicVote.create({
      data: {
        userId,
        topicId: voteTopicDto.topicId,
        value: voteTopicDto.value,
      },
    });

    return { message: 'Voto registrado' };
  }

  /**
   * Votar em resposta
   */
  async voteOnReply(userId: string, voteReplyDto: VoteReplyDto) {
    const reply = await this.prisma.forumReply.findUnique({
      where: { id: voteReplyDto.replyId },
    });

    if (!reply) {
      throw new NotFoundException('Resposta não encontrada');
    }

    // Verificar se já votou
    const existingVote = await this.prisma.forumReplyVote.findFirst({
      where: {
        userId,
        replyId: voteReplyDto.replyId,
      },
    });

    if (existingVote) {
      // Se o voto é o mesmo, remover (toggle)
      if (existingVote.value === voteReplyDto.value) {
        await this.prisma.forumReplyVote.delete({
          where: { id: existingVote.id },
        });
        return { message: 'Voto removido' };
      }

      // Se o voto é diferente, atualizar
      await this.prisma.forumReplyVote.update({
        where: { id: existingVote.id },
        data: { value: voteReplyDto.value },
      });
      return { message: 'Voto atualizado' };
    }

    // Criar novo voto
    await this.prisma.forumReplyVote.create({
      data: {
        userId,
        replyId: voteReplyDto.replyId,
        value: voteReplyDto.value,
      },
    });

    return { message: 'Voto registrado' };
  }
}
