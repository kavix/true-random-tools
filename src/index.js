/**
 * Default parameters matching:
 * https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new&cl=w
 */
const BASE_URL = 'https://www.random.org/integers/';

const DEFAULT_PARAMS = {
  num: 1,
  min: 1,
  max: 100,
  col: 1,
  base: 10,
  format: 'plain',
  rnd: 'new',
  cl: 'w'
};

/**
 * Builds the complete Random.org URL with specified query parameters.
 * Allows editing or overriding any parameter.
 *
 * @param {Record<string, any>} [params={}] - Parameters to customize
 * @returns {string} Fully constructed URL
 */
function buildRandomUrl(params = {}) {
  const merged = { ...DEFAULT_PARAMS, ...params };
  const url = new URL(BASE_URL);

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Parses numbers from Random.org response.
 * Handles both plain numeric text and HTML widget formats (e.g. when cl=w is passed).
 *
 * @param {string} text - Raw response text
 * @param {number} [base=10] - Number base (2, 8, 10, 16)
 * @returns {number[]} Array of parsed integers
 */
function parseIntegers(text, base = 10) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // If response contains HTML markup (e.g. from cl=w widget)
  let cleanText = text;
  if (/<[a-z][\s\S]*>/i.test(text)) {
    // First check if it is the widget format with <span style='font-size:100%;font-weight:bold;'>95\n</span>
    const boldMatch = text.match(/<span[^>]*font-weight:\s*bold[^>]*>([\s\S]*?)<\/span>/i);
    if (boldMatch) {
      cleanText = boldMatch[1];
    } else {
      // General HTML tag removal
      cleanText = text.replace(/<[^>]+>/g, ' ');
    }
  }

  // Extract tokens that look like numbers (supporting negative and positive)
  const tokens = cleanText.trim().split(/\s+/).filter(Boolean);
  const numbers = [];

  for (const token of tokens) {
    const parsed = parseInt(token, base);
    if (!isNaN(parsed)) {
      numbers.push(parsed);
    }
  }

  return numbers;
}

/**
 * Fetches the raw string response from Random.org.
 *
 * @param {Record<string, any>} [params={}] - Query parameters (editable)
 * @param {RequestInit} [fetchOptions={}] - Optional fetch options (e.g. signal, headers)
 * @returns {Promise<string>} Raw output text
 */
async function fetchRandomRaw(params = {}, fetchOptions = {}) {
  const url = buildRandomUrl(params);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'true-random-tools/1.0.1 (https://github.com/kavix/true-random-tools)'
    },
    ...fetchOptions
  });

  const body = await response.text();

  if (!response.ok) {
    const errorMsg = body.trim() || `HTTP error ${response.status} (${response.statusText})`;
    throw new Error(`Random.org API Error: ${errorMsg}`);
  }

  if (body.startsWith('Error:')) {
    throw new Error(`Random.org API Error: ${body.trim()}`);
  }

  return body;
}

/**
 * Fetches true random numbers and returns a structured result.
 *
 * @param {Record<string, any>} [params={}] - Customizable query parameters
 * @param {RequestInit} [fetchOptions={}] - Optional fetch options
 * @returns {Promise<{ raw: string, numbers: number[], url: string }>}
 */
async function fetchRandom(params = {}, fetchOptions = {}) {
  const url = buildRandomUrl(params);
  const raw = await fetchRandomRaw(params, fetchOptions);
  const base = params.base ? Number(params.base) : DEFAULT_PARAMS.base;
  const numbers = parseIntegers(raw, base);

  return {
    raw,
    numbers,
    url
  };
}

/**
 * Convenience helper to get a single true random integer.
 *
 * @param {number} [min=1] - Minimum value (inclusive)
 * @param {number} [max=100] - Maximum value (inclusive)
 * @param {Record<string, any>} [extraParams={}] - Additional parameters to override
 * @returns {Promise<number>}
 */
async function getRandomInt(min = 1, max = 100, extraParams = {}) {
  const params = {
    ...extraParams,
    num: 1,
    min,
    max,
    format: extraParams.format || 'plain',
    // remove cl=w by default for clean single integer extraction unless explicitly provided
    ...(extraParams.cl !== undefined ? { cl: extraParams.cl } : { cl: undefined })
  };

  const { numbers } = await fetchRandom(params);
  if (numbers.length === 0) {
    throw new Error('Failed to parse random integer from response');
  }
  return numbers[0];
}

/**
 * Convenience helper to get multiple true random integers.
 *
 * @param {number} [count=1] - Quantity of numbers
 * @param {number} [min=1] - Minimum value (inclusive)
 * @param {number} [max=100] - Maximum value (inclusive)
 * @param {Record<string, any>} [extraParams={}] - Additional parameters to override
 * @returns {Promise<number[]>}
 */
async function getRandomIntegers(count = 1, min = 1, max = 100, extraParams = {}) {
  const params = {
    ...extraParams,
    num: count,
    min,
    max,
    format: extraParams.format || 'plain',
    ...(extraParams.cl !== undefined ? { cl: extraParams.cl } : { cl: undefined })
  };

  const { numbers } = await fetchRandom(params);
  return numbers;
}

/**
 * Checks your remaining IP quota on Random.org.
 *
 * @param {RequestInit} [fetchOptions={}] - Optional fetch options
 * @returns {Promise<number>} Number of available quota bits
 */
async function checkQuota(fetchOptions = {}) {
  const response = await fetch('https://www.random.org/quota/?format=plain', fetchOptions);
  if (!response.ok) {
    throw new Error(`Random.org Quota Error: HTTP ${response.status}`);
  }
  const text = await response.text();
  return parseInt(text.trim(), 10);
}

module.exports = {
  BASE_URL,
  DEFAULT_PARAMS,
  buildRandomUrl,
  parseIntegers,
  fetchRandomRaw,
  fetchRandom,
  getRandomInt,
  getRandomIntegers,
  checkQuota
};
