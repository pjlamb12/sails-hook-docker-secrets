/**
 * docker-secrets hook
 */
const merge = require('lodash.merge');
const secrets = require('@cloudreach/docker-secrets');

function buildObj(key, value) {
	const obj = {};
	obj[key] = value;

	return obj;
}

function splitSailsConfigs(obj) {
	let newObj = {};
	for (const attr of Object.keys(obj)) {
		if (attr.indexOf('sails_') > -1) {
			let subObj = {};
			const value = obj[attr];
			let split = attr.split('sails_');
			split = split.filter(item => item !== '');
			const sailsConfigSubAttrStr = split && split.length === 1 ? split[0] : '';
			const sailsConfigSubAttrKeys = sailsConfigSubAttrStr.split('__');

			for (let i = sailsConfigSubAttrKeys.length; i > 0; i--) {
				const currentKeyStr = sailsConfigSubAttrKeys[i - 1];
				subObj =
					i === sailsConfigSubAttrKeys.length
						? buildObj(currentKeyStr, value)
						: buildObj(currentKeyStr, subObj);
			}

			newObj = merge({}, newObj, subObj);
		}
	}
	return newObj;
}

module.exports = function dockerSecrets(sails) {
	function mergeConfig() {
		const configToMerge = splitSailsConfigs(secrets);
		sails.config = merge({}, sails.config, configToMerge);
	}

	return {
		// Run when sails loads-- be sure and call `next()`.
		initialize: function(next) {
			mergeConfig();
			return next();
		},
		mergeConfig,
	};
};
