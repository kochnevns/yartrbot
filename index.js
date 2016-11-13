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
        let self = this;
        self.bot.onText(/[a-zа-я]/gim, function(msg, match) {
            log.info('Сообщение от ', self.getUsername(msg) ,'. Текст сообщения: ', '"', msg.text, '"')
            self.bot.sendMessage(msg.chat.id, '📡 Отправь свое местоположение');
        });
    }
    onLocation(locationMsg) {
        let stationKey = YartrUtils.getNearestStationKey(locationMsg.location),
            stationLinks = coordsMap[stationKey].links,
            userLocationKeyboard = YartrUtils.generateLocationKeyboardOptions(stationLinks),
            userName = this.getUsername(locationMsg);

        log.info('Пришли координаты от ', userName ,'. Локация: ', '"', locationMsg.location, '"');
        this.bot.sendMessage(locationMsg.chat.id, `Ближе всего: ${stationKey}.`, userLocationKeyboard);
    }
    onCallbackQuery(msg) {
        let msgId = msg.from.id,
            url = `http://yartr.ru/rasp.php?vt=1&nmar=78&q=1&id=${msg.data}&view=2`,
            userName = this.getUsername(msg);

        this.bot.answerCallbackQuery(msg.id, 'Ок, поехали!');
        log.info('Начинаем обрабатывать сообщение от ', userName, '. ссылка: ', '"', url, '"');
        YartrResolve.resolveLink(url, this.bot, msgId, msg);
    }
}
const yarbot = new YartrBot(argvToken);