import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateManyToManyRelationBetweenTaskAndUserreadmodel1760323643753 implements MigrationInterface {
    name = 'CreateManyToManyRelationBetweenTaskAndUserreadmodel1760323643753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_assigned_users" ("task_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_3ce7f777852b801f867f27d827d" PRIMARY KEY ("task_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e8f3c575fe751b962526aeab6f" ON "task_assigned_users" ("task_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_702aaad6b621f91f38953ae923" ON "task_assigned_users" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "assigned_user_ids"`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users" ADD CONSTRAINT "FK_e8f3c575fe751b962526aeab6f9" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users" ADD CONSTRAINT "FK_702aaad6b621f91f38953ae9239" FOREIGN KEY ("user_id") REFERENCES "users_read_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assigned_users" DROP CONSTRAINT "FK_702aaad6b621f91f38953ae9239"`);
        await queryRunner.query(`ALTER TABLE "task_assigned_users" DROP CONSTRAINT "FK_e8f3c575fe751b962526aeab6f9"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "assigned_user_ids" uuid array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_702aaad6b621f91f38953ae923"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e8f3c575fe751b962526aeab6f"`);
        await queryRunner.query(`DROP TABLE "task_assigned_users"`);
    }

}
