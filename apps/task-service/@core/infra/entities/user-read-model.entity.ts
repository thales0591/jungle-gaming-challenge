import { Entity, PrimaryColumn, Column } from 'typeorm';

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
}
