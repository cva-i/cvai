import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordHashToUser1762334768976 implements MigrationInterface {
    name = 'AddPasswordHashToUser1762334768976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "passwordHash" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "googleId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "googleId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordHash"`);
    }

}
