export const generateUsers = (req, res) => {
    const limit = req.body.limit || 1000000; // Default limit to 1,000,000 if not provided
    const users = [];
    const startDate = new Date('1990-01-01');
    const endDate = new Date('2000-01-01');
    const dateRange = endDate - startDate;

    for (let i = 0; i < limit; i++) {
        const name = `User${ Math.floor(Math.random() * 100000) }`;
        const randomDate = new Date(startDate.getTime() + Math.random() * dateRange);
        const formattedDate = randomDate.toISOString().split('T')[0]; // Форматування дати у вигляді YYYY-MM-DD
        users.push([name, formattedDate]);
    }

    const query = 'INSERT INTO users (name, date_of_birth) VALUES ?';
    const startTime = process.hrtime();
    res.app.locals.connection.query(query, [users], (err) => {
        if (err) {
            console.error('Error inserting users:', err);
            res.status(500).send(err);
            return;
        }
        const endTime = process.hrtime(startTime);
        const executionTime = endTime[0] * 1000 + endTime[1] / 1000000;
        res.json({ limit: `${ limit } users generated successfully` , executionTime });
    });
};

export const getCountWithoutIndex = (req, res) => {
    const query = "SELECT COUNT(*) AS count FROM users WHERE date_of_birth = '1990-01-01'";
    executeCountQuery(query, res);
};

export const getCountWithBtreeIndex = (req, res) => {
    const checkIndexQuery = "SHOW INDEX FROM users WHERE Key_name = 'idx_dob_btree'";
    res.app.locals.connection.query(checkIndexQuery, (err, results) => {
        if (err) {
            console.error('Error checking BTREE index:', err);
            res.status(500).send('Error checking BTREE index');
            return;
        }
        if (results.length === 0) {
            const createIndexQuery = "CREATE INDEX idx_dob_btree ON users(date_of_birth) USING BTREE";
            res.app.locals.connection.query(createIndexQuery, (err) => {
                if (err) {
                    console.error('Error creating BTREE index:', err);
                    res.status(500).send('Error creating BTREE index');
                    return;
                }
                executeCountQuery("SELECT COUNT(*) AS count FROM users WHERE date_of_birth = '1990-01-01'", res);
            });
        } else {
            executeCountQuery("SELECT COUNT(*) AS count FROM users WHERE date_of_birth = '1990-01-01'", res);
        }
    });
};

export const getCountWithHashIndex = (req, res) => {
    const checkIndexQuery = "SHOW INDEX FROM users WHERE Key_name = 'idx_dob_hash'";
    res.app.locals.connection.query(checkIndexQuery, (err, results) => {
        if (err) {
            console.error('Error checking HASH index:', err);
            res.status(500).send('Error checking HASH index');
            return;
        }
        if (results.length === 0) {
            const createIndexQuery = "CREATE INDEX idx_dob_hash ON users(date_of_birth) USING HASH";
            res.app.locals.connection.query(createIndexQuery, (err) => {
                if (err) {
                    console.error('Error creating HASH index:', err);
                    res.status(500).send('Error creating HASH index');
                    return;
                }
                executeCountQuery("SELECT COUNT(*) AS count FROM users WHERE date_of_birth = '1990-01-01'", res);
            });
        } else {
            executeCountQuery("SELECT COUNT(*) AS count FROM users WHERE date_of_birth = '1990-01-01'", res);
        }
    });
};

const executeCountQuery = (query, res) => {
    measureExecutionTime(query, (err, results, executionTime) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        res.json({ results, executionTime });
    }, res.app.locals.connection);
};

const measureExecutionTime = (query, callback, connection) => {
    const startTime = process.hrtime();
    connection.query(query, (err, results) => {
        const endTime = process.hrtime(startTime);
        const executionTime = endTime[0] * 1000 + endTime[1] / 1000000;
        callback(err, results, executionTime);
    });
};
