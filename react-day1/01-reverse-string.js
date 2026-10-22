/**
 * Exercise 1: Reverse a String
 * 
 * Problem:
 * Write a function `reverseString(str)` that accepts a string and returns it reversed.
 * Example: reverseString('React') => 'tcaeR'
 */

// Approach 1: Modern idiomatic JavaScript (split, reverse, join)
// Time Complexity: O(n), Space Complexity: O(n)
export function reverseString(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  return str.split('').reverse().join('');
}

// Approach 2: Iterative without built-in array reverse (Looping backwards)
// Time Complexity: O(n), Space Complexity: O(n)
export function reverseStringLoop(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Approach 3: Two-pointer in-place array swap (handles Unicode code points with Array.from)
// Time Complexity: O(n), Space Complexity: O(n)
export function reverseStringUnicode(str) {
  const chars = Array.from(str);
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars.join('');
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  console.log('--- Exercise 1: Reverse a String ---');
  const input = 'React';
  const result1 = reverseString(input);
  const result2 = reverseStringLoop(input);
  const result3 = reverseStringUnicode('React 🚀');

  console.log(`Input: "${input}"`);
  console.log(`Result (split-reverse-join): "${result1}"`);
  console.log(`Result (loop):               "${result2}"`);
  console.log(`Result (Unicode safe):       "${result3}"`);
  console.log(`Verification Passed:         ${result1 === 'tcaeR'}`);
}
