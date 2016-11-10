const TelegramBot = require('node-telegram-bot-api');
const YartrResolve = require('./yartrlinkresolve.js');

var log = require('simple-node-logger').createSimpleFileLogger('project.log');

const token = '253077674:AAHXDAqu0B9y86QVDqe3WA9n0iOsMd7V5MQ';

const keyboardOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'На работку             💼 ', callback_data: '1' }],
      [{ text: 'Домой                      🏠 ', callback_data: '2' }]
    ]
  })
};

function generateLocationKeybordOptions(links) {
  keybord = [];
  for (var title in links) {
    keybord.push([{
      text: title, callback_data: links[title]
    }])
  }
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: keybord
    })
  }
}

const coordsMap = require('./stations.json');

const bot = new TelegramBot(token, { polling: true });

function getNearestStationLinks(userLocation) {
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
  return  nearestStation;
}

function resolveLocation (msg) {
  var stationKey = getNearestStationLinks(msg.location);
  var stationLinks = coordsMap[stationKey].links;
  var userLocationKeyboard = generateLocationKeybordOptions(stationLinks);

  log.info('Пришли координаты от @', msg.from.first_name,' ', msg.from.last_name, '. Локация: ', '"', msg.location, '"');
  bot.sendMessage(msg.chat.id, `Ближе всего: ${stationKey}.`, userLocationKeyboard);
}

bot.onText(/[a-zа-я]/gim, function (msg, match) {
  log.info('Сообщение от @', msg.from.first_name,' ', msg.from.last_name, '. Текст сообщения: ', '"', msg.text, '"')
  bot.sendMessage(msg.chat.id, '📡 Отправь местоположение \n 🚌 Или выбери направление:', keyboardOptions);
});

bot.on('location', resolveLocation)
// Inline button callback queries
bot.on('callback_query', function (msg) {
  bot.answerCallbackQuery(msg.id, 'Ок, поехали!');
  var id = msg.from.id;
  var param = msg.data;
  var url;
  if (param && param === '2') {
    url = "http://yartr.ru/rasp.php?vt=1&nmar=78&q=1&id=424&view=2"
  }
  else if (param && param === '1') {
    url = "http://yartr.ru/rasp.php?vt=1&nmar=78&q=0&id=47&view=2"
  }
  else {
    url = `http://yartr.ru/rasp.php?vt=1&nmar=78&q=1&id=${param}&view=2`;
  }
  log.info('Начинаем обрабатывать сообщение от @', msg.from.first_name,' ', msg.from.last_name, '. ссылка: ', '"', url, '"');
  YartrResolve.resolveLink(url, bot, id,msg);
});


