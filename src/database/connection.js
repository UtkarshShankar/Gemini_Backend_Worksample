const fs = require('fs');
const pg = require('pg');
const url = require('url');
// require("dotenv").config()
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

    const client = new pg.Client(config);
    client.connect(async function (err) {
        if (err)
            throw err;
        client.query("SELECT VERSION()", [], function (err, result) {
            if (err)
                throw err;

            console.log(result.rows[0].version);


        });
        const date = await client.query("SELECT NOW()");
        console.log(date.rows[0].now);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
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
