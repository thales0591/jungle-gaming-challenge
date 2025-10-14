import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';
import { TaskAuditAction } from '../../domain/entities/task-audit-log';
import type { AuditLogChanges } from '../../domain/entities/task-audit-log';

@Entity({ name: 'task_audit_logs' })
export class TaskAuditLogEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'task_id' })
  taskId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TaskAuditAction,
  })
  action: TaskAuditAction;

  @Column({ type: 'jsonb' })
  changes: AuditLogChanges;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => TaskEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task?: TaskEntity;
}
