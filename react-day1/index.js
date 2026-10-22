/**
 * React Day 1 Exercises - Master Runner
 * 
 * Runs all 8 exercises sequentially and displays formatted results.
 */

import { reverseString, reverseStringUnicode } from './01-reverse-string.js';
import { removeDuplicates, removeDuplicatesReduce } from './02-remove-duplicates.js';
import { countOccurrences } from './03-count-occurrences.js';
import { groupByDepartment } from './04-group-by-department.js';
import { runDebounceVerification } from './05-debounce.js';
import { runRetryVerification } from './06-retry.js';
import { runCancelSearchVerification } from './07-cancel-stale-search.js';
import { runPredictAsyncVerification } from './08-predict-async-output.js';

const divider = '='.repeat(60);

async function main() {
  console.log(divider);
  console.log('   REACT DAY 1: CORE JAVASCRIPT & ASYNC EXERCISES');
  console.log(divider);

  // Exercise 1
  console.log('\n[1] Reverse a String');
  const str = 'React';
  console.log(`Input: "${str}" -> Output: "${reverseString(str)}"`);
  console.log(`Unicode example: "React 🚀" -> "${reverseStringUnicode('React 🚀')}"`);

  // Exercise 2
  console.log('\n[2] Remove Duplicates');
  const numbers = [1, 2, 2, 3, 3, 4];
  console.log('Input: ', numbers);
  console.log('Output:', removeDuplicates(numbers));

  // Exercise 3
  console.log('\n[3] Count Occurrences');
  const letters = ['a', 'b', 'a', 'c', 'b', 'a'];
  console.log('Input: ', letters);
  console.log('Output:', countOccurrences(letters));

  // Exercise 4
  console.log('\n[4] Group Employees by Department');
  const employees = [
    { name: 'Alice', department: 'Engineering' },
    { name: 'Bob', department: 'HR' },
    { name: 'Charlie', department: 'Engineering' }
  ];
  console.log('Input:', employees);
  console.log('Output:', groupByDepartment(employees));

  // Exercise 5
  console.log('\n[5] Implement Debounce');
  await runDebounceVerification();

  // Exercise 6
  console.log('\n[6] Implement Retry');
  await runRetryVerification();

  // Exercise 7
  console.log('\n[7] Cancel Stale Searches (AbortController)');
  await runCancelSearchVerification();

  // Exercise 8
  console.log('\n[8] Predict Async Output (Event Loop)');
  await runPredictAsyncVerification();

  console.log('\n' + divider);
  console.log('   ALL 8 EXERCISES EXECUTED SUCCESSFULLY!');
  console.log(divider);
}

main().catch(console.error);
