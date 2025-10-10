-- Database initialization script for Bus Tracking System
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create a read-only user for monitoring (optional)
-- CREATE USER bus_tracking_readonly WITH PASSWORD 'readonly_password';
-- GRANT CONNECT ON DATABASE bus_tracking TO bus_tracking_readonly;
-- GRANT USAGE ON SCHEMA public TO bus_tracking_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO bus_tracking_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO bus_tracking_readonly;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Bus Tracking System database initialized successfully!';
END $$;
