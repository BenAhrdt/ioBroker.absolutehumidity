'use strict';

const { isDeepStrictEqual } = require('node:util');

/**
 * Returns whether the current devices-folder native data differs from its backup.
 *
 * @param {Record<string, unknown>} devicesNative Current native data from the devices folder.
 * @param {unknown} backup Previously stored native data.
 * @returns {boolean} Whether the backup needs to be updated.
 */
function configurationBackupNeedsUpdate(devicesNative, backup) {
	return !isDeepStrictEqual(devicesNative, backup);
}

module.exports = {
	configurationBackupNeedsUpdate,
};
