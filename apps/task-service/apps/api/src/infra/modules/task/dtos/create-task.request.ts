import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@core/domain/entities/task';

export class CreateTaskRequest {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  dueDate?: Date | null;

  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority: TaskPriority;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  assignedUserIds: string[];
}
