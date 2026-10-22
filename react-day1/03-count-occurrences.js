/**
 * Exercise 3: Count Occurrences
 * 
 * Problem:
 * Count the occurrences of each element in an array.
 * Example: ['a', 'b', 'a', 'c', 'b', 'a'] => { a: 3, b: 2, c: 1 }
 */

// Approach 1: Using Array.prototype.reduce (Idiomatic Functional Pattern)
// Time Complexity: O(n), Space Complexity: O(k) where k is unique items
export function countOccurrences(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }

  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

// Approach 2: Using a for...of loop with Map (handles non-string keys like objects/numbers/booleans)
// Time Complexity: O(n), Space Complexity: O(k)
export function countOccurrencesMap(arr) {
  const countMap = new Map();
  for (const item of arr) {
    countMap.set(item, (countMap.get(item) || 0) + 1);
  }
  return countMap;
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  console.log('--- Exercise 3: Count Occurrences ---');
  const input = ['a', 'b', 'a', 'c', 'b', 'a'];
  const result = countOccurrences(input);
  console.log('Input: ', input);
  console.log('Counts:', result);

  const expected = { a: 3, b: 2, c: 1 };
  const matches = Object.keys(expected).every(
    (key) => result[key] === expected[key]
  ) && Object.keys(result).length === Object.keys(expected).length;
  console.log('Verification Passed:', matches);
}
