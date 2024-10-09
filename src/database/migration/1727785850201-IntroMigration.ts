import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntroMigration1727785850201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const commentDDL = `
        CREATE TABLE tb_vm_comment (
            address varchar(100) NOT NULL,
            comment varchar(1000) NOT NULL,
            vh_email_id int(11) NOT NULL,
            use_yn char(1) NOT NULL DEFAULT 'Y',
            creator varchar(255) NOT NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updator varchar(255) NOT NULL,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL ,
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
            file_id int(11) NOT NULL,
            use_yn char(1) NOT NULL DEFAULT 'Y',
            creator varchar(255) NOT NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updator varchar(255) NOT NULL,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL ,
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
            created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updator varchar(255) NOT NULL,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL ,
            PRIMARY KEY (vh_email_id),
            INDEX ix_vh_email_01 (address)
          ) ENGINE=InnoDB 
          DEFAULT CHARSET=utf8mb4 
          COLLATE=utf8mb4_unicode_ci;
        `;
    const fileDDL = `
        CREATE TABLE tb_vm_file (
            file_id int(11) NOT NULL AUTO_INCREMENT,
            path varchar(255) NOT NULL,
            use_yn char(1) NOT NULL DEFAULT 'Y',
            creator varchar(255) NOT NULL,
            created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updator varchar(255) NOT NULL,
            updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL ,
            PRIMARY KEY (file_id)
          ) ENGINE=InnoDB 
          DEFAULT CHARSET=utf8mb4 
          COLLATE=utf8mb4_unicode_ci;
        `;

    await queryRunner.query(commentDDL);
    await queryRunner.query(userDDL);
    await queryRunner.query(emailHistoryDDL);
    await queryRunner.query(fileDDL);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tb_vm_comment`);
    await queryRunner.query(`DROP TABLE tb_vm_user`);
    await queryRunner.query(`DROP TABLE tb_vh_email`);
    await queryRunner.query(`DROP TABLE tb_vm_file`);
  }
}
