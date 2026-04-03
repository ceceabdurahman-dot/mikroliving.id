import assert from "node:assert/strict";
import test from "node:test";
import { isValidHttpUrl, parseHeroStats } from "./siteSettingsUtils";

test("isValidHttpUrl accepts http and https URLs", () => {
  assert.equal(isValidHttpUrl("https://example.com/image.jpg"), true);
  assert.equal(isValidHttpUrl("http://example.com"), true);
});

test("isValidHttpUrl rejects invalid or unsupported URLs", () => {
  assert.equal(isValidHttpUrl("ftp://example.com/file"), false);
  assert.equal(isValidHttpUrl("not-a-url"), false);
});

test("parseHeroStats parses valid hero stats JSON", () => {
  const result = parseHeroStats('[{"label":"Projects","value":"150+"}]');

  assert.equal(result.error, null);
  assert.deepEqual(result.stats, [{ label: "Projects", value: "150+" }]);
});

test("parseHeroStats rejects non-array JSON", () => {
  const result = parseHeroStats('{"label":"Projects","value":"150+"}');

  assert.equal(result.error, "Hero stats harus berupa array JSON.");
  assert.deepEqual(result.stats, []);
});

test("parseHeroStats rejects malformed array entries", () => {
  const result = parseHeroStats('[{"label":"Projects"}]');

  assert.equal(result.error, 'Setiap item hero stats wajib punya "label" dan "value".');
  assert.deepEqual(result.stats, []);
});
