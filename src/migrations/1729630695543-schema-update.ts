import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1729630695543 implements MigrationInterface {
  name = 'SchemaUpdate1729630695543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "alerts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chain" character varying NOT NULL, "price" numeric(18,8) NOT NULL, "email" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_60f895662df096bfcdfab7f4b96" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "alerts"`);
  }
}
