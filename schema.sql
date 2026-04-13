CREATE DATABASE IF NOT EXISTS mikroliving
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mikroliving;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(120) DEFAULT NULL,
    role ENUM('superadmin', 'admin', 'editor') NOT NULL DEFAULT 'admin',
    avatar_url VARCHAR(500) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME DEFAULT NULL,
    token_version INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role_active (role, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_categories (
    id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(60) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_project_categories_name (name),
    UNIQUE KEY uq_project_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_category_id SMALLINT DEFAULT NULL,
    slug VARCHAR(180) DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    size_value DECIMAL(10,2) DEFAULT NULL,
    size_unit VARCHAR(20) NOT NULL DEFAULT 'm2',
    image_url VARCHAR(500) NOT NULL,
    image_public_id VARCHAR(255) DEFAULT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(255) DEFAULT NULL,
    style_label VARCHAR(100) DEFAULT NULL,
    client_name VARCHAR(120) DEFAULT NULL,
    completion_year YEAR DEFAULT NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    featured_order SMALLINT DEFAULT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    published_at DATETIME DEFAULT NULL,
    created_by INT DEFAULT NULL,
    updated_by INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_projects_slug (slug),
    KEY idx_projects_category (category),
    KEY idx_projects_public_listing (status, is_featured, sort_order, created_at),
    KEY idx_projects_category_fk (project_category_id),
    KEY idx_projects_created_by (created_by),
    KEY idx_projects_updated_by (updated_by),
    CONSTRAINT fk_projects_category
      FOREIGN KEY (project_category_id) REFERENCES project_categories(id)
      ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_projects_created_by
      FOREIGN KEY (created_by) REFERENCES users(id)
      ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_projects_updated_by
      FOREIGN KEY (updated_by) REFERENCES users(id)
      ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_public_id VARCHAR(255) DEFAULT NULL,
    alt_text VARCHAR(255) DEFAULT NULL,
    caption VARCHAR(255) DEFAULT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_project_images_project (project_id, sort_order),
    CONSTRAINT fk_project_images_project
      FOREIGN KEY (project_id) REFERENCES projects(id)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(255) NOT NULL,
    secure_url VARCHAR(500) NOT NULL,
    resource_type VARCHAR(30) NOT NULL DEFAULT 'image',
    format VARCHAR(20) DEFAULT NULL,
    bytes INT DEFAULT NULL,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    original_filename VARCHAR(255) DEFAULT NULL,
    uploaded_by INT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_media_assets_public_id (public_id),
    KEY idx_media_assets_uploaded_by (uploaded_by),
    CONSTRAINT fk_media_assets_uploaded_by
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
      ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
    id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    icon_key VARCHAR(50) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(255) NOT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_services_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(60) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    title VARCHAR(180) NOT NULL,
    excerpt VARCHAR(255) NOT NULL,
    content MEDIUMTEXT DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    image_public_id VARCHAR(255) DEFAULT NULL,
    author_name VARCHAR(120) DEFAULT NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    published_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_insights_slug (slug),
    KEY idx_insights_listing (is_published, sort_order, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(120) NOT NULL,
    client_label VARCHAR(180) DEFAULT NULL,
    quote TEXT NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    image_public_id VARCHAR(255) DEFAULT NULL,
    rating TINYINT UNSIGNED DEFAULT 5,
    is_featured TINYINT(1) NOT NULL DEFAULT 1,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_testimonials_client (client_name, client_label),
    KEY idx_testimonials_listing (is_active, is_featured, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS navigation_links (
    id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(80) NOT NULL,
    url VARCHAR(255) NOT NULL,
    location ENUM('header', 'footer', 'legal') NOT NULL DEFAULT 'header',
    sort_order SMALLINT NOT NULL DEFAULT 0,
    opens_new_tab TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_navigation_location_label_url (location, label, url),
    KEY idx_navigation_location (location, is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_channels (
    id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(80) NOT NULL,
    value_text VARCHAR(180) NOT NULL,
    href VARCHAR(255) DEFAULT NULL,
    icon_key VARCHAR(50) DEFAULT NULL,
    location_label VARCHAR(180) DEFAULT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_contact_channels_label (label),
    KEY idx_contact_channels_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
    source VARCHAR(50) NOT NULL DEFAULT 'website',
    admin_note TEXT DEFAULT NULL,
    replied_at DATETIME DEFAULT NULL,
    resolved_at DATETIME DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_inquiries_status_created_at (status, created_at),
    KEY idx_inquiries_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_group VARCHAR(80) NOT NULL,
    setting_key VARCHAR(120) NOT NULL,
    label VARCHAR(120) NOT NULL,
    value_type ENUM('text', 'textarea', 'url', 'json') NOT NULL DEFAULT 'text',
    setting_value LONGTEXT DEFAULT NULL,
    is_public TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_site_settings_key (setting_key),
    KEY idx_site_settings_group_public (setting_group, is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO project_categories (name, slug, description, sort_order, is_active)
VALUES
    ('Apartment', 'apartment', 'Compact urban apartment interiors.', 1, 1),
    ('Residential', 'residential', 'Residential and landed home interiors.', 2, 1),
    ('Kitchen', 'kitchen', 'Kitchen and pantry focused projects.', 3, 1),
    ('Bedroom', 'bedroom', 'Bedroom and private retreat projects.', 4, 1)
ON DUPLICATE KEY UPDATE
    description = VALUES(description),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO services (icon_key, title, description, sort_order, is_active)
VALUES
    ('Layout', 'Interior Design', 'Comprehensive conceptual and technical planning for any space.', 1, 1),
    ('Building2', 'Apartment Design', 'Specialized solutions for compact living and high-rise dwellings.', 2, 1),
    ('Sofa', 'Custom Furniture', 'Bespoke pieces crafted specifically for your home''s dimensions.', 3, 1),
    ('Hammer', 'Design & Build', 'Integrated project management from concept to completion.', 4, 1)
ON DUPLICATE KEY UPDATE
    icon_key = VALUES(icon_key),
    description = VALUES(description),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO insights (tag, slug, title, excerpt, image_url, author_name, is_published, sort_order, published_at)
VALUES
    ('Trends', 'maximizing-space-in-compact-apartments', 'Maximizing Space in Compact Apartments', 'Discover clever furniture hacks and architectural tricks to make small spaces feel twice their size.', 'https://picsum.photos/seed/blog1/600/400', 'MikroLiving Studio', 1, 1, NOW()),
    ('Aesthetics', 'choosing-the-perfect-earth-tone-palette', 'Choosing the Perfect Earth-Tone Palette', 'Why organic colors are dominating modern interiors and how to pair them with raw materials.', 'https://picsum.photos/seed/blog2/600/400', 'MikroLiving Studio', 1, 2, NOW()),
    ('Material', 'the-rise-of-sustainable-wood-in-decor', 'The Rise of Sustainable Wood in Decor', 'Exploring ethically sourced timber options that add warmth without harming the planet.', 'https://picsum.photos/seed/blog3/600/400', 'MikroLiving Studio', 1, 3, NOW())
ON DUPLICATE KEY UPDATE
    tag = VALUES(tag),
    title = VALUES(title),
    excerpt = VALUES(excerpt),
    image_url = VALUES(image_url),
    author_name = VALUES(author_name),
    is_published = VALUES(is_published),
    sort_order = VALUES(sort_order),
    published_at = VALUES(published_at);

INSERT INTO testimonials (client_name, client_label, quote, image_url, rating, is_featured, sort_order, is_active)
VALUES
    ('Sarah & Dimas', 'The Botanica Apartments', 'MikroLiving transformed our 45sqm apartment into a sanctuary. Their attention to storage solutions and aesthetic flow is truly unmatched in the industry.', 'https://picsum.photos/seed/client/200/200', 5, 1, 1, 1)
ON DUPLICATE KEY UPDATE
    client_label = VALUES(client_label),
    quote = VALUES(quote),
    image_url = VALUES(image_url),
    rating = VALUES(rating),
    is_featured = VALUES(is_featured),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO navigation_links (label, url, location, sort_order, opens_new_tab, is_active)
VALUES
    ('Home', '#home', 'header', 1, 0, 1),
    ('Studio', '#studio', 'header', 2, 0, 1),
    ('Services', '#services', 'header', 3, 0, 1),
    ('Portfolio', '#portfolio', 'header', 4, 0, 1),
    ('Insights', '#insights', 'header', 5, 0, 1),
    ('Contact', '#contact', 'header', 6, 0, 1),
    ('Studio', '#studio', 'footer', 1, 0, 1),
    ('Portfolio', '#portfolio', 'footer', 2, 0, 1),
    ('Services', '#services', 'footer', 3, 0, 1),
    ('Privacy Policy', '#', 'legal', 1, 0, 1),
    ('Terms of Service', '#', 'legal', 2, 0, 1)
ON DUPLICATE KEY UPDATE
    sort_order = VALUES(sort_order),
    opens_new_tab = VALUES(opens_new_tab),
    is_active = VALUES(is_active);

INSERT INTO contact_channels (label, value_text, href, icon_key, location_label, sort_order, is_active)
VALUES
    ('WhatsApp', '+62 812 3456 7890', 'https://wa.me/6281234567890', 'MessageCircle', NULL, 1, 1),
    ('Email Us', 'hello@mikroliving.local', 'mailto:hello@mikroliving.local', 'AtSign', NULL, 2, 1),
    ('Location', 'Jakarta, Indonesia', 'https://mikroliving.id', 'Globe', 'Jakarta, Indonesia', 3, 1)
ON DUPLICATE KEY UPDATE
    value_text = VALUES(value_text),
    href = VALUES(href),
    icon_key = VALUES(icon_key),
    location_label = VALUES(location_label),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO site_settings (setting_group, setting_key, label, value_type, setting_value, is_public)
VALUES
    ('branding', 'brand_name', 'Brand Name', 'text', 'MikroLiving', 1),
    ('hero', 'hero_headline', 'Hero Headline', 'text', 'Designing Smart Living Spaces', 1),
    ('hero', 'hero_subheadline', 'Hero Subheadline', 'textarea', 'Creating Elegant & Functional Interiors that resonate with your lifestyle and personality.', 1),
    ('hero', 'hero_primary_cta_label', 'Hero Primary CTA Label', 'text', 'View Portfolio', 1),
    ('hero', 'hero_secondary_cta_label', 'Hero Secondary CTA Label', 'text', 'Book Consultation', 1),
    ('hero', 'hero_image_url', 'Hero Image URL', 'url', 'https://picsum.photos/seed/interior1/1200/1200', 1),
    ('hero', 'hero_stats', 'Hero Stats', 'json', '[{\"label\":\"Projects\",\"value\":\"150+\"},{\"label\":\"Satisfaction\",\"value\":\"98%\"},{\"label\":\"Years Exp.\",\"value\":\"10+\"}]', 1),
    ('footer', 'footer_tagline', 'Footer Tagline', 'textarea', 'Crafting intelligent, elegant spaces that elevate the standard of compact and residential living.', 1),
    ('footer', 'footer_copyright', 'Footer Copyright', 'text', '(C) 2024 MikroLiving Interior Studio. All rights reserved.', 1),
    ('contact', 'contact_intro', 'Contact Intro', 'textarea', 'Whether you''re starting from scratch or renovating a room, our team is ready to bring your vision to life.', 1)
ON DUPLICATE KEY UPDATE
    setting_group = VALUES(setting_group),
    label = VALUES(label),
    value_type = VALUES(value_type),
    setting_value = VALUES(setting_value),
    is_public = VALUES(is_public);
