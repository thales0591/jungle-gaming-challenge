import { DEFAULT_PAGE, DEFAULT_SIZE } from '@core/application/constants';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsEnum, IsIn } from 'class-validator';
import { TaskStatus, TaskPriority } from '@core/domain/entities/task';

export type TaskSortBy = 'newest' | 'oldest' | 'due-date' | 'priority';

export class GetPaginatedTasksQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number = DEFAULT_SIZE;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsIn(['newest', 'oldest', 'due-date', 'priority'])
  sortBy?: TaskSortBy;
}
