'use strict';

/* eslint-disable no-undef */

const { expect } = require('chai');
const { configurationBackupNeedsUpdate } = require('./configurationBackup');

describe('device configuration backup', () => {
	it('does not update an equal backup', () => {
		const configuration = { devices: [{ id: 'living_room', name: 'Living room' }] };

		expect(configurationBackupNeedsUpdate(configuration, structuredClone(configuration))).to.equal(false);
	});

	it('detects changed or missing backups', () => {
		const configuration = { devices: [{ id: 'living_room', name: 'Living room' }] };

		expect(configurationBackupNeedsUpdate(configuration, { devices: [] })).to.equal(true);
		expect(configurationBackupNeedsUpdate(configuration, undefined)).to.equal(true);
	});
});
