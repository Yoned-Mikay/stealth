
import { isArray, isBuffer, isFunction, isObject                      } from '../../../base/index.mjs';
import { after, before, describe, finish                              } from '../../../covert/index.mjs';
import { Session                                                      } from '../../../stealth/source/client/Session.mjs';
import { URL                                                          } from '../../../stealth/source/parser/URL.mjs';
import { ENVIRONMENT                                                  } from '../../../stealth/source/ENVIRONMENT.mjs';
import { connect as connect_stealth, disconnect as disconnect_stealth } from '../Stealth.mjs';
import { connect as connect_client, disconnect as disconnect_client   } from '../Client.mjs';



before(connect_stealth);
before(connect_client);

describe('new Session()', function(assert) {

	assert(this.client.services.session instanceof Session, true);

});

describe('Session.prototype.download()/failure', function(assert) {

	assert(this.client !== null);
	assert(isFunction(this.client.services.session.download), true);

	this.client.services.session.download(URL.parse('https://example.com/index.html'), (response) => {
		assert(response, null);
	});

});

describe('Mode.prototype.save()/success', function(assert) {

	assert(this.client !== null);
	assert(isFunction(this.client.services.mode.save), true);

	this.client.services.mode.save({
		domain: 'example.com',
		mode: {
			text:  true,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	}, (response) => {
		assert(response, true);
	});

});

describe('Session.prototype.download()/success', function(assert) {

	assert(this.client !== null);
	assert(isFunction(this.client.services.session.download), true);

	this.client.services.session.download(URL.parse('https://example.com/index.html'), (response) => {

		assert(response !== null);
		assert(response.headers !== null);
		assert(response.payload !== null);

		assert(isBuffer(response.payload), true);
		assert(response.payload.toString('utf8').includes('<html>'));
		assert(response.payload.toString('utf8').includes('<title>Example Domain</title>'));
		assert(response.payload.toString('utf8').includes('</html>'));

	});

});

describe('Session.prototype.query()/all', function(assert) {

	assert(this.client !== null);
	assert(isFunction(this.client.services.session.query), true);

	this.client.services.session.query({
		domain: '*'
	}, (response) => {

		assert(isArray(response), true);
		assert(response.length,   1);

		assert(response, [{
			type: 'Session',
			data: {
				agent:   null,
				domain:  ENVIRONMENT.hostname,
				tabs:    [],
				warning: 0
			}
		}]);

	});

});

describe('Session.prototype.query()/domain/success', function(assert) {

	assert(this.client !== null);
	assert(isFunction(this.client.services.session.query), true);

	this.client.services.session.query({
		domain: ENVIRONMENT.hostname
	}, (response) => {

		assert(isArray(response), true);
		assert(response.length,   1);

		assert(response, [{
			type: 'Session',
			data: {
				agent:   null,
				domain:  ENVIRONMENT.hostname,
				tabs:    [],
				warning: 0
			}
		}]);

	});

});

describe('Session.prototype.query()/domain/failure', function(assert) {

	assert(this.client !== null);
	assert(isFunction(this.client.services.session.query), true);

	this.client.services.session.query({
		domain: 'does-not-exist'
	}, (response) => {

		assert(isArray(response), true);
		assert(response.length,   0);

	});

});


describe('Session.prototype.read()', function(assert) {

	assert(this.client !== null);
	assert(isFunction(this.client.services.session.read), true);

	this.client.services.session.read({}, (response) => {

		assert(response !== null);
		assert(isObject(response), true);

		assert(response.type, 'Session');
		assert(response.data, {
			agent:   null,
			domain:  ENVIRONMENT.hostname,
			tabs:    [],
			warning: 0
		});

	});

});

after(disconnect_client);
after(disconnect_stealth);


export default finish('stealth/client/Session', {
	internet: true
});

