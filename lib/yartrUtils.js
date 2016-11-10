'use strict';
const  coordsMap = require('./../stations/stations.json');

function getDistance(locationA, locationB){
   return Math.sqrt(Math.pow(locaionA.latitude - locaionB.latitude, 2) + Math.pow(locaionA.longitude - locaionB.longitude, 2))
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
                minDelta = totalDelta;
                nearestStation = stationKey;
            }
        }
        return nearestStation;
    }
}