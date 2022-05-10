import {convertToMeter} from "./convertToMeter";

const rad = function (x) {
    return x * Math.PI / 180;
};

export const getDistance = function (p1, p2) {
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = rad(p2.lat - p1.lat);
    const dLong = rad(p2.lng - p1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // returns the distance in meter
};

export const pointWithinRadius = function (p1, p2, radius = 10, radiusUnit = 'Miles') {
    if (!p1 || !p2) {
        return true
    }

    const radiusToCompare = convertToMeter(radius, radiusUnit)

    const distance = getDistance(p1, p2)
    return distance < radiusToCompare;
}