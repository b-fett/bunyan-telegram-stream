'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _level_label;

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _telegramBotApi = require('telegram-bot-api');

var _telegramBotApi2 = _interopRequireDefault(_telegramBotApi);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var level_label = (_level_label = {}, _defineProperty(_level_label, _bunyan2.default.TRACE, 'TRACE'), _defineProperty(_level_label, _bunyan2.default.DEBUG, 'DEBUG'), _defineProperty(_level_label, _bunyan2.default.INFO, 'INFO'), _defineProperty(_level_label, _bunyan2.default.WARN, 'WARN'), _defineProperty(_level_label, _bunyan2.default.ERROR, 'ERROR'), _defineProperty(_level_label, _bunyan2.default.FATAL, 'FATAL'), _level_label);

var BunyanTelegramStream = function (_Writable) {
	_inherits(BunyanTelegramStream, _Writable);

	function BunyanTelegramStream(token, chat_id) {
		var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, BunyanTelegramStream);

		var _this = _possibleConstructorReturn(this, (BunyanTelegramStream.__proto__ || Object.getPrototypeOf(BunyanTelegramStream)).call(this));

		if ((typeof token === 'undefined' ? 'undefined' : _typeof(token)) === 'object') {
			_this.options = token;
		} else {
			_this.options = _extends({
				format: true,
				rest: true,
				formatTitle: BunyanTelegramStream._formatTitle,
				formatBody: BunyanTelegramStream._formatBody

			}, options, {

				token: token,
				chat_id: chat_id
			});
		}
		_this.telegram = new _telegramBotApi2.default({ token: _this.options.token });
		return _this;
	}

	_createClass(BunyanTelegramStream, [{
		key: 'write',
		value: function write(data) {
			var text = void 0;
			var _options = this.options,
			    chat_id = _options.chat_id,
			    formatTitle = _options.formatTitle,
			    formatBody = _options.formatBody;


			if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
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

			this.telegram.sendMessage({ chat_id: chat_id, text: text });
		}
	}], [{
		key: '_formatTitle',
		value: function _formatTitle(log) {
			return _util2.default.format('[%s] %s/%s on %s', level_label[log.level] || 'LVL' + log.level, log.name, log.pid, log.hostname);
		}
	}, {
		key: '_formatBody',
		value: function _formatBody(log, options) {
			var rows = [];
			var msg = log.msg,
			    err = log.err;

			var rest = _extends({}, log);

			['name', 'hostname', 'pid', 'time', 'msg', 'err', 'level', 'v'].forEach(function (e) {
				return delete rest[e];
			});
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
	}]);

	return BunyanTelegramStream;
}(_stream.Writable);

exports.default = BunyanTelegramStream;
