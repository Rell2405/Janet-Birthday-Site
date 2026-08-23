CREATE TABLE rsvps (
  id TEXT PRIMARY KEY NOT NULL,
  update_token_hash TEXT NOT NULL UNIQUE,
  household_name TEXT NOT NULL
    CHECK (length(household_name) BETWEEN 1 AND 100),
  attendance TEXT NOT NULL
    CHECK (attendance IN ('attending', 'not-attending', 'undecided')),
  party_size INTEGER NOT NULL
    CHECK (party_size BETWEEN 0 AND 20),
  dietary_restrictions TEXT
    CHECK (dietary_restrictions IS NULL OR length(dietary_restrictions) <= 500),
  guest_message TEXT
    CHECK (guest_message IS NULL OR length(guest_message) <= 1000),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
) STRICT;

CREATE INDEX idx_rsvps_updated_at ON rsvps(updated_at);

