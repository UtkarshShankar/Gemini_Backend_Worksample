const { query } = require('../database/connection');
const generateOTP = require('../utils/otpUtil');
class AuthService {
  async signup(mobileNumber, user_name, email) {
    try {
      const checkUserExist = await query(`SELECT id FROM users WHERE mobile_number = $1`, [mobileNumber]);
      console.log(checkUserExist.rows.length);
      if (checkUserExist.rows.length > 0) {
        throw new Error("User already exists with this mobile number")
      }
      //returning added to add and immediately retreive the added row 
      // else we need to run seperate select id query
      const result = await query(`INSERT INTO users (mobile_number, full_name, email)VALUES ($1, $2, $3) RETURNING *;`, [mobileNumber, user_name, email]);
      return result.rows[0]
    } catch (error) {
      throw error;
    }
  }
  async sendOTP(mobileNumber, purpose = "login") {
    try {
      const otp = generateOTP()
      //TTL Hard coded as 10 minutes
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Delete any existing unused OTPs for this mobile number and purpose
      await query("DELETE FROM otps WHERE mobile_number = $1 AND purpose = $2 AND is_used = FALSE", [
        mobileNumber,
        purpose,
      ])

      // Insert new OTP
      await query(
        `INSERT INTO otps (mobile_number, otp_code, purpose, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [mobileNumber, otp, purpose, expiresAt],
      )

      // In a real application, you would send SMS here
      // For this assignment, we return the OTP in the response
      return {
        otp,
        expiresAt,
        message: "OTP sent successfully",
      }
    } catch (error) {
      throw error
    }
  }
  async isValidOTP(mobileNumber, otp) {
    try {
      const timeNow = new Date(Date.now());
      const otpId = await query("SELECT id, otp_code, expires_at FROM otps WHERE mobile_number = $1", [
        mobileNumber,
      ])
      console.log(otpId.rows);
      if (otpId.rows.length > 0) {
        let expiryTimeRaw = otpId.rows[0].expires_at; // Store the raw value
        expiryTimeRaw = Date.parse(expiryTimeRaw);
        let expiryTime = new Date(expiryTimeRaw);

        //Db epiry value is +10 mins so value is -ve is valid case
        if (((timeNow - expiryTime) / (1000 * 60)) > 0) {
          console.error("OTP expired");
          throw new Error("Otp Expired");
        } else {
          let dbOtp = otpId.rows[0].otp_code;
          if (otp === dbOtp) {

            //get user details
            let userResult = await query("SELECT * FROM users WHERE mobile_number = $1", [mobileNumber]);
            console.log("User Exist: " + userResult.rows.length);
            if (userResult.rows.length === 0) {
              // Create user if doesn't exist (for login flow)
              userResult = await query(
                `INSERT INTO users (mobile_number) VALUES ($1) RETURNING *`, [mobileNumber],
              )
            }
            return {
              userDetails: {
                id: userResult.rows[0].id,
                mobileNumber: userResult.rows[0].mobile_number,
                fullName: userResult.rows[0].full_name,
                email: userResult.rows[0].email,
                subscriptionTier: userResult.rows[0].subscription_tier,
                subscriptionStatus: userResult.rows[0].subscription_status,
              },
              message: "Valid Otp"
            }
          } else {
            console.error("OTP does not match");
            throw new Error("Otp does not match");
          }
        }
      } else {
        console.error("Invalid Mobile number");
        throw new Error("Invalid Mobile number");
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = new AuthService()