const {query} = require('../database/connection');

class AuthService {
    async signup(mobileNumber, user_name, email) {
        try {
            const checkUserExist = await query(`SELECT id FROM users WHERE mobile_number = $1`,[mobileNumber]);
            console.log(checkUserExist.rows.length);
            if (checkUserExist.rows.length >0) {
                throw new Error("User already exists with this mobile number")
            }
            //returning added to add and immediately retreive the added row 
            // else we need to run seperate select id query
            const result = await query(`INSERT INTO users (mobile_number, full_name, email)VALUES ($1, $2, $3) RETURNING *;`,[mobileNumber, user_name, email]);
            return result.rows[0]
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService()