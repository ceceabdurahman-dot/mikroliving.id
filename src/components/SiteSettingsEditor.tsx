import { FormEvent, useMemo } from "react";
import {
  defaultEditableSiteSettings,
  siteSettingsFields,
} from "./siteSettingsConfig";
import { isValidHttpUrl, parseHeroStats } from "./siteSettingsUtils";

type Props = {
  settings: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onFormatHeroStats: () => void;
  onResetDefaults: () => void;
  disabled: boolean;
};

export default function SiteSettingsEditor({
  settings,
  onChange,
  onSubmit,
  onFormatHeroStats,
  onResetDefaults,
  disabled,
}: Props) {
  const heroImageUrl = settings.hero_image_url ?? "";
  const heroStats = useMemo(() => parseHeroStats(settings.hero_stats ?? ""), [settings.hero_stats]);
  const heroImageValid = !heroImageUrl.trim() || isValidHttpUrl(heroImageUrl);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-headline">Hero, Footer, and Contact Settings</h2>
      <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        {siteSettingsFields.map((field) => {
          const value = settings[field.key] ?? "";
          const isLong = field.type === "textarea" || field.type === "json";
          const hasUrlError = field.type === "url" && value.trim().length > 0 && !isValidHttpUrl(value);
          const fieldClassName = `rounded-xl border px-4 py-3 ${
            hasUrlError ? "border-red-300 bg-red-50" : "border-stone-200"
          }`;

          return (
            <div key={field.key} className={isLong ? "md:col-span-2 space-y-2" : "space-y-2"}>
              <label className="text-sm font-semibold text-stone-800">{field.label}</label>
              <p className="text-xs text-stone-500">{field.description}</p>
              {field.key === "hero_stats" ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onFormatHeroStats}
                    className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Format JSON
                  </button>
                  <button
                    type="button"
                    onClick={onResetDefaults}
                    className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Reset to Defaults
                  </button>
                </div>
              ) : null}
              {isLong ? (
                <textarea
                  value={value}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  rows={field.type === "json" ? 5 : 4}
                  className={fieldClassName}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type === "url" ? "url" : "text"}
                  value={value}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  className={fieldClassName}
                  placeholder={field.placeholder}
                />
              )}
              {hasUrlError ? <p className="text-sm text-red-600">URL harus diawali `http://` atau `https://`.</p> : null}
            </div>
          );
        })}

        <div className="md:col-span-2 rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h3 className="text-lg font-headline">Hero Preview</h3>
          <p className="mt-2 text-sm text-stone-700">{settings.hero_headline || "Hero headline"}</p>
          <p className="mt-2 text-sm text-stone-500">{settings.hero_subheadline || "Hero subheadline"}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">
              {settings.hero_primary_cta_label || "Primary CTA"}
            </span>
            <span className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-700">
              {settings.hero_secondary_cta_label || "Secondary CTA"}
            </span>
          </div>
          {heroImageUrl ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {heroImageValid ? (
                <img src={heroImageUrl} alt="Hero preview" className="h-48 w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="p-4 text-sm text-red-600">Hero image URL belum valid.</div>
              )}
            </div>
          ) : null}
        </div>

        <div className="md:col-span-2 rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h3 className="text-lg font-headline">Hero Stats Preview</h3>
          {heroStats.error ? (
            <p className="mt-3 text-sm text-red-600">{heroStats.error}</p>
          ) : heroStats.stats.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">Belum ada stats. Tambahkan JSON array untuk melihat preview.</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {heroStats.stats.map((stat) => (
                <div key={`${stat.label}-${stat.value}`} className="rounded-xl border border-stone-200 bg-white px-4 py-3">
                  <p className="text-lg font-headline text-stone-900">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onResetDefaults}
            className="rounded-xl border border-stone-200 px-5 py-3 font-semibold text-stone-700 hover:bg-stone-50"
          >
            Reset to Defaults
          </button>
          <button type="submit" disabled={disabled || Boolean(heroStats.error) || !heroImageValid} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
}
