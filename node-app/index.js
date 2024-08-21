import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const connectWithRetry = () => {
    const connection = mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'testdb',
        port: 3306  // Порт всередині контейнера MySQL
    });

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to the database:', err);
            setTimeout(connectWithRetry, 5000); // Повторна спроба через 5 секунд
        } else {
            console.log('Connected to the database');
            startServer(connection);
        }
    });
};

const checkDatabaseReady = (callback) => {
    const connection = mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'root',
        port: 3306  // Порт всередині контейнера MySQL
    });

    connection.query('SELECT 1', (err) => {
        if (err) {
            console.error('Database not ready, retrying...', err);
            setTimeout(() => checkDatabaseReady(callback), 5000); // Повторна спроба через 5 секунд
        } else {
            console.log('Database is ready');
            connection.end();
            callback();
        }
    });
};

const startServer = (connection) => {


    const executeCountQuery = (res) => {
        const query = "SELECT COUNT(*) AS count FROM users WHERE date_of_birth = '1990-01-01'";
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error executing query');
                return;
            }
            res.json(results);
        });
    }

    app.get('/users', (req, res) => {
        const limit = parseInt(req.query.limit, 10) || 1000; // Default limit to 100 if not provided
        const query = `SELECT *
                       FROM users LIMIT ${ limit }`;
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error executing query');
                return;
            }
            res.json(results);
        });
    });

    app.get('/users/no-index', (req, res) => {
        const query = "SELECT COUNT(*) AS count FROM users WHERE date_of_birth = '1990-01-01'";
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Error executing query');
                return;
            }
            res.json(results);
        });
    });

    app.get('/users/btree-index', (req, res) => {
        const checkIndexQuery = "SHOW INDEX FROM users WHERE Key_name = 'idx_dob_btree'";
        connection.query(checkIndexQuery, (err, results) => {
            if (err) {
                console.error('Error checking BTREE index:', err);
                res.status(500).send('Error checking BTREE index');
                return;
            }
            if (results.length === 0) {
                const createIndexQuery = "CREATE INDEX idx_dob_btree ON users(date_of_birth) USING BTREE";
                connection.query(createIndexQuery, (err) => {
                    if (err) {
                        console.error('Error creating BTREE index:', err);
                        res.status(500).send('Error creating BTREE index');
                        return;
                    }
                    executeCountQuery(res);
                });
            } else {
                executeCountQuery(res);
            }
        });
    });

    app.get('/users/hash-index', (req, res) => {
        const checkIndexQuery = "SHOW INDEX FROM users WHERE Key_name = 'idx_dob_hash'";
        connection.query(checkIndexQuery, (err, results) => {
            if (err) {
                console.error('Error checking HASH index:', err);
                res.status(500).send('Error checking HASH index');
                return;
            }
            if (results.length === 0) {
                const createIndexQuery = "CREATE INDEX idx_dob_hash ON users(date_of_birth) USING HASH";
                connection.query(createIndexQuery, (err) => {
                    if (err) {
                        console.error('Error creating HASH index:', err);
                        res.status(500).send('Error creating HASH index');
                        return;
                    }
                    executeCountQuery(res);
                });
            } else {
                executeCountQuery(res);
            }
        });
    });

    app.post('/generate-users', (req, res) => {
        const limit = req.body.limit || 1000000; // Default limit to 1,000,000 if not provided
        const users = [];
        for (let i = 0; i < limit; i++) {
            const name = `User${ Math.floor(Math.random() * 1000000) }`;
            users.push([name, '1990-01-01']);
        }

        const query = 'INSERT INTO users (name, date_of_birth) VALUES ?';
        connection.query(query, [users], (err) => {
            if (err) {
                console.error('Error inserting users:', err);
                res.status(500).send(err);
                return;
            }
            res.send(`${ limit } users generated successfully`);
        });
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${ port }`);
    });
};

checkDatabaseReady(connectWithRetry);
