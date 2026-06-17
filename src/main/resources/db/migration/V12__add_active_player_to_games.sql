ALTER TABLE games
    ADD COLUMN IF NOT EXISTS active_player_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_games_active_player'
          AND table_name = 'games'
    ) THEN
        ALTER TABLE games
            ADD CONSTRAINT fk_games_active_player
                FOREIGN KEY (active_player_id) REFERENCES players(id);
    END IF;
END $$;
