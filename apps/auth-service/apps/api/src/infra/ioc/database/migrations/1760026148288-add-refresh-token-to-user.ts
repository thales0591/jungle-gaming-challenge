import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1760026148288 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1760026148288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
    }

}
