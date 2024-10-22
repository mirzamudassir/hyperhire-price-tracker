import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1729616578245 implements MigrationInterface {
  name = 'SchemaUpdate1729616578245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chain" character varying NOT NULL, "price" numeric(18,8) NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "prices"`);
  }
}
