var Sails = require('sails').Sails;
const assert = require('assert');

describe('Basic tests ::', function() {
	// Var to hold a running sails app instance
	var sails;

	// Before running any tests, attempt to lift Sails
	before(function(done) {
		// Hook will timeout in 10 seconds
		this.timeout(11000);

		// Attempt to lift sails
		Sails().lift(
			{
				hooks: {
					// Load the hook
					'hsahp-auth': require('../'),
					// Skip grunt (unless your hook uses it)
					grunt: false,
				},
				log: { level: 'error' },
			},
			function(err, _sails) {
				if (err) return done(err);
				sails = _sails;
				return done();
			},
		);
	});

	// After tests are complete, lower Sails
	after(function(done) {
		// Lower Sails (if it successfully lifted)
		if (sails) {
			return sails.lower(done);
		}
		// Otherwise just return
		return done();
	});

	// Test that Sails can lift with the hook in place
	it('sails does not crash', function() {
		return true;
	});
	it('sails config is here', function(done) {
		assert.equal(true, true);
		return done();
	});
	it('merges changes that are prefixed with sails_', function(done) {
		assert.equal(true, !!sails.config.myAttr);
		return done();
	});
	it('does not merge changes that lack the sails_ prefix', function(done) {
		assert.equal(true, !sails.config.shouldntAdd);
		return done();
	});
});
