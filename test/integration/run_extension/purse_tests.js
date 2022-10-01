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

const { Jig, Transaction } = require('run-sdk');

async function purseTests(run, supportsBackedJigs = false) {
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
	const tx1 = new Transaction();
	let sword;
	let staff;
	tx1.update(() => {
		sword = new Weapon();
	});
	tx1.update(() => {
		staff = new Weapon();
	});
	await tx1.publish();

	console.log('Test 03: Pay for a single dust input and output');
	// Calling a method spends the output and creates a new output
	sword.upgrade();
	await sword.sync();

	console.log('Test 04: Pay for multiple dust inputs and outputs');
	// We use a batch to update two jigs, spending and creating two outputs
	const tx2 = new Transaction();
	tx2.update(() => sword.upgrade());
	tx2.update(() => staff.upgrade());
	await tx2.publish();

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
		await sword.sync();

		console.log('Test 06: Receive change from a backed jig');
		sword.setMeltValue(0);
		await sword.sync();

		// Check that change is sent back to the wallet by looking at the fee
		if (lastBroadcastedTx.getFee() > 1000) throw new Error('Back jig change not received');
	}

	if (!supportsBackedJigs) {
		console.log('Test 05: Do not back any jigs with satoshis');
		sword.setMeltValue(5000);
		let errored = false;
		await sword.sync().catch(() => {
			errored = true;
		});
		if (!errored) throw new Error('Expected error');
	}

	console.log('All tests passed');
}

module.exports = purseTests;
