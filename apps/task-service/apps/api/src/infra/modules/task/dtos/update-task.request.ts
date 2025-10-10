import { IsEnum, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';
import { TaskPriority, TaskStatus } from '@core/domain/entities/task';

export class UpdateTaskRequest {
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  dueDate?: Date | null;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  assignedUserIds?: string[];
}
