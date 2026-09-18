# true-random-tools

> **"There is no really random value in pure computation—all standard PRNGs are pre-calculated deterministic sequences. Real randomness comes from physical entropy like atmospheric noise."**

`true-random-tools` is a lightweight, zero-dependency Node.js and browser-compatible package to fetch true physical entropy random integers from the [Random.org](https://www.random.org/) atmospheric noise API.

By default, calls the exact endpoint:
```text
https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new&cl=w
```
All parameters are completely customizable and editable.

---

## Features

- 🎲 **True Randomness**: Driven by atmospheric noise via Random.org.
- ⚙️ **Fully Customizable Parameters**: Edit `num`, `min`, `max`, `col`, `base`, `format`, `rnd`, `cl`, or pass custom query parameters.
- 📦 **Dual Module Support**: Seamlessly works with ES Modules (`import`) and CommonJS (`require`).
- 🔷 **Full TypeScript Types**: Included out of the box (`index.d.ts`).
- ⚡ **Zero Runtime Dependencies**: Uses standard native `fetch`.
- 💻 **CLI Included**: Run directly from your terminal using `npx true-random-tools`.

---

## Installation

```bash
npm install true-random-tools
```

---

## Quick Start

### ES Module (import)

```javascript
import { fetchRandom, getRandomInt, getRandomIntegers } from 'true-random-tools';

// 1. Default request (calls default target URL with cl=w)
const result = await fetchRandom();
console.log(result.numbers); // [ 42 ]
console.log(result.url);     // https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new&cl=w
console.log(result.raw);     // Raw string response

// 2. Custom parameters
const custom = await fetchRandom({
  min: 10,
  max: 500,
  num: 5,
  col: 1,
  base: 10,
  format: 'plain',
  rnd: 'new',
  cl: undefined // omit cl to get plain list format
});
console.log(custom.numbers); // [ 14, 289, 73, 412, 95 ]

// 3. Convenience helpers
const singleNumber = await getRandomInt(1, 10);
console.log('Single Int:', singleNumber);

const multipleNumbers = await getRandomIntegers(3, 100, 200);
console.log('Multiple Ints:', multipleNumbers);
```

### CommonJS (require)

```javascript
const { fetchRandom, getRandomInt } = require('true-random-tools');

async function run() {
  const number = await getRandomInt(1, 100);
  console.log('Random number:', number);
}

run();
```

---

## API Reference

### `fetchRandom(params?, fetchOptions?)`
Executes an HTTP GET request to Random.org and returns:
- `numbers: number[]` - Array of parsed integers.
- `raw: string` - The unmodified response body from Random.org.
- `url: string` - The complete query URL executed.

### `fetchRandomRaw(params?, fetchOptions?)`
Returns the raw response text from Random.org.

### `getRandomInt(min?, max?, extraParams?)`
Fetches a single random integer between `min` and `max` (defaults: `min=1`, `max=100`).

### `getRandomIntegers(count?, min?, max?, extraParams?)`
Fetches an array of `count` random integers between `min` and `max`.

### `buildRandomUrl(params?)`
Constructs and returns the Random.org URL with any overridden parameters without sending a request.

### `checkQuota(fetchOptions?)`
Returns the remaining daily quota (in bits) for the calling IP address.

---

## Parameter Configuration

| Parameter | Default | Description | Allowed Values |
| :--- | :--- | :--- | :--- |
| `num` | `1` | Quantity of integers to generate | `1` - `10000` |
| `min` | `1` | Minimum value allowed | `-1000000000` - `1000000000` |
| `max` | `100` | Maximum value allowed | `-1000000000` - `1000000000` |
| `col` | `1` | Number of columns in output | `1` - `10000` |
| `base` | `10` | Base used to format numbers | `2`, `8`, `10`, `16` |
| `format` | `'plain'` | Output format | `'plain'`, `'html'` |
| `rnd` | `'new'` | Random source | `'new'`, `'id.<id>'`, `'date.<iso>'` |
| `cl` | `'w'` | Layout / widget flag | `'w'`, custom string, or `undefined` |

Any additional properties provided in the options object will be appended as URL query parameters.

---

## CLI Usage

You can use the built-in CLI without installing anything:

```bash
# Default call (1 to 100)
npx true-random-tools

# Custom range and count
npx true-random-tools --min 50 --max 150 --num 3

# Show the requested URL
npx true-random-tools --url

# Output raw response from Random.org
npx true-random-tools --raw

# Disable cl parameter
npx true-random-tools --no-cl
```

---

## Publishing to npm

### 1. Check Package Name Availability
```bash
npm view true-random-tools
```
*(If taken, scope your package in `package.json` to `@your-username/true-random-tools`)*.

### 2. Authenticate with npm
```bash
npm login
```

### 3. Verify Files to be Bundled
```bash
npm publish --dry-run
```

### 4. Publish
- For an **unscoped** package:
  ```bash
  npm publish
  ```
- For a **scoped** package (e.g. `@your-username/true-random-tools`):
  ```bash
  npm publish --access public
  ```

---

## License

MIT © [Kavindu](LICENSE)
