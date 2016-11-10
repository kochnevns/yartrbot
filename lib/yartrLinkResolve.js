'use strict';
const rp = require('request-promise');
const Entities = require('html-entities').XmlEntities;
const log = require('simple-node-logger').createSimpleFileLogger('./../project.log');


const entities = new Entities();

module.exports = {
	resolveLink: function resolveLink (url, bot,id, msg) {
		rp(url) // TODO: var cheerio = require('cheerio'); - jquery на ноде.
	    .then(function (htmlString) {
	      var parsedString = entities.decode(htmlString);
	      var tenSpaces = "          ";
	      parsedString = parsedString.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, ""); //remove tags
	      parsedString = parsedString.split('<br/>');
	      parsedString.splice(-1); //remove stuff
	      parsedString.splice(0, 1); //remove stuff
	      parsedString = parsedString.filter((i) => i !== ''); // remove empty stuff
	      var header = "Расписание:\n\n🚌  ";
	      var resultMsg = parsedString.join('\n\t\t\n   🕐  ').replace(/Ав/g, `${tenSpaces}Автобус №`).replace(/Тб/g, `${tenSpaces}Троллейбус №`);
	      log.info("Отправляем расписание пользователю @",  msg.from.first_name,' ', msg.from.last_name);

	      bot.sendMessage(id,  header + resultMsg);
	    })
	    .catch(function (err) {
	      	throw err;
	    });
	}
}