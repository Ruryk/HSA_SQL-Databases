SET GLOBAL max_allowed_packet = 1024 * 1024 * 1024;

SET GLOBAL innodb_flush_log_at_trx_commit  = 0;

CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(100),
    date_of_birth DATE
    );