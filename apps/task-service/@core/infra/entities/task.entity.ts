import { TaskPriority, TaskStatus } from '../../domain/entities/task';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TaskCommentEntity } from './task-comment.entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  authorId: string;

  @Column()
  title: string;

  @Column({ unique: true })
  description: string;

  @Column({ name: 'due_date', type: 'timestamp', nullable: true })
  dueDate: Date | null;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'uuid',
    array: true,
    name: 'assigned_user_ids',
    default: '{}',
  })
  assignedUserIds: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => TaskCommentEntity, (comment) => comment.task, {
    cascade: true,
  })
  comments?: TaskCommentEntity[];
}
