-- Update auth configuration to set OTP expiry to 30 minutes (1800 seconds)
-- This addresses the security warning about OTP expiry being too long
UPDATE auth.config 
SET 
  otp_expiry = 1800,  -- 30 minutes in seconds
  updated_at = now()
WHERE TRUE;