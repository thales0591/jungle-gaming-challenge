import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationSchema1760583223459 implements MigrationInterface {
    name = 'CreateNotificationSchema1760583223459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "content" text NOT NULL, "have_been_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9a8a82462cab47c73d25f49261" ON "notifications" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_62d905746072a429630febc3dd" ON "notifications" ("have_been_read") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_62d905746072a429630febc3dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a8a82462cab47c73d25f49261"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
