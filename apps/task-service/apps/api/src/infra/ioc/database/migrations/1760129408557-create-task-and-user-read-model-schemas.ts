import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskAndUserReadModelSchemas1760129408557 implements MigrationInterface {
    name = 'CreateTaskAndUserReadModelSchemas1760129408557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_read_model" ("id" uuid NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_3810c46605a4a4844b116b59505" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL, "authorId" uuid NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "due_date" TIMESTAMP, "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'MEDIUM', "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'TODO', "assigned_user_ids" uuid array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c9f361efbefcdff99c1ccfd1a3f" UNIQUE ("description"), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TABLE "users_read_model"`);
    }

}
