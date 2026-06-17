DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'games' AND column_name = 'current_question_id'
    ) THEN
        ALTER TABLE games ADD COLUMN current_question_id BIGINT;
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'games' AND constraint_name = 'fk_games_current_question'
    ) THEN
        ALTER TABLE games
            ADD CONSTRAINT fk_games_current_question
            FOREIGN KEY (current_question_id) REFERENCES questions(id);
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS game_used_questions (
    game_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    PRIMARY KEY (game_id, question_id)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'game_used_questions' AND constraint_name = 'fk_game_used_questions_game'
    ) THEN
        ALTER TABLE game_used_questions
            ADD CONSTRAINT fk_game_used_questions_game
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE;
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'game_used_questions' AND constraint_name = 'fk_game_used_questions_question'
    ) THEN
        ALTER TABLE game_used_questions
            ADD CONSTRAINT fk_game_used_questions_question
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
    END IF;
END$$;
