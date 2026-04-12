USE mikroliving;

ALTER TABLE users
    MODIFY role ENUM('superadmin', 'admin', 'editor') NOT NULL DEFAULT 'admin';
