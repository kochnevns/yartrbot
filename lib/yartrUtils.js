'use strict';
const coordsMap = require('./../stations/stations.json');

function getDistance(locationA, locationB) {
    return Math.sqrt(Math.pow(locationA.latitude - locationB.latitude, 2) + Math.pow(locationA.longitude - locationB.longitude, 2));
}

module.exports = {
    generateLocationKeyboardOptions: function generateLocationKeyboardOptions(links) {
        let keyboard = [];
        for (let title in links) {
            keyboard.push([{
                text: title,
                callback_data: links[title]
            }]);
        }
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard
            })
        };
    },

    getNearestStationKey: function getNearestStationKey(userLocation) {
        let nearestStation = null;
        let minDelta = Number.MAX_VALUE;
        for (let stationKey in coordsMap) {
            const stationLocation = coordsMap[stationKey].location;
            const delta = getDistance(stationLocation, userLocation);
            if (delta < minDelta) {
                minDelta = delta;
                nearestStation = stationKey;
            }
        }
        return nearestStation;
    },
    convertSchedulle: function convertSchedulle(schedulle) {
        let now = new Date();
        let [nowMinutes, nowHours] = [now.getMinutes(), now.getHours()];

        return schedulle.map(n => {
            let [time, bus] = n.split('  ');
            let [hours, minutes] = time.split('.');
            let minutesDelta = minutes - nowMinutes;

            if (hours > nowHours) {
                minutesDelta += 60;
            }
            return ` ${minutesDelta} мин.                ${bus}    `;
        });

    }
};