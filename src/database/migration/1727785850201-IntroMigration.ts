import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntroMigration1727785850201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const commentDDL = `
        CREATE TABLE tb_vm_comment (
            address varchar(100) NOT NULL,
            comment varchar(1000) NOT NULL,
            use_yn char(1) NOT NULL DEFAULT 'Y',
            creator varchar(255) NOT NULL,
            createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updator varchar(255) NOT NULL,
            updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL ,
            PRIMARY KEY (address)
          ) ENGINE=InnoDB 
          DEFAULT CHARSET=utf8mb4 
          COLLATE=utf8mb4_unicode_ci;
        `;
    const userDDL = `
        CREATE TABLE tb_vm_user (
            address varchar(100) NOT NULL,
            name varchar(50) NOT NULL,
            company varchar(50) DEFAULT NULL ,
            use_yn char(1) NOT NULL DEFAULT 'Y',
            creator varchar(255) NOT NULL,
            createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updator varchar(255) NOT NULL,
            updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL ,
            PRIMARY KEY (address)
          ) ENGINE=InnoDB 
          DEFAULT CHARSET=utf8mb4 
          COLLATE=utf8mb4_unicode_ci;
        `;

    const emailHistoryDDL = `
        CREATE TABLE tb_vh_email (
            vh_email_id int(11) NOT NULL AUTO_INCREMENT,
            address varchar(100) NOT NULL,
            verify_yn char(1) NOT NULL DEFAULT 'N',
            use_yn char(1) NOT NULL DEFAULT 'Y',
            creator varchar(255) NOT NULL,
            createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updator varchar(255) NOT NULL,
            updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL ,
            PRIMARY KEY (vh_email_id),
            INDEX ix_vh_email_01 (address)
          ) ENGINE=InnoDB 
          DEFAULT CHARSET=utf8mb4 
          COLLATE=utf8mb4_unicode_ci;
        `;

    await queryRunner.query(commentDDL);
    await queryRunner.query(userDDL);
    await queryRunner.query(emailHistoryDDL);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tb_vm_comment`);
    await queryRunner.query(`DROP TABLE tb_vm_user`);
    await queryRunner.query(`DROP TABLE tb_vh_email`);
  }
}
