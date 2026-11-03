'use strict';

const vm = require('node:vm');
const { expect } = require('chai');
const { getDeviceFormSchema, getDevicesSortedByAbsoluteHumidity } = require('./lib/modules/deviceManager');
const { createUpdatedDeviceId } = require('./lib/modules/idUtils');
const {
	isFahrenheitUnit,
	isSupportedRelativeHumidityUnit,
	isSupportedTemperatureUnit,
	normalizeUnit,
} = require('./lib/modules/sourceStateUnits');

function evaluateFilter(filter, object) {
	return vm.runInNewContext(`(obj => { ${filter} })(obj)`, { obj: object });
}

describe('source state units', () => {
	it('normalizes Unicode temperature symbols and whitespace', () => {
		expect(normalizeUnit(' ℃ ')).to.equal('°c');
		expect(normalizeUnit('℉')).to.equal('°f');
		expect(normalizeUnit('% rF')).to.equal('%rf');
	});

	it('accepts supported temperature and humidity units only', () => {
		expect(isSupportedTemperatureUnit('℃')).to.equal(true);
		expect(isSupportedTemperatureUnit('℉')).to.equal(true);
		expect(isSupportedTemperatureUnit('K')).to.equal(false);
		expect(isFahrenheitUnit('℉')).to.equal(true);
		expect(isSupportedRelativeHumidityUnit('% rF')).to.equal(true);
		expect(isSupportedRelativeHumidityUnit('% RH')).to.equal(true);
		expect(isSupportedRelativeHumidityUnit('%/s')).to.equal(false);
	});
});

describe('device form source state filters', () => {
	const schema = getDeviceFormSchema();
	const temperatureFilter = schema.items.temperatureStateId.filterFunc;
	const humidityFilter = schema.items.relativeHumidityStateId.filterFunc;

	it('accepts Unicode temperature units', () => {
		expect(evaluateFilter(temperatureFilter, { type: 'state', common: { type: 'number', unit: '℃' } })).to.equal(true);
		expect(evaluateFilter(temperatureFilter, { type: 'state', common: { type: 'number', unit: '℉' } })).to.equal(true);
	});

	it('accepts common relative humidity unit variants', () => {
		expect(evaluateFilter(humidityFilter, { type: 'state', common: { type: 'number', unit: '% rF' } })).to.equal(true);
		expect(evaluateFilter(humidityFilter, { type: 'state', common: { type: 'number', unit: '% RH' } })).to.equal(true);
		expect(evaluateFilter(humidityFilter, { type: 'state', common: { type: 'number', unit: '%/s' } })).to.equal(false);
	});
});

describe('device ID updates', () => {
	it('should create a new ID when a device is renamed', () => {
		const devices = [{ id: 'living_room', name: 'Living room' }];

		const id = createUpdatedDeviceId('Bedroom', 'living_room', devices);

		expect(id).to.equal('bedroom');
	});

	it('should keep the ID when the sanitized device name does not change', () => {
		const devices = [{ id: 'living_room', name: 'Living room' }];

		const id = createUpdatedDeviceId('Living room', 'living_room', devices);

		expect(id).to.equal('living_room');
	});

	it('should avoid IDs already used by other devices', () => {
		const devices = [
			{ id: 'living_room', name: 'Living room' },
			{ id: 'bedroom', name: 'Bedroom' },
		];

		const id = createUpdatedDeviceId('Bedroom', 'living_room', devices);

		expect(id).to.equal('bedroom_2');
	});
});

describe('device manager sorting', () => {
	it('should sort devices by absolute humidity ascending', async () => {
		const devices = [
			{ id: 'bathroom', name: 'Bathroom' },
			{ id: 'outside', name: 'Outside' },
			{ id: 'living_room', name: 'Living room' },
		];
		const states = new Map([
			['devices.bathroom.absoluteHumidity', { val: 11.2 }],
			['devices.outside.absoluteHumidity', { val: 7.6 }],
			['devices.living_room.absoluteHumidity', { val: 9.4 }],
		]);
		const adapter = {
			getConfiguredDevices: () => devices,
			getDeviceObjectId: id => `devices.${id}`,
			getStateAsync: async id => states.get(id),
			log: {
				debug: () => {},
			},
		};

		const sortedDevices = await getDevicesSortedByAbsoluteHumidity(adapter);

		expect(sortedDevices.map(device => device.id)).to.deep.equal(['outside', 'living_room', 'bathroom']);
	});
});
