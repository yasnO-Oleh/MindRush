ALTER TABLE games
    ADD COLUMN IF NOT EXISTS join_code VARCHAR(6);

UPDATE games
SET join_code = LPAD(id::text, 6, '0')
WHERE join_code IS NULL;

ALTER TABLE games
    ALTER COLUMN join_code SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uk_games_join_code'
    ) THEN
        ALTER TABLE games
            ADD CONSTRAINT uk_games_join_code UNIQUE (join_code);
    END IF;
END$$;
