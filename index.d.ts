export interface RandomOrgParams {
  /**
   * Number of integers requested (1 - 10,000). Default: 1
   */
  num?: number;
  /**
   * Smallest value allowed (-1,000,000,000 to 1,000,000,000). Default: 1
   */
  min?: number;
  /**
   * Largest value allowed (-1,000,000,000 to 1,000,000,000). Default: 100
   */
  max?: number;
  /**
   * Number of columns. Default: 1
   */
  col?: number;
  /**
   * Base used to print the numbers (2, 8, 10, or 16). Default: 10
   */
  base?: 2 | 8 | 10 | 16 | number;
  /**
   * Format of output ('plain' or 'html'). Default: 'plain'
   */
  format?: 'plain' | 'html';
  /**
   * Randomization type ('new', 'id.<id>', 'date.<iso-date>'). Default: 'new'
   */
  rnd?: 'new' | string;
  /**
   * Custom layout or widget parameter (e.g. 'w' for widget). Default: 'w'
   */
  cl?: string;
  /**
   * Any additional custom query parameter
   */
  [key: string]: any;
}

export interface RandomFetchResult {
  /**
   * The raw response text returned from Random.org
   */
  raw: string;
  /**
   * Array of parsed numbers
   */
  numbers: number[];
  /**
   * The exact URL invoked
   */
  url: string;
}

export declare const BASE_URL: string;
export declare const DEFAULT_PARAMS: Readonly<RandomOrgParams>;

/**
 * Builds the complete Random.org URL with customizable query parameters.
 */
export declare function buildRandomUrl(params?: Partial<RandomOrgParams>): string;

/**
 * Parses numbers from raw response string (supports plain numbers and widget HTML).
 */
export declare function parseIntegers(text: string, base?: number): number[];

/**
 * Fetches the raw string output directly from Random.org.
 */
export declare function fetchRandomRaw(
  params?: Partial<RandomOrgParams>,
  fetchOptions?: RequestInit
): Promise<string>;

/**
 * Fetches true random numbers and returns a structured object containing raw text, parsed numbers, and URL.
 */
export declare function fetchRandom(
  params?: Partial<RandomOrgParams>,
  fetchOptions?: RequestInit
): Promise<RandomFetchResult>;

/**
 * Helper to fetch a single true random integer within the given range.
 */
export declare function getRandomInt(
  min?: number,
  max?: number,
  extraParams?: Partial<RandomOrgParams>
): Promise<number>;

/**
 * Helper to fetch multiple true random integers within the given range.
 */
export declare function getRandomIntegers(
  count?: number,
  min?: number,
  max?: number,
  extraParams?: Partial<RandomOrgParams>
): Promise<number[]>;

/**
 * Checks your remaining IP quota (in bits) on Random.org.
 */
export declare function checkQuota(fetchOptions?: RequestInit): Promise<number>;

declare const defaultExport: {
  BASE_URL: string;
  DEFAULT_PARAMS: Readonly<RandomOrgParams>;
  buildRandomUrl: typeof buildRandomUrl;
  parseIntegers: typeof parseIntegers;
  fetchRandomRaw: typeof fetchRandomRaw;
  fetchRandom: typeof fetchRandom;
  getRandomInt: typeof getRandomInt;
  getRandomIntegers: typeof getRandomIntegers;
  checkQuota: typeof checkQuota;
};

export default defaultExport;
