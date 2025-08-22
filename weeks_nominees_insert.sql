-- Insert weeks data with correct nominees format for Supabase
-- Using actual houseguest UUIDs provided by user

INSERT INTO weeks (
  week,
  hohCompetition,
  hohWinnerId,
  nominees,
  povCompetition,
  povWinnerId,
  povUsed,
  povRemovedNomineeId,
  povReplacementId,
  blockbusterCompetition,
  blockbusterWinnerId,
  evictedNomineeId,
  evictionVote,
  createdAt,
  updatedAt
) VALUES
-- Week 1
(
  1,
  'Physical Challenge',
  'a0a1bbcb-f9c5-4ff6-9db2-3d79effe220b',  -- HOH Winner
  ARRAY[
    'bdc4c8f7-a2c3-48b3-88fd-108324327fe8',
    'befc51b4-a636-48d6-ae18-d3e32ceeaad8'
  ],
  'Mental Challenge',
  'a439bc47-0682-40b7-bf4c-a065f5f324c2',  -- POV Winner
  true,
  'bdc4c8f7-a2c3-48b3-88fd-108324327fe8',  -- POV removed nominee
  'f5a6eec8-938f-4e6d-bd76-7c60ae57ef1e',  -- POV replacement
  'Memory Challenge',
  '16809d92-927f-477f-adea-5ef447c8b893',  -- Blockbuster Winner
  'befc51b4-a636-48d6-ae18-d3e32ceeaad8',  -- Evicted nominee
  '7-2',
  NOW(),
  NOW()
),

-- Week 2
(
  2,
  'Endurance Challenge',
  'e81aacc1-a052-42c4-beca-2a1ad3ae632d',  -- HOH Winner
  ARRAY[
    'bdc4c8f7-a2c3-48b3-88fd-108324327fe8',
    'f882c3d7-feba-4719-8ecc-590aebf22734'
  ],
  'Strategy Challenge',
  '66f2f964-218f-45de-9b51-ec606e45633b',  -- POV Winner
  false,
  NULL,  -- POV not used
  NULL,  -- No replacement
  'Social Challenge',
  '2389caf3-98af-4cf6-b2a9-85698a09f32f',  -- Blockbuster Winner
  'bdc4c8f7-a2c3-48b3-88fd-108324327fe8',  -- Evicted nominee
  '8-1',
  NOW(),
  NOW()
),

-- Week 3
(
  3,
  'Mental Challenge',
  '94d9ce0f-4838-48fa-8a68-3243aafc49b2',  -- HOH Winner
  ARRAY[
    'a439bc47-0682-40b7-bf4c-a065f5f324c2',
    'f882c3d7-feba-4719-8ecc-590aebf22734'
  ],
  'Physical Challenge',
  '1153f4d4-a640-4ca3-9ae6-9af7a073d7f7',  -- POV Winner
  true,
  'a439bc47-0682-40b7-bf4c-a065f5f324c2',  -- POV removed nominee
  '92f573f4-68c2-4bb7-b9c8-b1c44de00c01',  -- POV replacement
  'Endurance Challenge',
  'f5a6eec8-938f-4e6d-bd76-7c60ae57ef1e',  -- Blockbuster Winner
  'f882c3d7-feba-4719-8ecc-590aebf22734',  -- Evicted nominee
  '6-3',
  NOW(),
  NOW()
),

-- Week 4
(
  4,
  'Strategy Challenge',
  '16809d92-927f-477f-adea-5ef447c8b893',  -- HOH Winner
  ARRAY[
    'a439bc47-0682-40b7-bf4c-a065f5f324c2',
    '1153f4d4-a640-4ca3-9ae6-9af7a073d7f7'
  ],
  'Memory Challenge',
  '66f2f964-218f-45de-9b51-ec606e45633b',  -- POV Winner
  true,
    'a439bc47-0682-40b7-bf4c-a065f5f324c2',  -- POV removed nominee
    '2389caf3-98af-4cf6-b2a9-85698a09f32f',  -- POV replacement
  'Physical Challenge',
  '94d9ce0f-4838-48fa-8a68-3243aafc49b2',  -- Blockbuster Winner
  '1153f4d4-a640-4ca3-9ae6-9af7a073d7f7',  -- Evicted nominee
  '5-4',
  NOW(),
  NOW()
),

-- Week 5
(
  5,
  'Endurance Challenge',
  'f5a6eec8-938f-4e6d-bd76-7c60ae57ef1e',  -- HOH Winner
  ARRAY[
    '16809d92-927f-477f-adea-5ef447c8b893',
    '66f2f964-218f-45de-9b51-ec606e45633b'
  ],
  'Mental Challenge',
  'a0a1bbcb-f9c5-4ff6-9db2-3d79effe220b',  -- POV Winner
  false,
  NULL,  -- POV not used
  NULL,  -- No replacement
  'Strategy Challenge',
  'e81aacc1-a052-42c4-beca-2a1ad3ae632d',  -- Blockbuster Winner
  '66f2f964-218f-45de-9b51-ec606e45633b',  -- Evicted nominee
  '7-2',
  NOW(),
  NOW()
),

-- Week 6
(
  6,
  'Physical Challenge',
  '2389caf3-98af-4cf6-b2a9-85698a09f32f',  -- HOH Winner
  ARRAY[
    'f5a6eec8-938f-4e6d-bd76-7c60ae57ef1e',
    '1153f4d4-a640-4ca3-9ae6-9af7a073d7f7'
  ],
  'Memory Challenge',
  '92f573f4-68c2-4bb7-b9c8-b1c44de00c01',  -- POV Winner
  true,
  'f5a6eec8-938f-4e6d-bd76-7c60ae57ef1e',  -- POV removed nominee
  '94d9ce0f-4838-48fa-8a68-3243aafc49b2',  -- POV replacement
  'Endurance Challenge',
  '16809d92-927f-477f-adea-5ef447c8b893',  -- Blockbuster Winner
  '1153f4d4-a640-4ca3-9ae6-9af7a073d7f7',  -- Evicted nominee
  '6-3',
  NOW(),
  NOW()
);
