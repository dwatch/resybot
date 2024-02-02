import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1706902136810 implements MigrationInterface {
    name = 'Migrations1706902136810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "reservationDate"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "reservationDay" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "reservationTime" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "reservationTime"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "reservationDay"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "reservationDate" TIMESTAMP WITH TIME ZONE`);
    }

}
