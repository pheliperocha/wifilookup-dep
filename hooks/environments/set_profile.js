var replace = require("replace");
var fs = require('fs-extra');
var path = require('path');

try {
  require('dotenv').config();
} catch(err) {
  console.trace('Error on require dotenv');
  console.error(err);
}

var profile = process.env.ENV ? process.env.ENV : 'local';

console.log('Moving the configuration detection file template...');
fs.copySync(path.resolve(__dirname, './app.config.ts.tpl'), path.resolve(__dirname, '../../src/app/app.config.ts'));

console.log('Profile application: ' + profile);

replace({
    regex: "'PROFILE'",
    replacement: "'" + profile + "'",
    paths: ['src/app/app.config.ts'],
    recursive: true,
    silent: true,
});
