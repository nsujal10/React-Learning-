/**
 * Exercise 2: Remove Duplicates from an Array
 * 
 * Problem:
 * Given an array with duplicate elements, return a new array containing unique elements.
 * Example: [1, 2, 2, 3, 3, 4] => [1, 2, 3, 4]
 */

// Approach 1: Using Set and Spread Operator (Standard & Most Efficient)
// Time Complexity: O(n), Space Complexity: O(n)
export function removeDuplicates(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }
  return [...new Set(arr)];
}

// Approach 2: Using Array.prototype.filter and indexOf
// Useful in environments without Set or when explaining index matching logic.
// Time Complexity: O(n^2) because indexOf scans the array, Space Complexity: O(n)
export function removeDuplicatesFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// Approach 3: Using a seen Set with reduce (Good for custom key uniqueness)
// Time Complexity: O(n), Space Complexity: O(n)
export function removeDuplicatesReduce(arr, keyFn = (x) => x) {
  const seen = new Set();
  return arr.reduce((acc, current) => {
    const key = keyFn(current);
    if (!seen.has(key)) {
      seen.add(key);
      acc.push(current);
    }
    return acc;
  }, []);
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  console.log('--- Exercise 2: Remove Duplicates ---');
  const input = [1, 2, 2, 3, 3, 4];
  const result = removeDuplicates(input);
  console.log('Input: ', input);
  console.log('Unique:', result);

  // Example with duplicate objects keyed by id
  const objects = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 1, name: 'Alice Duplicate' }
  ];
  const uniqueObjs = removeDuplicatesReduce(objects, (o) => o.id);
  console.log('Unique by key:', uniqueObjs);
  console.log('Verification Passed:', JSON.stringify(result) === JSON.stringify([1, 2, 3, 4]));
}
