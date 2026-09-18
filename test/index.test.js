const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  BASE_URL,
  DEFAULT_PARAMS,
  buildRandomUrl,
  parseIntegers,
  fetchRandomRaw,
  fetchRandom,
  getRandomInt,
  getRandomIntegers,
  checkQuota
} = require('../src/index.js');

describe('true-random-tools', () => {

  describe('buildRandomUrl()', () => {
    test('builds default URL matching exact specification', () => {
      const url = buildRandomUrl();
      assert.strictEqual(
        url,
        'https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new&cl=w'
      );
    });

    test('allows editing any parameter', () => {
      const url = buildRandomUrl({
        min: 10,
        max: 50,
        num: 5,
        base: 16,
        rnd: 'id.test',
        cl: 'none'
      });

      assert.ok(url.includes('num=5'));
      assert.ok(url.includes('min=10'));
      assert.ok(url.includes('max=50'));
      assert.ok(url.includes('base=16'));
      assert.ok(url.includes('rnd=id.test'));
      assert.ok(url.includes('cl=none'));
    });

    test('supports adding arbitrary custom parameters', () => {
      const url = buildRandomUrl({ customParam: 'xyz' });
      assert.ok(url.includes('customParam=xyz'));
    });
  });

  describe('parseIntegers()', () => {
    test('parses plain whitespace-separated numbers', () => {
      const raw = '12\n45\n99';
      const result = parseIntegers(raw);
      assert.deepStrictEqual(result, [12, 45, 99]);
    });

    test('parses HTML widget response (from cl=w parameter)', () => {
      const htmlWidget = "<center><span style='font-size:100%;font-weight:bold;'>87\n</span><span style='font-size:70%;'>Min:&nbsp;1, Max:&nbsp;100\n2026-09-18 04:31:07 UTC</span></center>";
      const result = parseIntegers(htmlWidget);
      assert.deepStrictEqual(result, [87]);
    });

    test('handles negative integers', () => {
      const raw = '-5\n10\n-25';
      const result = parseIntegers(raw);
      assert.deepStrictEqual(result, [-5, 10, -25]);
    });

    test('handles hexadecimal base', () => {
      const raw = '1a\n2f\nff';
      const result = parseIntegers(raw, 16);
      assert.deepStrictEqual(result, [26, 47, 255]);
    });

    test('returns empty array on invalid input', () => {
      assert.deepStrictEqual(parseIntegers(''), []);
      assert.deepStrictEqual(parseIntegers(null), []);
    });
  });

  describe('Live Random.org API Integration', () => {
    test('fetchRandom() with default settings calls target URL and returns result', async () => {
      const result = await fetchRandom();
      assert.ok(typeof result.raw === 'string');
      assert.ok(result.raw.length > 0);
      assert.strictEqual(
        result.url,
        'https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new&cl=w'
      );
      assert.strictEqual(result.numbers.length, 1);
      assert.ok(result.numbers[0] >= 1 && result.numbers[0] <= 100);
    });

    test('fetchRandom() with custom parameters', async () => {
      const result = await fetchRandom({ min: 50, max: 60, num: 2, cl: undefined });
      assert.strictEqual(result.numbers.length, 2);
      for (const num of result.numbers) {
        assert.ok(num >= 50 && num <= 60);
      }
    });

    test('getRandomInt() returns a number in range', async () => {
      const val = await getRandomInt(10, 20);
      assert.strictEqual(typeof val, 'number');
      assert.ok(val >= 10 && val <= 20);
    });

    test('getRandomIntegers() returns expected count', async () => {
      const nums = await getRandomIntegers(3, 1, 10);
      assert.strictEqual(nums.length, 3);
      for (const n of nums) {
        assert.ok(n >= 1 && n <= 10);
      }
    });

    test('checkQuota() returns integer quota', async () => {
      const quota = await checkQuota();
      assert.strictEqual(typeof quota, 'number');
      assert.ok(!isNaN(quota));
    });

    test('handles API errors gracefully', async () => {
      await assert.rejects(
        async () => {
          // Invalid range where min > max
          await fetchRandom({ min: 100, max: 1 });
        },
        /Random\.org API Error/
      );
    });
  });
});
