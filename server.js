require("dotenv").config()
const express = require('express');
const { connectDatabase } = require('./src/database/connection.js');

async function startServer() {
    try {
        // Connect to database
        console.log(process.env.POSTGRES_PASSWORD);
        await connectDatabase()
        console.log("Database connected successfully");
    } catch (error) {
        console.error(" Failed to start server:", error)
        process.exit(1)
    }
}

startServer();
