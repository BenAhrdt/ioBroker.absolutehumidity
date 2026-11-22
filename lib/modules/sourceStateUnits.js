/* eslint-disable jsdoc/require-param-description */
'use strict';

/**
 * @param {unknown} unit
 */
function normalizeUnit(unit) {
	return typeof unit === 'string' ? unit.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, '') : '';
}

/**
 * @param {unknown} unit
 */
function isSupportedTemperatureUnit(unit) {
	const normalizedUnit = normalizeUnit(unit);

	return (
		normalizedUnit === '' ||
		normalizedUnit.startsWith('°') ||
		normalizedUnit.startsWith('c') ||
		normalizedUnit.startsWith('f')
	);
}

/**
 * @param {unknown} unit
 */
function isSupportedRelativeHumidityUnit(unit) {
	const normalizedUnit = normalizeUnit(unit);

	return normalizedUnit === '' || normalizedUnit.startsWith('%');
}

/**
 * @param {unknown} unit
 */
function isFahrenheitUnit(unit) {
	const normalizedUnit = normalizeUnit(unit);

	return normalizedUnit.startsWith('°f') || normalizedUnit.startsWith('f');
}

module.exports = {
	isFahrenheitUnit,
	isSupportedRelativeHumidityUnit,
	isSupportedTemperatureUnit,
	normalizeUnit,
};
