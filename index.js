'use strict';
const
    YartrResolve = require('./lib/yartrLinkResolve.js'),
    TelegramBot = require('./lib/TelegramBotBase.js'),
    YartrUtils = require('./lib/yartrUtils.js'),
    log = require('simple-node-logger').createSimpleFileLogger('project.log'),
    argvToken = '' + process.argv[2],
    coordsMap = require('./stations/stations.json');

class YartrBot extends TelegramBot.TelegramBotBase {
    constructor(token) {
        super(token);
        var self = this;
        self.bot.onText(/[a-zа-я]/gim, function(msg, match) {
            log.info('Сообщение от @', msg.from.first_name, ' ', msg.from.last_name, '. Текст сообщения: ', '"', msg.text, '"')
            self.bot.sendMessage(msg.chat.id, '📡 Отправь свое местоположение');
        });
    }
    onLocation(locationMsg) {
        let stationKey = YartrUtils.getNearestStationKey(locationMsg.location),
            stationLinks = coordsMap[stationKey].links,
        userLocationKeyboard = YartrUtils.generateLocationKeyboardOptions(stationLinks);

        log.info('Пришли координаты от @', locationMsg.from.first_name, ' ', locationMsg.from.last_name, '. Локация: ', '"', locationMsg.location, '"');
        this.sendMessage(locationMsg.chat.id, `Ближе всего: ${stationKey}.`, userLocationKeyboard);
    }
    onCallbackQuery(msg) {
        let msgId = msg.from.id,
            callbackParam = msg.data,
            url = `http://yartr.ru/rasp.php?vt=1&nmar=78&q=1&id=${callbackParam}&view=2`;

        this.answerCallbackQuery(msg.id, 'Ок, поехали!');
        log.info('Начинаем обрабатывать сообщение от @', msg.from.first_name, ' ', msg.from.last_name, '. ссылка: ', '"', url, '"');
        YartrResolve.resolveLink(url, this, msgId, msg);
    }
}
const yarbot = new YartrBot(argvToken);