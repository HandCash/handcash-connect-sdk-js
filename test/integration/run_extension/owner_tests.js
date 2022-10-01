/**
 * owner-tests.js
 *
 * Tests for the Owner functionality of a wallet.
 *
 * Usage:
 *
 *      Copy this function into a browser or node script. Then:
 *
 *      const wallet = new MyWallet()
 *      const run = new Run({ wallet })
 *      ownerTests(run)
 */

const { Jig, Transaction } = require('run-sdk');

async function ownerTests(run) {
	class Weapon extends Jig {
		upgrade() {
			this.upgrades = (this.upgrades || 0) + 1;
		}
	}

	// If owner() doesn't return a valid result, this will fail
	console.log('Test 01: New jigs are assigned an owner');
	run.deploy(Weapon);
	await run.sync();

	// Updated jigs must be signed by the owner
	console.log('Test 02: Sign a single jig update');
	const weapon = new Weapon();
	weapon.upgrade();
	await weapon.sync();

	// Sign multiple jigs
	console.log('Test 03: Sign multiple jig updates');
	const weapon2 = new Weapon();
	const tx2 = new Transaction();
	tx2.update(() => weapon.upgrade());
	tx2.update(() => weapon2.upgrade());
	await tx2.publish();

	console.log('All tests passed');
}

module.exports = ownerTests;
