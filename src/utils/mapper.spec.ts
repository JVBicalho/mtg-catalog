import { describe, it, expect } from 'vitest';
import { mapSetCode, sanitizeCardName } from './mapper';

describe('Set Code Mapper', () => {
  it('should convert standard codes to lowercase', () => {
    expect(mapSetCode('BNG')).toBe('bng');
    expect(mapSetCode('M10')).toBe('m10');
  });

  it('should map manual exceptions correctly', () => {
    // LigaMagic 'RNC' -> Scryfall 'ren' (Renaissance)
    expect(mapSetCode('RNC')).toBe('ren');
    
    // LigaMagic 'pr30' -> Scryfall 'p30a' (30th Anniversary)
    expect(mapSetCode('pr30')).toBe('p30a');
  });

  it('should return lowercase if no mapping exists', () => {
    expect(mapSetCode('ABC')).toBe('abc');
  });
});

describe('Card Name Sanitizer', () => {
  it('should remove special characters and normalize names for URLs', () => {
    expect(sanitizeCardName('Ojer Axonil, Deepest Might')).toBe('Ojer Axonil, Deepest Might');
    expect(sanitizeCardName('Unexpected Windfall (Sorte Inesperada)')).toBe('Unexpected Windfall');
    expect(sanitizeCardName('"Lightning Bolt"')).toBe('Lightning Bolt');
    expect(sanitizeCardName('Counterspell®')).toBe('Counterspell');
    expect(sanitizeCardName('Magic™ Card*')).toBe('Magic Card');
    expect(sanitizeCardName('Wear / Tear')).toBe('Wear // Tear');
  });
});
