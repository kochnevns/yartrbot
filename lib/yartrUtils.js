'use strict';
const coordsMap = require('./../stations/stations.json'),
    rp = require('request-promise'),
    cheerio = require('cheerio'),
    log = require('simple-node-logger').createSimpleFileLogger('./../project.log'),
    tenSpaces = '          ',
    separator = '\n\t\t\n   🔅      ',
    rezhemLishnee = /назад|Отправление от\s*\W*/gim,
    header = "   🚌 Транспорт будет через: ";


function getDistance(locationA, locationB) {
    return Math.sqrt(Math.pow(locationA.latitude - locationB.latitude, 2) + Math.pow(locationA.longitude - locationB.longitude, 2));
}

let utils = {
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
    resolveLink: function resolveLink(url, bot, msg) {
        var self = this;
        return rp(url)
            .then(function(data) {
                let $ = cheerio.load(data);
                // хак. режем по бркам
                $('body').html($('body').html().split('<br>').toString());
                let parsed = self.convertSchedulle($('body').text().replace(rezhemLishnee, '').split(',').filter((i) => i.trim() !== '')),
                    resultMsg = separator + parsed.join(separator).replace(/Ав/g, `${tenSpaces}Автобус №`).replace(/Тб/g, `${tenSpaces}Троллейбус №`);
                log.info("Отправляем расписание пользователю @", msg.from.first_name, ' ', msg.from.last_name);
                return header + resultMsg;
            })
            .catch(function(err) {
                throw err;
            });
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
module.exports = utils;