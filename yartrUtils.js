'use strict';
const  coordsMap = require('./stations.json');
module.exports = {
    generateLocationKeyboardOptions: function(links) {
        let keyboard = [];
        console.log('im here');
        for (let title in links) {
            keyboard.push([{
                text: title,
                callback_data: links[title]
            }])
        };
        console.log(keyboard);
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard
            })
        };
    },
    getNearestStationKey: function(userLocation) {
        var nearestStation = null;
        var minDelta = 100500;
        for (var stationKey in coordsMap) {
            var stationCoords = coordsMap[stationKey].location;
            var latitudeDelta = userLocation.latitude - stationCoords.latitude;
            if (latitudeDelta < 0) latitudeDelta *= -1;
            var longitudeDelta = userLocation.longitude - stationCoords.longitude;
            if (longitudeDelta < 0) longitudeDelta *= -1;

            var totalDelta = longitudeDelta + latitudeDelta;
            if (totalDelta < minDelta) {
                minDelta = totalDelta;
                nearestStation = stationKey;
            }
        }
        return nearestStation;
    }
}