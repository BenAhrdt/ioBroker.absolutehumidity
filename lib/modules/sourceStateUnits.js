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

	return normalizedUnit === '' || normalizedUnit === '°c' || normalizedUnit === 'c' || isFahrenheitUnit(unit);
}

/**
 * @param {unknown} unit
 */
function isSupportedRelativeHumidityUnit(unit) {
	const normalizedUnit = normalizeUnit(unit);

	return normalizedUnit === '' || normalizedUnit === '%' || normalizedUnit === '%rf' || normalizedUnit === '%rh';
}

/**
 * @param {unknown} unit
 */
function isFahrenheitUnit(unit) {
	const normalizedUnit = normalizeUnit(unit);

	return normalizedUnit === '°f' || normalizedUnit === 'f';
}

module.exports = {
	isFahrenheitUnit,
	isSupportedRelativeHumidityUnit,
	isSupportedTemperatureUnit,
	normalizeUnit,
};
