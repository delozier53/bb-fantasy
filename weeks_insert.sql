-- Insert weeks data into Supabase
-- Generated for Big Brother Fantasy League

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
-- Week 1 Example
(
  1,
  'Physical Challenge',
  (SELECT id FROM houseguests WHERE slug = 'adrian-rocha' LIMIT 1),
  ARRAY[
    (SELECT id FROM houseguests WHERE slug = 'ashley-hollis' LIMIT 1),
    (SELECT id FROM houseguests WHERE slug = 'cameron-hardin' LIMIT 1)
  ],
  'Mental Challenge',
  (SELECT id FROM houseguests WHERE slug = 'leah-smith' LIMIT 1),
  true,
  (SELECT id FROM houseguests WHERE slug = 'ashley-hollis' LIMIT 1),
  (SELECT id FROM houseguests WHERE slug = 'kenzie-petty' LIMIT 1),
  'Memory Challenge',
  (SELECT id FROM houseguests WHERE slug = 'matt-klotz' LIMIT 1),
  (SELECT id FROM houseguests WHERE slug = 'cameron-hardin' LIMIT 1),
  '7-2',
  NOW(),
  NOW()
),

-- Week 2 Example
(
  2,
  'Endurance Challenge',
  (SELECT id FROM houseguests WHERE slug = 'rylie-jeffries' LIMIT 1),
  ARRAY[
    (SELECT id FROM houseguests WHERE slug = 'kenzie-petty' LIMIT 1),
    (SELECT id FROM houseguests WHERE slug = 'tucker-robertson' LIMIT 1)
  ],
  'Strategy Challenge',
  (SELECT id FROM houseguests WHERE slug = 'davis-malloy' LIMIT 1),
  false,
  NULL,
  NULL,
  'Social Challenge',
  (SELECT id FROM houseguests WHERE slug = 'victoria-rafaeli' LIMIT 1),
  (SELECT id FROM houseguests WHERE slug = 'kenzie-petty' LIMIT 1),
  '8-1',
  NOW(),
  NOW()
),

-- Week 3 Example
(
  3,
  'Mental Challenge',
  (SELECT id FROM houseguests WHERE slug = 'matt-klotz' LIMIT 1),
  ARRAY[
    (SELECT id FROM houseguests WHERE slug = 'tucker-robertson' LIMIT 1),
    (SELECT id FROM houseguests WHERE slug = 'mecole-hayes' LIMIT 1)
  ],
  'Physical Challenge',
  (SELECT id FROM houseguests WHERE slug = 'cooper-marody' LIMIT 1),
  true,
  (SELECT id FROM houseguests WHERE slug = 'tucker-robertson' LIMIT 1),
  (SELECT id FROM houseguests WHERE slug = 'jimmy-heagerty' LIMIT 1),
  'Endurance Challenge',
  (SELECT id FROM houseguests WHERE slug = 'lisa-negri' LIMIT 1),
  (SELECT id FROM houseguests WHERE slug = 'mecole-hayes' LIMIT 1),
  '6-3',
  NOW(),
  NOW()
);
