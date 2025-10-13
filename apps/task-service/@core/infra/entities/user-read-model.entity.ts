import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity({ name: 'users_read_model' })
export class UserReadModelEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToMany(() => TaskEntity, (task) => task.assignedUsers)
  assignedTasks: TaskEntity[];
}
