import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/*
 * Guards the accessibility floors agreed in the design system document.
 *
 * These ratios were computed by hand during the P1.2 critique and several of
 * the first-draft values failed. This test recomputes them from the real
 * stylesheet so a future palette tweak cannot silently reintroduce a failure.
 */

const cssPath = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url));
const css = readFileSync(cssPath, 'utf8');

function block(pattern: RegExp): string {
  const match = css.match(pattern);
  if (!match) throw new Error(`Could not find token block: ${pattern}`);
  return match[1];
}

function tokens(source: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of source.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[name] = value;
  }
  return out;
}

/** WCAG 2.1 relative luminance. */
function luminance(hex: string): number {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const h = hex.replace('#', '');
  return (
    0.2126 * channel(parseInt(h.slice(0, 2), 16)) +
    0.7152 * channel(parseInt(h.slice(2, 4), 16)) +
    0.0722 * channel(parseInt(h.slice(4, 6), 16))
  );
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// The first :root block holds the dark theme; the light theme overrides it.
const dark = tokens(block(/:root\s*\{([\s\S]*?)\}/));
const light = { ...dark, ...tokens(block(/prefers-color-scheme:\s*light\)\s*\{\s*:root\s*\{([\s\S]*?)\}/)) };

const themes = [
  ['dark', dark],
  ['light', light],
] as const;

const AA_TEXT = 4.5;
const NON_TEXT = 3;

describe.each(themes)('%s theme', (_name, t) => {
  const surfaces = ['--surface-0', '--surface-1', '--surface-2'] as const;
  const texts = ['--text-0', '--text-1', '--text-2'] as const;

  it.each(texts)('%s clears AA on every surface', (text) => {
    for (const surface of surfaces) {
      expect(contrast(t[text], t[surface]), `${text} on ${surface}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  it('--line-strong clears the 3:1 non-text threshold', () => {
    expect(contrast(t['--line-strong'], t['--surface-1'])).toBeGreaterThanOrEqual(NON_TEXT);
  });

  it('--focus is visible against the page ground', () => {
    expect(contrast(t['--focus'], t['--surface-0'])).toBeGreaterThanOrEqual(NON_TEXT);
  });
});

describe('heatmap bins', () => {
  // Bins 1-2 take white ink, bins 3-6 take dark ink.
  const inks: Array<[string, '--bin-ink-light' | '--bin-ink-dark']> = [
    ['--bin-1', '--bin-ink-light'],
    ['--bin-2', '--bin-ink-light'],
    ['--bin-3', '--bin-ink-dark'],
    ['--bin-4', '--bin-ink-dark'],
    ['--bin-5', '--bin-ink-dark'],
    ['--bin-6', '--bin-ink-dark'],
  ];

  it.each(inks)('%s label ink clears AA', (bin, ink) => {
    expect(contrast(dark[bin], dark[ink])).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('bins rise monotonically in luminance', () => {
    const ls = inks.map(([bin]) => luminance(dark[bin]));
    for (let i = 1; i < ls.length; i++) {
      expect(ls[i], `bin ${i + 1} vs bin ${i}`).toBeGreaterThan(ls[i - 1]);
    }
  });
});
