-- SET GLOBAL innodb_flush_log_at_trx_commit = 0;
-- SET GLOBAL innodb_flush_log_at_trx_commit = 1;
SET GLOBAL innodb_flush_log_at_trx_commit = 2;

CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(100),
    date_of_birth DATE
    );