-- Update houseguests table based on weeks data
-- This script populates houseguests with their game statistics and status

-- First, let's get the actual UUIDs from the houseguests table and map them to the weeks data
-- We'll need to identify which houseguests correspond to which UUIDs in the weeks table

-- Update houseguests with their game statistics based on weeks data
-- This assumes the UUIDs in the weeks table correspond to specific houseguests

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
