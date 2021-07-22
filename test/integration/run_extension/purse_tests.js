/**
 * purse-tests.js
 *
 * Tests for the Purse functionality of a wallet.
 *
 * Usage:
 *
 *      Copy this function into a browser or node script. Then:
 *
 *      const wallet = new MyWallet()
 *      const run = new Run({ wallet })
 *      purseTests(run, false)
 *
 * The supportsBackedJigs parameter depends on the wallet's implementation. If your wallet
 * will pay for non-dust outputs, pass true. If not, pass false. Either behavior is OK as
 * long as it is intentional.
 */

const { Jig } = require('run-sdk');

async function purseTests(run, supportsBackedJigs = true) {
   class Weapon extends Jig {
      upgrade() {
         this.upgrades = (this.upgrades || 0) + 1;
      }

      setMeltValue(satoshis) {
         this.satoshis = satoshis;
      }
   }

   console.log('Test 01: Pay for a single dust output');
   // We use deploy() to create a single unspent output, the class
   run.deploy(Weapon);
   await run.sync();

   console.log('Test 02: Pay for multiple dust outputs');
   // We use a batch to create two unspent outputs, two instances
   const sword = new Weapon();
   const staff = new Weapon();
   await run.sync();

   console.log('Test 03: Pay for a single dust input and output');
   // Calling a method spends the output and creates a new output
   sword.upgrade();
   await run.sync();

   console.log('Test 04: Pay for multiple dust inputs and outputs');
   // We use a batch to update two jigs, spending and creating two outputs
   sword.upgrade();
   staff.upgrade();
   await run.sync();

   if (supportsBackedJigs) {
      // Spy on the blockchain to monitor transactions published
      const originalBroadcast = run.blockchain.broadcast;
      let lastBroadcastedTx = null;
      run.blockchain.broadcast = async (tx) => {
         lastBroadcastedTx = tx;
         await originalBroadcast.call(run.blockchain, tx);
      };

      console.log('Test 05: Pay to back a jig with satoshis');
      sword.setMeltValue(5000);
      await run.sync();

      console.log('Test 06: Receive change from a backed jig');
      sword.setMeltValue(0);
      await run.sync();

      // Check that change is sent back to the wallet by looking at the fee
      if (lastBroadcastedTx.getFee() > 1000) throw new Error('Back jig change not received');
   }

   if (!supportsBackedJigs) {
      console.log('Test 05: Do not back any jigs with satoshis');
      sword.setMeltValue(5000);
      let errored = false;
      await run.sync()
         .catch(() => {
            errored = true;
         });
      if (!errored) throw new Error('Expected error');
   }

   console.log('All tests passed');
}

module.exports = purseTests;
