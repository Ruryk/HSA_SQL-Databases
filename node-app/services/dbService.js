import mysql from "mysql2";

export const connectWithRetry = (callback) => {
    const connection = mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'testdb',
        port: 3306,
    });

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to the database:', err);
            setTimeout(() => connectWithRetry(callback), 5000);
        } else {
            console.log('Connected to the database');
            callback(connection);
        }
    });
};

export const checkDatabaseReady = (callback) => {
    const connection = mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'root',
        port: 3306  // Порт всередині контейнера MySQL
    });

    connection.query('SELECT 1', (err) => {
        if (err) {
            console.error('Database not ready, retrying...', err);
            setTimeout(() => checkDatabaseReady(callback), 5000);
        } else {
            console.log('Database is ready');
            connection.end();
            callback();
        }
    });
};
