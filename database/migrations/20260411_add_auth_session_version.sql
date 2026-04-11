USE mikroliving;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS token_version INT UNSIGNED NOT NULL DEFAULT 0 AFTER last_login_at;
