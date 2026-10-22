/**
 * Exercise 6: Implement Retry Helper
 * 
 * Problem:
 * Create an async helper `retry(fn, maxAttempts = 3, delay = 0)` that retries
 * a failed operation up to three attempts before throwing the final error.
 */

/**
 * Retries an asynchronous operation up to maxAttempts times.
 * 
 * @param {Function} asyncFn - A function returning a Promise.
 * @param {number} maxAttempts - Maximum number of attempts (default: 3).
 * @param {number} delayMs - Delay between attempts in milliseconds (default: 0).
 * @returns {Promise<any>} - Resolves with the result of asyncFn or rejects with final error.
 */
export async function retry(asyncFn, maxAttempts = 3, delayMs = 0) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await asyncFn(attempt);
      return result;
    } catch (err) {
      lastError = err;
      console.log(`[Attempt ${attempt}/${maxAttempts} failed]: ${err.message}`);

      // If attempts remain and delay is requested, wait before retrying
      if (attempt < maxAttempts && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // All attempts failed; throw the final error
  throw lastError;
}

// Verification Script
export async function runRetryVerification() {
  console.log('--- Exercise 6: Implement Retry Helper ---');

  // Scenario 1: Succeeds on the 3rd attempt
  console.log('\n--- Scenario 1: Operation succeeds on attempt #3 ---');
  let attemptCounter = 0;
  const flakeyService = async (attempt) => {
    attemptCounter++;
    if (attemptCounter < 3) {
      throw new Error(`Temporary network timeout (attempt ${attemptCounter})`);
    }
    return `Success on attempt #${attemptCounter}!`;
  };

  try {
    const successResult = await retry(flakeyService, 3, 100);
    console.log(`Final Result: "${successResult}"`);
    console.log('Scenario 1 Passed:', successResult === 'Success on attempt #3!');
  } catch (err) {
    console.error('Scenario 1 Unexpected Error:', err);
  }

  // Scenario 2: Always fails and throws final error after 3 attempts
  console.log('\n--- Scenario 2: Operation fails all 3 attempts ---');
  let failedCounter = 0;
  const brokenService = async (attempt) => {
    failedCounter++;
    throw new Error(`Permanent 500 Internal Server Error (attempt ${failedCounter})`);
  };

  try {
    await retry(brokenService, 3, 50);
    console.log('Scenario 2 Failed: Should have thrown an error!');
  } catch (err) {
    console.log(`Caught Expected Error: "${err.message}"`);
    console.log('Total attempts made:', failedCounter);
    console.log('Scenario 2 Passed:', failedCounter === 3 && err.message.includes('attempt 3'));
  }
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runRetryVerification();
}
