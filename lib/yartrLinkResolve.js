'use strict';
const rp = require('request-promise'),
    cheerio = require('cheerio'),
    log = require('simple-node-logger').createSimpleFileLogger('./../project.log'),
    tenSpaces = '          ',
    separator = '\n\t\t\n   🕐  ',
    rezhemLishnee = /назад|Отправление от\s*\W*/gim,
    header = "Расписание 🚌:\n";

module.exports = {
    resolveLink: function resolveLink(url, bot, id, msg) {
        rp(url)
            .then(function(data) {

                let $ = cheerio.load(data);
                // хак. режем по бркам
                $('body').html($('body').html().split('<br>').toString());
                let parsed = $('body').text().replace(rezhemLishnee, '').split(',').filter((i) => i.trim() !== ''),
                resultMsg = separator + parsed.join(separator).replace(/Ав/g, `${tenSpaces}Автобус №`).replace(/Тб/g, `${tenSpaces}Троллейбус №`);

                log.info("Отправляем расписание пользователю @", msg.from.first_name, ' ', msg.from.last_name);
                bot.sendMessage(id, header + resultMsg);
            })
            .catch(function(err) {
                throw err;
            });
    }
}