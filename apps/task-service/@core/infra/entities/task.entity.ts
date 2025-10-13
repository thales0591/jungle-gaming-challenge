import { TaskPriority, TaskStatus } from '../../domain/entities/task';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TaskCommentEntity } from './task-comment.entity';
import { UserReadModelEntity } from './user-read-model.entity';

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

  @Column()
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

  @ManyToMany(() => UserReadModelEntity, (user) => user.assignedTasks, {
    cascade: false,
    eager: false,
  })
  @JoinTable({
    name: 'task_assigned_users',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  assignedUsers: UserReadModelEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => TaskCommentEntity, (comment) => comment.task, {
    cascade: true,
  })
  comments?: TaskCommentEntity[];
}
