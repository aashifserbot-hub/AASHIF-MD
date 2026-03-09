require('dotenv').config();
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const funbot = require('./modules/funbot');

let sessionData;
const SESSION_FILE_PATH = './session/session.json';
if(fs.existsSync(SESSION_FILE_PATH)) sessionData = require(SESSION_FILE_PATH);

const client = new Client({ session: sessionData });

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => console.log(`${process.env.BOT_NAME} is ready!`));

client.on('message', msg => {
    funbot.handleMessage(client, msg);
});

client.initialize();
