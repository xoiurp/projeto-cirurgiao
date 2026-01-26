import { IsUUID, IsIn } from 'class-validator';

export class VoteTopicDto {
  @IsUUID()
  topicId: string;

  @IsIn([1, -1], { message: 'O voto deve ser 1 (upvote) ou -1 (downvote)' })
  value: number;
}

export class VoteReplyDto {
  @IsUUID()
  replyId: string;

  @IsIn([1, -1], { message: 'O voto deve ser 1 (upvote) ou -1 (downvote)' })
  value: number;
}
