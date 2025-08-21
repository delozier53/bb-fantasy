-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE status_enum AS ENUM ('IN', 'EVICTED');

-- Create houseguests table
CREATE TABLE houseguests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoUrl" TEXT,
    bio TEXT,
    status status_enum DEFAULT 'IN',
    "evictionWeek" INTEGER,
    "evictionVote" TEXT,
    "onTheBlockWeeks" INTEGER[] DEFAULT '{}',
    "hohWins" INTEGER[] DEFAULT '{}',
    "povWins" INTEGER[] DEFAULT '{}',
    "blockbusterWins" INTEGER[] DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    "photoUrl" TEXT,
    "isAdmin" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create picks table
CREATE TABLE picks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "houseguestId" UUID NOT NULL REFERENCES houseguests(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("userId", "houseguestId")
);

-- Create weeks table
CREATE TABLE weeks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week INTEGER UNIQUE NOT NULL,
    "hohCompetition" TEXT,
    "hohWinnerId" UUID REFERENCES houseguests(id),
    nominees TEXT[] DEFAULT '{}',
    "povCompetition" TEXT,
    "povWinnerId" UUID REFERENCES houseguests(id),
    "povUsed" BOOLEAN,
    "povRemovedNomineeId" UUID REFERENCES houseguests(id),
    "povReplacementId" UUID REFERENCES houseguests(id),
    "blockbusterCompetition" TEXT,
    "blockbusterWinnerId" UUID REFERENCES houseguests(id),
    "evictedNomineeId" UUID REFERENCES houseguests(id),
    "evictionVote" TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create NextAuth tables
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, "providerAccountId")
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE "verificationTokens" (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(identifier, token)
);

-- Create indexes for better performance
CREATE INDEX idx_houseguests_slug ON houseguests(slug);
CREATE INDEX idx_houseguests_status ON houseguests(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_picks_user_id ON picks("userId");
CREATE INDEX idx_picks_houseguest_id ON picks("houseguestId");
CREATE INDEX idx_weeks_week ON weeks(week);

-- Enable Row Level Security (RLS)
ALTER TABLE houseguests ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verificationTokens" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Houseguests: Read access for everyone
CREATE POLICY "Houseguests are viewable by everyone" ON houseguests
    FOR SELECT USING (true);

-- Users: Read access for everyone, write access for own user
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Picks: Users can only see and modify their own picks
CREATE POLICY "Users can view own picks" ON picks
    FOR SELECT USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can insert own picks" ON picks
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update own picks" ON picks
    FOR UPDATE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete own picks" ON picks
    FOR DELETE USING (auth.uid()::text = "userId"::text);

-- Weeks: Read access for everyone (admin write access will be handled in API)
CREATE POLICY "Weeks are viewable by everyone" ON weeks
    FOR SELECT USING (true);

-- NextAuth tables: Full access (handled by NextAuth)
CREATE POLICY "Accounts are accessible by user" ON accounts
    FOR ALL USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Sessions are accessible by user" ON sessions
    FOR ALL USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Verification tokens are accessible by user" ON "verificationTokens"
    FOR ALL USING (true);

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
CREATE TRIGGER update_houseguests_updated_at BEFORE UPDATE ON houseguests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weeks_updated_at BEFORE UPDATE ON weeks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
