-- Create the verification_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS "verificationTokens" (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(identifier, token)
);

-- Enable RLS
ALTER TABLE "verificationTokens" ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Verification tokens are accessible by user" ON "verificationTokens"
  FOR ALL USING (true);
