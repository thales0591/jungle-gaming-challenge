import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueDescription1760228708979 implements MigrationInterface {
    name = 'RemoveUniqueDescription1760228708979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "UQ_c9f361efbefcdff99c1ccfd1a3f"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "UQ_c9f361efbefcdff99c1ccfd1a3f" UNIQUE ("description")`);
    }

}
