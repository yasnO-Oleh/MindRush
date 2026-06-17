DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'media_url'
    ) THEN
        ALTER TABLE questions ADD COLUMN media_url VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'questions' AND column_name = 'media_type'
    ) THEN
        ALTER TABLE questions ADD COLUMN media_type VARCHAR(50);
    END IF;
END$$;
