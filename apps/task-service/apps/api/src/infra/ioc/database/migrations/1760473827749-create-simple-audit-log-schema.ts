import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSimpleAuditLogSchema1760473827749 implements MigrationInterface {
    name = 'CreateSimpleAuditLogSchema1760473827749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_audit_logs_action_enum" AS ENUM('CREATED', 'UPDATED', 'DELETED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'ASSIGNED_USER_ADDED', 'ASSIGNED_USER_REMOVED', 'DUE_DATE_CHANGED')`);
        await queryRunner.query(`CREATE TABLE "task_audit_logs" ("id" uuid NOT NULL, "task_id" uuid NOT NULL, "user_id" uuid NOT NULL, "action" "public"."task_audit_logs_action_enum" NOT NULL, "changes" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d535688da295a45639801474f16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_audit_logs" ADD CONSTRAINT "FK_de3e1bc4f5e2f4994d8e28019d3" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_audit_logs" DROP CONSTRAINT "FK_de3e1bc4f5e2f4994d8e28019d3"`);
        await queryRunner.query(`DROP TABLE "task_audit_logs"`);
        await queryRunner.query(`DROP TYPE "public"."task_audit_logs_action_enum"`);
    }

}
