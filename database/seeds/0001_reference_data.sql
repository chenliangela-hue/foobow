insert into deed_types (slug, name, category, description, ritual_instructions, default_karma_points, status)
values
  ('release-fish', 'Virtual 放生', 'animals', 'Release a digital fish without ecological harm.', 'Choose a lake or river and release a symbolic fish.', 5, 'active'),
  ('elder-crosswalk', '扶老奶奶过马路', 'elders', 'Guide an elder through a safe crosswalk.', 'Move through the calm crossing scene and complete the care ritual.', 5, 'active'),
  ('anonymous-blessing', 'Anonymous blessing', 'support', 'Send support without pressure or identity exposure.', 'Write one short blessing for another user.', 2, 'active'),
  ('coastline-cleanup', 'Clean a coastline', 'environment', 'Restore a shared beach, park, or riverbank.', 'Clear virtual litter and add to a community goal.', 4, 'active');

insert into donation_campaigns (slug, name, partner_name, category, verification_status, description, target_amount, current_amount, status)
values
  ('operating-support', 'Foobow operating support', 'Foobow', 'platform', 'verified', 'Supports app hosting, moderation, and safety operations. It does not buy luck, virtue, or guaranteed karma.', 50000.00, 0.00, 'active');

insert into map_spots (slug, name, category, latitude, longitude, region, story, status)
values
  ('east-lake-wuhan', 'East Lake, Wuhan', 'animals', 30.5530, 114.4110, 'Wuhan, China', 'Release a digital fish into the lake and add one ripple to the shared kindness map.', 'active'),
  ('toronto-crosswalk', 'Toronto crosswalk', 'elders', 43.6532, -79.3832, 'Toronto, Canada', 'Guide an elder safely across a winter street and add care to the elder-support layer.', 'active'),
  ('amazon-restoration-grove', 'Amazon restoration grove', 'environment', -3.4653, -62.2159, 'Amazon Basin', 'Water a young tree in a shared digital forest connected to environmental campaigns.', 'active'),
  ('night-walk-corridor', 'Night walk corridor', 'support', 49.2827, -123.1207, 'Vancouver, Canada', 'Light a path for someone walking home with worry, grief, or loneliness.', 'active');

insert into badges (slug, name, category, description, criteria, status)
values
  ('seven-day-ritual', '7-day ritual', 'daily', 'Complete seven daily good-deed rituals.', '{"streak_days": 7}', 'active'),
  ('lake-guardian', 'Lake guardian', 'animals', 'Complete symbolic release rituals at water map spots.', '{"category": "animals", "count": 3}', 'active'),
  ('quiet-supporter', 'Quiet supporter', 'support', 'Send anonymous blessings without public ranking pressure.', '{"category": "support", "count": 5}', 'active');

