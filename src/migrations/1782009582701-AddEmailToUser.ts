import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUser1782009582701 implements MigrationInterface {
    name = 'AddEmailToUser1782009582701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_5449d459cd67a5cecb6f56c28c" ON "todo"  ("userId", "title") `);
        await queryRunner.query(`CREATE INDEX "IDX_e383b628056351072a5f483f6b" ON "todo"  ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1e982e43f63a98ad9918a86035" ON "todo"  ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1e982e43f63a98ad9918a86035"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e383b628056351072a5f483f6b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5449d459cd67a5cecb6f56c28c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }

}
