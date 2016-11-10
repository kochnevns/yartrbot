'use strict';
const  coordsMap = require('./../stations/stations.json');

function getDistance(locationA, locationB){
   return Math.sqrt(Math.pow(locationA.latitude - locationB.latitude, 2) + Math.pow(locationA.longitude - locationB.longitude, 2))
}

module.exports = {
    generateLocationKeyboardOptions: function(links) {
        let keyboard = [];
        for (let title in links) {
            keyboard.push([{
                text: title,
                callback_data: links[title]
            }])
        };
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard
            })
        };
    },

    getNearestStationKey: function(userLocation) {
        let nearestStation = null;
        let minDelta = Number.MAX_VALUE;
        for (let stationKey in coordsMap) {
            const stationLocation = coordsMap[stationKey].location;
            const delta = getDistance(stationLocation, userLocation)
            if (delta < minDelta) {
                minDelta = delta;
                nearestStation = stationKey;
            }
        }
        return nearestStation;
    }
}