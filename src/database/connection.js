const fs = require('fs');
const pg = require('pg');
const url = require('url');
//create a pool of connection per session
// utilize the connection 
// release it back to pool
let pool;
const config = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./src/database/ca.pem').toString(),
    },
};
const connectDatabase = async () => {

    pool = new pg.Pool(config);

    const client = await pool.connect();

    try {
        const date = await client.query("SELECT NOW()");
        console.log('Current time:', date.rows[0]);

        const userTableExist = await client.query(`SELECT to_regclass('public.users') AS userTableExist;`);
        console.log('userTableExist value', userTableExist.rows[0]);

        if (userTableExist.rows[0].length === 0) {
            console.log('users table does not exist. Creating...');
            const createTableQuery = fs.readFileSync('./src/database/createUserTableQuery.sql').toString();
            const result = await client.query(createTableQuery);
            console.log('users table created:', result);
        }
        const otpTableExist = await client.query(`SELECT to_regclass('public.otps') AS otpTableExist;`);
        console.log('otpTableExist value', otpTableExist.rows[0]);

        if (otpTableExist.rows[0].length) {
            console.log('otps table does not exist. Creating...');
            const createTableQuery = fs.readFileSync('./src/database/createOTPTableQuery.sql').toString();
            const result = await client.query(createTableQuery);
            console.log('otp table created:', result);
        }
    } catch (error) {
        console.error("Database connection error:", error)
        throw error
    } finally {
        client.release();
    }

}
const getPool = () => {
    if (!pool) {
        throw new Error("Database not initialized. Call connectDatabase first.")
    }
    return pool
}

const query = async (text, params) => {
    const client = await pool.connect()
    try {
        const result = await client.query(text, params)
        return result
    } finally {
        client.release()
    }
}

module.exports = {
    connectDatabase,
    getPool,
    query,
}
