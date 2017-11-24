import bunyan from 'bunyan';
import Telegram from 'telegram-bot-api';
import util from 'util';
import { Writable } from 'stream';

const level_label = {
	[bunyan.TRACE]: 'TRACE',
	[bunyan.DEBUG]: 'DEBUG',
	[bunyan.INFO]: 'INFO',
	[bunyan.WARN]: 'WARN',
	[bunyan.ERROR]: 'ERROR',
	[bunyan.FATAL]: 'FATAL',
};

export default class BunyanTelegramStream extends Writable {

	constructor (token, chat_id, options = {}) {
		super();
		if (typeof token === 'object') {
			this.options = token;
		} else {
			this.options = {
				format: true,
				rest: true,
				formatTitle: BunyanTelegramStream._formatTitle,
				formatBody: BunyanTelegramStream._formatBody,

				...options,

				token,
				chat_id,
			};
		}
		this.telegram = new Telegram({ token: this.options.token });
	}

	static _formatTitle (log) {
		return util.format(
			'[%s] %s/%s on %s',
			level_label[log.level] || 'LVL' + log.level,
			log.name,
			log.pid,
			log.hostname,
		);
	}

	static _formatBody (log, options) {
		const rows = [];
		const { msg, err } = log;
		const rest = { ...log };

		['name', 'hostname', 'pid', 'time', 'msg', 'err', 'level', 'v'].forEach(e => delete(rest[e]));
		if (msg) {
			rows.push('* msg: \n' + msg);
		}

		if (err) {
			rows.push('* err.stack: ' + err.stack);
		}

		if (options.rest && Object.keys(rest).length) {
			rows.push(JSON.stringify(rest));
		}

		return rows.join('\n');
	}


	write (data) {
		let text;
		const {
			chat_id,
			formatTitle,
			formatBody,
		} = this.options;

		if (typeof data === 'object') {
			// raw data passed
			if (this.options.format) {
				text = formatTitle(data) + '\n' + formatBody(data, this.options);
			} else {
				text = JSON.stringify(data);
			}
		} else {
			// regular log text
			text = data;
		}

		this.telegram
			.sendMessage({ chat_id, text });
	}
}
