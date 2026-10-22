/**
 * Exercise 8: Predict Async Output
 * 
 * Problem:
 * Explain the output order of synchronous logs, a resolved promise,
 * queueMicrotask(), and setTimeout().
 */

/**
 * =========================================================================
 * 1. THE CODE SNIPPET UNDER TEST
 * =========================================================================
 */
export function executeAsyncSnippet() {
  const output = [];
  const log = (msg) => {
    output.push(msg);
    console.log(msg);
  };

  log('1. [Sync] Script start');

  setTimeout(() => {
    log('6. [Macrotask] setTimeout 0ms');
  }, 0);

  Promise.resolve()
    .then(() => {
      log('3. [Microtask] Promise.then 1');
    })
    .then(() => {
      log('5. [Microtask] Promise.then 2 (chained)');
    });

  queueMicrotask(() => {
    log('4. [Microtask] queueMicrotask');
  });

  log('2. [Sync] Script end');

  return output;
}

/**
 * =========================================================================
 * 2. PREDICTED OUTPUT & STEP-BY-STEP EXPLANATION
 * =========================================================================
 * 
 * PREDICTED OUTPUT ORDER:
 * ----------------------------------------------------
 * 1. [Sync] Script start
 * 2. [Sync] Script end
 * 3. [Microtask] Promise.then 1
 * 4. [Microtask] queueMicrotask
 * 5. [Microtask] Promise.then 2 (chained)
 * 6. [Macrotask] setTimeout 0ms
 * ----------------------------------------------------
 * 
 * HOW THE JAVASCRIPT EVENT LOOP WORKS:
 * 
 * Phase 1: Call Stack (Synchronous Execution)
 * - The JavaScript engine begins executing the script on the single Call Stack.
 * - '1. [Sync] Script start' logs immediately.
 * - `setTimeout(..., 0)` registers a timer with the browser/Node host environment.
 *   Its callback is placed in the MACROTASK queue (Task Queue).
 * - `Promise.resolve().then(...)` schedules '3. Promise.then 1' into the MICROTASK queue.
 * - `queueMicrotask(...)` schedules '4. queueMicrotask' into the MICROTASK queue.
 * - '2. [Sync] Script end' logs immediately.
 * - The synchronous Call Stack is now EMPTY.
 * 
 * Phase 2: Draining the Microtask Queue
 * - RULE: Whenever the Call Stack empties, the Event Loop MUST exhaust ALL pending
 *   microtasks before it ever picks up the next macrotask!
 * - Microtask 1: '3. [Microtask] Promise.then 1' runs.
 *   Its return value schedules the chained `.then(...)` ('5. Promise.then 2') at
 *   the back of the microtask queue.
 * - Microtask 2: '4. [Microtask] queueMicrotask' was already queued, so it runs next!
 * - Microtask 3: '5. [Microtask] Promise.then 2 (chained)' runs next.
 * - The Microtask queue is now completely empty.
 * 
 * Phase 3: Macrotask Queue (Next Event Loop Tick)
 * - The event loop selects the oldest task from the Macrotask queue.
 * - '6. [Macrotask] setTimeout 0ms' executes.
 */

// Verification Script
export async function runPredictAsyncVerification() {
  console.log('--- Exercise 8: Predict Async Output ---');
  console.log('Running code and capturing real execution order...\n');

  const expectedOrder = [
    '1. [Sync] Script start',
    '2. [Sync] Script end',
    '3. [Microtask] Promise.then 1',
    '4. [Microtask] queueMicrotask',
    '5. [Microtask] Promise.then 2 (chained)',
    '6. [Macrotask] setTimeout 0ms'
  ];

  const actualOrder = [];

  actualOrder.push('1. [Sync] Script start');
  console.log('1. [Sync] Script start');

  setTimeout(() => {
    actualOrder.push('6. [Macrotask] setTimeout 0ms');
    console.log('6. [Macrotask] setTimeout 0ms');

    // Verification check once all tasks completed
    console.log('\n--- Event Loop Verification ---');
    const isExactMatch = JSON.stringify(actualOrder) === JSON.stringify(expectedOrder);
    console.log('Observed Matches Theoretical Event Loop Order:', isExactMatch);
  }, 0);

  Promise.resolve()
    .then(() => {
      actualOrder.push('3. [Microtask] Promise.then 1');
      console.log('3. [Microtask] Promise.then 1');
    })
    .then(() => {
      actualOrder.push('5. [Microtask] Promise.then 2 (chained)');
      console.log('5. [Microtask] Promise.then 2 (chained)');
    });

  queueMicrotask(() => {
    actualOrder.push('4. [Microtask] queueMicrotask');
    console.log('4. [Microtask] queueMicrotask');
  });

  actualOrder.push('2. [Sync] Script end');
  console.log('2. [Sync] Script end');

  // Wait for the setTimeout macrotask to finish before resolving
  await new Promise((resolve) => setTimeout(resolve, 50));
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runPredictAsyncVerification();
}
