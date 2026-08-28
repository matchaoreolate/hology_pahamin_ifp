-- PostgreSQL initialization script
-- Runs automatically when container first starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search later

-- Create default schema
SET search_path TO public;
