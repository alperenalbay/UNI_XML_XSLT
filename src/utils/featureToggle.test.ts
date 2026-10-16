import { describe, it, expect } from 'vitest';
import {
  findFeatureRegions,
  listFeatures,
  setFeatureState,
  toggleFeature,
} from './featureToggle';

const HEADER_OFF = `<!--FEATURE uyKodu OFF
<td id="lineTableHead" style="width:8%" align="center">
  <span>Ürün/Hizmet Kodu</span>
</td>
FEATURE uyKodu END-->`;

const HEADER_ON = `<!--FEATURE iskYuzde ON-->
<td id="lineTableHead" style="width:5%" align="center">
  <span>İsk.%</span>
</td>
<!--FEATURE iskYuzde END-->`;

describe('featureToggle', () => {
  it('lists features with their states', () => {
    const content = `${HEADER_OFF}\n${HEADER_ON}`;
    expect(listFeatures(content)).toEqual({ uyKodu: 'off', iskYuzde: 'on' });
  });

  it('finds both regions of a feature name', () => {
    const rowOff = HEADER_OFF.replace('lineTableHead', 'lineTableTd');
    const content = `${HEADER_OFF}\n${rowOff}`;
    const regions = findFeatureRegions(content, 'uyKodu');
    expect(regions).toHaveLength(2);
    expect(regions.every((r) => r.state === 'off')).toBe(true);
  });

  it('turns an off feature on, keeping content intact', () => {
    const { content, state, changed } = toggleFeature(HEADER_OFF, 'uyKodu');
    expect(state).toBe('on');
    expect(changed).toBe(1);
    expect(content).toContain('<!--FEATURE uyKodu ON-->');
    expect(content).toContain('<span>Ürün/Hizmet Kodu</span>');
    expect(content).toContain('<!--FEATURE uyKodu END-->');
    // roundtrip back to off
    const back = toggleFeature(content, 'uyKodu');
    expect(back.state).toBe('off');
    expect(back.content).toBe(HEADER_OFF);
  });

  it('turns an on feature off', () => {
    const { content, state } = toggleFeature(HEADER_ON, 'iskYuzde');
    expect(state).toBe('off');
    expect(content).toContain('<!--FEATURE iskYuzde OFF');
    expect(content).toContain('<span>İsk.%</span>');
    expect(content).toContain('FEATURE iskYuzde END-->');
  });

  it('keeps all regions of a feature in sync when toggling', () => {
    const rowOff = HEADER_OFF.replace('lineTableHead', 'lineTableTd');
    const content = `${HEADER_OFF}\n${rowOff}`;
    const { content: next, changed } = toggleFeature(content, 'uyKodu');
    expect(changed).toBe(2);
    expect(findFeatureRegions(next, 'uyKodu').every((r) => r.state === 'on')).toBe(true);
  });

  it('forces a state with setFeatureState', () => {
    const { content, changed } = setFeatureState(HEADER_OFF, 'uyKodu', 'on');
    expect(changed).toBe(1);
    expect(listFeatures(content)).toEqual({ uyKodu: 'on' });
    // forcing the same state again changes nothing
    const again = setFeatureState(content, 'uyKodu', 'on');
    expect(again.changed).toBe(0);
    expect(again.content).toBe(content);
  });

  it('throws for an unknown feature', () => {
    expect(() => toggleFeature(HEADER_OFF, 'olmayan')).toThrow('bulunamadı');
    expect(() => setFeatureState(HEADER_OFF, 'olmayan', 'on')).toThrow('bulunamadı');
  });

  it('does not confuse similarly named features', () => {
    const content = `<!--FEATURE uyKodu OFF
<td/>
FEATURE uyKodu END-->`;
    // 'uyKoduOFF' is a different name and must not match 'uyKodu'
    expect(findFeatureRegions(content, 'uyKoduOFF')).toHaveLength(0);
    expect(listFeatures(content)).toEqual({ uyKodu: 'off' });
  });
});
