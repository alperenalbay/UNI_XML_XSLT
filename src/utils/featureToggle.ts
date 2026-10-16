export type FeatureState = 'on' | 'off';

export interface FeatureRegion {
  name: string;
  state: FeatureState;
  /** start offset of the region (including markers) in the source text */
  start: number;
  /** end offset of the region (including markers) in the source text */
  end: number;
  /** inner content between the markers */
  content: string;
}

export interface ToggleResult {
  content: string;
  state: FeatureState;
  /** number of regions actually flipped */
  changed: number;
}

export interface SetResult {
  content: string;
  /** number of regions actually changed */
  changed: number;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ON_START = (name: string) => `<!--FEATURE ${name} ON-->`;
const OFF_START = (name: string) => `<!--FEATURE ${name} OFF`;
const ON_END = (name: string) => `<!--FEATURE ${name} END-->`;
const OFF_END = (name: string) => `FEATURE ${name} END-->`;

const onRegex = (name: string) =>
  new RegExp(`${escapeRegExp(ON_START(name))}([\\s\\S]*?)${escapeRegExp(ON_END(name))}`, 'g');

const offRegex = (name: string) =>
  new RegExp(`${escapeRegExp(OFF_START(name))}([\\s\\S]*?)${escapeRegExp(OFF_END(name))}`, 'g');

/**
 * Find all regions of a feature (both 'on' and 'off'), in document order.
 */
export function findFeatureRegions(content: string, name: string): FeatureRegion[] {
  const regions: FeatureRegion[] = [];
  for (const m of content.matchAll(onRegex(name))) {
    regions.push({ name, state: 'on', start: m.index ?? 0, end: (m.index ?? 0) + m[0].length, content: m[1] });
  }
  for (const m of content.matchAll(offRegex(name))) {
    regions.push({ name, state: 'off', start: m.index ?? 0, end: (m.index ?? 0) + m[0].length, content: m[1] });
  }
  return regions.sort((a, b) => a.start - b.start);
}

/**
 * List every feature found in the content with its current state.
 */
export function listFeatures(content: string): Record<string, FeatureState> {
  const re = /<!--FEATURE ([A-Za-z0-9_]+) (?:ON-->|OFF)/g;
  const out: Record<string, FeatureState> = {};
  for (const m of content.matchAll(re)) {
    out[m[1]] = m[0].includes(' ON-->') ? 'on' : 'off';
  }
  return out;
}

/**
 * Force every region of a feature to the given state.
 */
export function setFeatureState(content: string, name: string, state: FeatureState): SetResult {
  const regions = findFeatureRegions(content, name);
  if (regions.length === 0) {
    throw new Error(`Feature '${name}' bulunamadı`);
  }
  // Replace from the end backwards so earlier offsets stay valid
  let result = content;
  let changed = 0;
  for (const r of [...regions].reverse()) {
    if (r.state === state) continue;
    const replacement =
      state === 'on'
        ? `${ON_START(name)}${r.content}${ON_END(name)}`
        : `${OFF_START(name)}${r.content}${OFF_END(name)}`;
    result = result.slice(0, r.start) + replacement + result.slice(r.end);
    changed++;
  }
  return { content: result, changed };
}

/**
 * Toggle a feature: if any region is 'on', all go 'off'; otherwise all go 'on'.
 * Regions of the same name (header + data row) always stay in sync.
 */
export function toggleFeature(content: string, name: string): ToggleResult {
  const regions = findFeatureRegions(content, name);
  if (regions.length === 0) {
    throw new Error(`Feature '${name}' bulunamadı`);
  }
  const target: FeatureState = regions.some((r) => r.state === 'on') ? 'off' : 'on';
  const { content: next, changed } = setFeatureState(content, name, target);
  return { content: next, state: target, changed };
}
