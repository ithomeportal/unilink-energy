-- Login Audit Logs Table for Carbon Footprint Portal
-- Run this on Aiven PostgreSQL (aivn_datalake_gold database)

CREATE TABLE IF NOT EXISTS login_audit_logs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    verification_code VARCHAR(8),
    code_sent_at TIMESTAMP WITH TIME ZONE,
    code_expires_at TIMESTAMP WITH TIME ZONE,
    code_attempts INTEGER DEFAULT 0,
    login_status VARCHAR(20) NOT NULL,
    failure_reason TEXT,
    session_token VARCHAR(500),
    session_expires_at TIMESTAMP WITH TIME ZONE,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_email ON login_audit_logs(email);
CREATE INDEX IF NOT EXISTS idx_audit_status ON login_audit_logs(login_status);
CREATE INDEX IF NOT EXISTS idx_audit_created ON login_audit_logs(created_at);

-- Example query to find recent logins
-- SELECT * FROM login_audit_logs WHERE login_status = 'verified' ORDER BY created_at DESC LIMIT 10;

-- Example query to find failed attempts from an IP
-- SELECT * FROM login_audit_logs WHERE ip_address = '192.168.1.1' AND login_status = 'failed';
