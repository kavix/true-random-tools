#!/usr/bin/env node

const { fetchRandom, buildRandomUrl } = require('../src/index.js');

function parseArgs(args) {
  const params = {};
  let showUrl = false;
  let rawOnly = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log(`
true-random-tools CLI

Usage:
  npx true-random-tools [options]

Options:
  --num <n>        Number of integers to generate (default: 1)
  --min <n>        Minimum value (default: 1)
  --max <n>        Maximum value (default: 100)
  --col <n>        Number of columns (default: 1)
  --base <n>       Numeric base: 2, 8, 10, or 16 (default: 10)
  --format <f>     Format: plain or html (default: plain)
  --rnd <r>        Randomization: new, id.<id>, date.<iso-date> (default: new)
  --cl <c>         Widget or layout parameter (default: w)
  --no-cl          Do not pass the cl parameter
  --url            Print the constructed URL before fetching
  --raw            Output only the raw response from Random.org
  -h, --help       Show help menu

Examples:
  npx true-random-tools
  npx true-random-tools --min 10 --max 500 --num 5
  npx true-random-tools --no-cl --format plain
  npx true-random-tools --url
`);
      process.exit(0);
    } else if (arg === '--url') {
      showUrl = true;
    } else if (arg === '--raw') {
      rawOnly = true;
    } else if (arg === '--no-cl') {
      params.cl = undefined;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        params[key] = isNaN(Number(next)) ? next : Number(next);
        i++;
      } else {
        params[key] = true;
      }
    }
  }

  return { params, showUrl, rawOnly };
}

async function main() {
  const { params, showUrl, rawOnly } = parseArgs(process.argv.slice(2));

  if (showUrl) {
    console.log(`Request URL: ${buildRandomUrl(params)}\n`);
  }

  try {
    const result = await fetchRandom(params);

    if (rawOnly) {
      process.stdout.write(result.raw + (result.raw.endsWith('\n') ? '' : '\n'));
      return;
    }

    if (result.numbers.length > 0) {
      console.log(result.numbers.join('\n'));
    } else {
      console.log(result.raw.trim());
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
