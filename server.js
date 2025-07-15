require("dotenv").config()
const express = require('express');
const { connectDatabase } = require('./src/database/connection.js');
const app = express()
const routes = require('./src/routes');
const PORT = process.env.PORT || 3000; 

//nodemon = node + monitor

//Prevents users from sending overly large JSON payloads that can overwhelm your server memory or
//  cause DoS (Denial of Service).
app.use(express.json({ limit: "10mb" }))
app.use('/api' , routes);
app.use('/chatroom', (req , res) => {
    res.send('<h1>Welcome to Gemini! Please enter a Log in or Sign up.</h1>');
})
async function startServer() {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      //not yet working
    })
    try {
        // Connect to database
        //test log to see if env variables are accessible  
        // console.log(process.env.POSTGRES_PASSWORD);
        await connectDatabase()
        console.log("Database connected successfully");
    } catch (error) {
        console.error(" Failed to start server:", error)
        process.exit(1)
    }
}

startServer();
