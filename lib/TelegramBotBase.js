'use strict';
const TelegramBot = require('node-telegram-bot-api');

module.exports = {
TelegramBotBase: class TelegramBotBase {
  constructor(token) {
    var self = this;
    self.bot = new TelegramBot(token, { polling: true });
    self.bot.on('location', self.onLocation );
    self.bot.on('callback_query', self.onCallbackQuery)
  }
  onLocation() {
    throw new Error('Функция на локейшн не назначена')
  }
  onCallbackQuery() {
    throw new Error('Функция на калбек квери не назначена')
  }
}
}
