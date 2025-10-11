import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskCommentRequest {
  @IsNotEmpty()
  @IsString()
  content: string;
}
