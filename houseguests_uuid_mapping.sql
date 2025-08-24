-- Houseguests UUID Mapping and Game Statistics Update
-- This script assigns specific UUIDs to houseguests and updates their game statistics
-- Based on the actual houseguests for this season from the admin seed route

-- First, let's assign specific UUIDs to houseguests based on the weeks data
-- We'll use the UUIDs that appear in the weeks table for the houseguests in this season

-- Update houseguests with specific UUIDs (these should match the UUIDs used in weeks table)
-- These are the houseguests that are actually participating in the game this season
UPDATE houseguests SET id = 'a0a1bbcb-f9c5-4ff6-9db2-3d79effe220b' WHERE slug = 'rylie-jeffries';
UPDATE houseguests SET id = 'bdc4c8f7-a2c3-48b3-88fd-108324327fe8' WHERE slug = 'isaiah-frederich';
UPDATE houseguests SET id = 'befc51b4-a636-48d6-ae18-d3e32ceeaad8' WHERE slug = 'ashley-hollis';
UPDATE houseguests SET id = 'a439bc47-0682-40b7-bf4c-a065f5f324c2' WHERE slug = 'adrian-rocha';
UPDATE houseguests SET id = 'f5a6eec8-938f-4e6d-bd76-7c60ae57ef1e' WHERE slug = 'cliffton-williams';
UPDATE houseguests SET id = 'e81aacc1-a052-42c4-beca-2a1ad3ae632d' WHERE slug = 'jimmy-heagerty';
UPDATE houseguests SET id = 'f882c3d7-feba-4719-8ecc-590aebf22734' WHERE slug = 'katherine-woodman';
UPDATE houseguests SET id = '16809d92-927f-477f-adea-5ef447c8b893' WHERE slug = 'keanu-soto';
UPDATE houseguests SET id = '66f2f964-218f-45de-9b51-ec606e45633b' WHERE slug = 'kelley-jorgensen';
UPDATE houseguests SET id = '1153f4d4-a640-4ca3-9ae6-9af7a073d7f7' WHERE slug = 'lauren-domingue';
UPDATE houseguests SET id = '92f573f4-68c2-4bb7-b9c8-b1c44de00c01' WHERE slug = 'mickey-lee';
UPDATE houseguests SET id = '94d9ce0f-4838-48fa-8a68-3243aafc49b2' WHERE slug = 'morgan-pope';
UPDATE houseguests SET id = '2389caf3-98af-4cf6-b2a9-85698a09f32f' WHERE slug = 'vince-panaro';

-- The remaining houseguests are not in the game, so they keep their random UUIDs
-- amy-bingham, ava-pearl, zach-cornell, rachel-reilly

-- Now update the houseguests table with game statistics based on weeks data

-- Update HOH wins for each houseguest
UPDATE houseguests 
SET "hohWins" = (
  SELECT ARRAY_AGG(week ORDER BY week)
  FROM weeks 
  WHERE "hohWinnerId" = houseguests.id
)
WHERE EXISTS (
  SELECT 1 FROM weeks WHERE "hohWinnerId" = houseguests.id
);

-- Update POV wins for each houseguest
UPDATE houseguests 
SET "povWins" = (
  SELECT ARRAY_AGG(week ORDER BY week)
  FROM weeks 
  WHERE "povWinnerId" = houseguests.id
)
WHERE EXISTS (
  SELECT 1 FROM weeks WHERE "povWinnerId" = houseguests.id
);

-- Update Blockbuster wins for each houseguest
UPDATE houseguests 
SET "blockbusterWins" = (
  SELECT ARRAY_AGG(week ORDER BY week)
  FROM weeks 
  WHERE "blockbusterWinnerId" = houseguests.id
)
WHERE EXISTS (
  SELECT 1 FROM weeks WHERE "blockbusterWinnerId" = houseguests.id
);

-- Update nomination weeks for each houseguest
UPDATE houseguests 
SET "onTheBlockWeeks" = (
  SELECT ARRAY_AGG(week ORDER BY week)
  FROM weeks 
  WHERE houseguests.id = ANY(nominees)
)
WHERE EXISTS (
  SELECT 1 FROM weeks WHERE houseguests.id = ANY(nominees)
);

-- Update eviction information for evicted houseguests
UPDATE houseguests 
SET 
  status = 'EVICTED',
  "evictionWeek" = (
    SELECT week 
    FROM weeks 
    WHERE "evictedNomineeId" = houseguests.id
    LIMIT 1
  ),
  "evictionVote" = (
    SELECT "evictionVote" 
    FROM weeks 
    WHERE "evictedNomineeId" = houseguests.id
    LIMIT 1
  )
WHERE EXISTS (
  SELECT 1 FROM weeks WHERE "evictedNomineeId" = houseguests.id
);

-- Set status to 'IN' for houseguests who are not evicted
UPDATE houseguests 
SET status = 'IN'
WHERE status IS NULL OR status = 'IN';

-- Update the updatedAt timestamp for all modified records
UPDATE houseguests 
SET "updatedAt" = NOW()
WHERE "updatedAt" < NOW();

-- Display summary of updates
SELECT 
  COUNT(*) as total_houseguests,
  COUNT(CASE WHEN status = 'EVICTED' THEN 1 END) as evicted_count,
  COUNT(CASE WHEN status = 'IN' THEN 1 END) as remaining_count,
  COUNT(CASE WHEN array_length("hohWins", 1) > 0 THEN 1 END) as hoh_winners,
  COUNT(CASE WHEN array_length("povWins", 1) > 0 THEN 1 END) as pov_winners,
  COUNT(CASE WHEN array_length("blockbusterWins", 1) > 0 THEN 1 END) as blockbuster_winners,
  COUNT(CASE WHEN array_length("onTheBlockWeeks", 1) > 0 THEN 1 END) as nominated_houseguests
FROM houseguests;

-- Display detailed houseguest statistics for houseguests in the game
SELECT 
  "firstName",
  "lastName",
  status,
  "evictionWeek",
  "evictionVote",
  "hohWins",
  "povWins", 
  "blockbusterWins",
  "onTheBlockWeeks"
FROM houseguests
WHERE id IN (
  'a0a1bbcb-f9c5-4ff6-9db2-3d79effe220b',
  'bdc4c8f7-a2c3-48b3-88fd-108324327fe8',
  'befc51b4-a636-48d6-ae18-d3e32ceeaad8',
  'a439bc47-0682-40b7-bf4c-a065f5f324c2',
  'f5a6eec8-938f-4e6d-bd76-7c60ae57ef1e',
  'e81aacc1-a052-42c4-beca-2a1ad3ae632d',
  'f882c3d7-feba-4719-8ecc-590aebf22734',
  '16809d92-927f-477f-adea-5ef447c8b893',
  '66f2f964-218f-45de-9b51-ec606e45633b',
  '1153f4d4-a640-4ca3-9ae6-9af7a073d7f7',
  '92f573f4-68c2-4bb7-b9c8-b1c44de00c01',
  '94d9ce0f-4838-48fa-8a68-3243aafc49b2',
  '2389caf3-98af-4cf6-b2a9-85698a09f32f'
)
ORDER BY "firstName", "lastName";
