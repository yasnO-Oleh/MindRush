ALTER TABLE games
    ADD COLUMN IF NOT EXISTS host_name VARCHAR(255);

UPDATE games
SET host_name = 'Host'
WHERE host_name IS NULL;

ALTER TABLE games
    ALTER COLUMN host_name SET NOT NULL;
