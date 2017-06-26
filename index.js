'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const
    TelegramBot = require('telegram-bot-oop-way'),
    YartrUtils = require('./lib/yartrUtils.js'),
    log = require('simple-node-logger').createSimpleFileLogger('project.log'),
    argvToken = '' + process.argv[2],
    coordsMap = require('./stations/stations.json');

class YartrBot extends TelegramBot {

    constructor(token, coordsMap) {
        super(token);
        let self = this;
        self.coordsMap = coordsMap;
        this.registerOnTextCallback(/[a-zа-я]/gim, self.ontextCb.bind(self));
    }
    onLocation(locationMsg) {
        let nearestStation = YartrUtils.getNearestStationKey(locationMsg.location),
            nearestStationLinks = this.coordsMap[nearestStation].links,
            userLocationKeyboard = YartrUtils.generateLocationKeyboardOptions(nearestStationLinks),
            userName = this.getUserName(locationMsg);

        log.info('Пришли координаты от ', userName, '. Локация: ', '"', locationMsg.location, '"');
        this.sendMessage(locationMsg.chat.id, `Ближе всего: ${stationKey}.`, userLocationKeyboard);
    }
    onCallbackQuery(msg) {
        let msgId = msg.from.id,
            url = `http://yartr.ru/rasp.php?vt=1&nmar=78&q=1&id=${msg.data}&view=2`,
            userName = this.getUserName(msg);

        this.answerCallbackQuery(msg.id, 'Ок, поехали!');
        log.info('Грабим расписание для ', userName, '. ссылка: ', '"', url, '"');
        YartrUtils.resolveLink(url, this, msg).then((answer) => this.sendMessage(msgId, answer));
    }
    ontextCb(msg) {
        log.info('Сообщение от ', this.getUserName(msg), '. Текст сообщения: ', '"', msg.text, '"');
        this.sendMessage(msg.chat.id, '📡 Отправь свое местоположение');
    }
    
}


new YartrBot(argvToken, coordsMap);
