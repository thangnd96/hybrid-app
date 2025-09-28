import { cn, sleep, getRainbowColorNameById } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', { 'active': true, 'disabled': false })).toBe('base active');
    });

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('', null, undefined)).toBe('');
    });
  });

  describe('sleep', () => {
    it('should resolve after default delay', async () => {
      const start = Date.now();
      await sleep();
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(1000);
    });

    it('should resolve after custom delay', async () => {
      const start = Date.now();
      await sleep(500);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(500);
    });
  });

  describe('getRainbowColorNameById', () => {
    it('should return correct color for valid IDs', () => {
      expect(getRainbowColorNameById(0)).toBe('FF0000'); // Red
      expect(getRainbowColorNameById(1)).toBe('FF7F00'); // Orange
      expect(getRainbowColorNameById(6)).toBe('9400D3'); // Violet
    });

    it('should cycle through colors for IDs beyond array length', () => {
      expect(getRainbowColorNameById(7)).toBe('FF0000'); // Red (cycle back)
      expect(getRainbowColorNameById(14)).toBe('FF0000'); // Red (cycle back)
      expect(getRainbowColorNameById(8)).toBe('FF7F00'); // Orange
    });

    it('should handle negative IDs', () => {
      expect(getRainbowColorNameById(-1)).toBe('9400D3'); // Violet (last color)
      expect(getRainbowColorNameById(-8)).toBe('9400D3'); // -8 % 7 = -1, which becomes 6 (Violet)
    });

    it('should handle large numbers', () => {
      expect(getRainbowColorNameById(1000)).toBe('9400D3'); // 1000 % 7 = 6, which is Violet
      expect(getRainbowColorNameById(1001)).toBe('FF0000'); // 1001 % 7 = 0, which is Red
    });
  });
});
