import { Module } from '@nestjs/common';
import { ITypeOrm } from '../../../../../../@core/infra/typeorm-client';
import { TypeOrmService } from './typeorm.service';
import { NotificationRepository } from '../../../../../../@core/domain/ports';
import { TypeOrmNotificationRepository } from '../../../../../../@core/infra/adapters/typeorm-notification-repository';

@Module({
  providers: [
    {
      provide: ITypeOrm,
      useClass: TypeOrmService,
    },
    {
      provide: NotificationRepository,
      useFactory: (orm: ITypeOrm) => {
        return new TypeOrmNotificationRepository(orm);
      },
      inject: [ITypeOrm],
    },
  ],
  exports: [NotificationRepository, ITypeOrm],
})
export class DatabaseModule {}
