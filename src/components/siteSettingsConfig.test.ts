import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultEditableSiteSettings,
  siteSettingsFields,
} from "./siteSettingsConfig";

test("site settings field config includes expected editable keys", () => {
  assert.equal(siteSettingsFields.length, 10);
  assert.deepEqual(
    siteSettingsFields.map((field) => field.key),
    [
      "brand_name",
      "hero_headline",
      "hero_subheadline",
      "hero_primary_cta_label",
      "hero_secondary_cta_label",
      "hero_image_url",
      "hero_stats",
      "footer_tagline",
      "footer_copyright",
      "contact_intro",
    ]
  );
});

test("site settings config keeps hero stats field marked as json", () => {
  const heroStatsField = siteSettingsFields.find((field) => field.key === "hero_stats");

  assert.ok(heroStatsField);
  assert.equal(heroStatsField?.type, "json");
  assert.match(heroStatsField?.description ?? "", /Format:/);
});

test("default editable site settings provide all configured keys", () => {
  assert.deepEqual(
    Object.keys(defaultEditableSiteSettings).sort(),
    siteSettingsFields.map((field) => field.key).sort()
  );
  assert.match(defaultEditableSiteSettings.hero_stats, /^\[/);
  assert.match(defaultEditableSiteSettings.hero_image_url, /^https:\/\//);
});
