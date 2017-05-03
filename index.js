'use strict';
const
    TelegramBot = require('telegram-bot-oop-way'),
    YartrUtils = require('./lib/yartrUtils.js'),
    log = require('simple-node-logger').createSimpleFileLogger('project.log'),
    argvToken = '' + process.argv[2], 
    coordsMap = require('./stations/stations.json');

class YartrBot extends TelegramBot.TelegramBotBase {
    constructor(token) {
        super(token);
        let self = this;
        this.registerOnTextCallback(/[a-zа-я]/gim, self.ontextCb.bind(self));
    }
    onLocation(locationMsg) {
        let stationKey = YartrUtils.getNearestStationKey(locationMsg.location),
            stationLinks = coordsMap[stationKey].links,
            userLocationKeyboard = YartrUtils.generateLocationKeyboardOptions(stationLinks),
            userName = this.getUserName(locationMsg);

        log.info('Пришли координаты от ', userName ,'. Локация: ', '"', locationMsg.location, '"');
        this.bot.sendMessage(locationMsg.chat.id, `Ближе всего: ${stationKey}.`, userLocationKeyboard);
    }
    onCallbackQuery(msg) {
        let msgId = msg.from.id,
            url = `http://yartr.ru/rasp.php?vt=1&nmar=78&q=1&id=${msg.data}&view=2`,
            userName = this.getUserName(msg);

        this.bot.answerCallbackQuery(msg.id, 'Ок, поехали!');
        log.info('Грабим расписание для ', userName, '. ссылка: ', '"', url, '"');
        YartrUtils.resolveLink(url, this.bot, msg).then( (message) => this.bot.sendMessage(msgId, message));
    }
    ontextCb(msg) {
            log.info('Сообщение от ', this.getUserName(msg) ,'. Текст сообщения: ', '"', msg.text, '"');
            this.bot.sendMessage(msg.chat.id, '📡 Отправь свое местоположение');
    }
}


new YartrBot('253077674:AAHXDAqu0B9y86QVDqe3WA9n0iOsMd7V5MQ');