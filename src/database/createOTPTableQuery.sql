CREATE TABLE IF NOT EXISTS otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile_number VARCHAR(15) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )