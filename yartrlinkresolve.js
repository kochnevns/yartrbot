'use strict';
const rp = require('request-promise');
const Entities = require('html-entities').XmlEntities;
const log = require('simple-node-logger').createSimpleFileLogger('project.log');

const entities = new Entities();

module.exports = {
	resolveLink: function resolveLink (url, bot,id, msg) {
		rp(url) // TODO: var cheerio = require('cheerio'); - jquery на ноде.
	    .then(function (htmlString) {
	      var parsedString = htmlString.slice(0, htmlString.indexOf('Расписание</a>'));
	      parsedString = entities.decode(parsedString);
	      parsedString = parsedString.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, "").replace('ody', '').replace('html', '');
	      parsedString = parsedString.split('<br/>');
	      parsedString.splice(-1);
	      parsedString.splice(0, 1);
	      parsedString = parsedString.filter((i) => i !== '');
	      var header = "         Расписание:\n\n🚌  ";
	      log.info("Отправляем расписание пользователю @",  msg.from.first_name,' ', msg.from.last_name);

	      bot.sendMessage(id,  header + parsedString.join('\n \t\t\n   🕐  ').replace('/[\s]/g', ' ').replace(/Ав/g, '            Автобус №').replace(/Тб/g, '            Троллейбус №'));
	    })
	    .catch(function (err) {
	      	throw err;
	    });
	}
}