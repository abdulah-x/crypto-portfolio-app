-- Migration: Add OAuth columns to users table
-- Date: 2024
-- Description: Adds oauth_provider and oauth_id columns to support Google OAuth authentication

-- Add oauth_provider column (e.g., 'google', 'apple', 'github')
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(20);

-- Add oauth_id column (stores unique ID from OAuth provider)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255);

-- Create index on oauth_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_oauth_id ON users(oauth_id);

-- Create composite index for (oauth_provider, oauth_id) for unique lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_oauth_provider_id ON users(oauth_provider, oauth_id) WHERE oauth_provider IS NOT NULL AND oauth_id IS NOT NULL;

-- Add comment to explain the columns
COMMENT ON COLUMN users.oauth_provider IS 'OAuth provider used for authentication (e.g., google, apple, github)';
COMMENT ON COLUMN users.oauth_id IS 'Unique identifier from the OAuth provider';
