require('dotenv').config();
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fun = require('./modules/fun');
const ai = require('./modules/ai');
const downloader = require('./modules/downloader');
const status = require('./modules/status');

const SESSION_FILE_PATH = './session/session.json';
let sessionData;

if(fs.existsSync(SESSION_FILE_PATH)){
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({ session: sessionData });

client.on('qr', qr => {
    console.log('Scan this QR or use number→pair code method');
    qrcode.generate(qr, {small:true});
});

client.on('ready', () => {
    console.log(`${process.env.BOT_NAME} is ready!`);
    status.start(client); // auto status updater
});

client.on('message', async msg => {
    const text = msg.body;
    
    // Fun / hack commands
    if(text.startsWith('.hack')){
        let user = text.split(' ')[1] || 'target';
        msg.reply(fun.hackPrank(user));
    }

    // AI chat
    else if(text.startsWith('.chat')){
        let query = text.slice(6);
        let reply = await ai.chat(query);
        msg.reply(reply);
    }

    // Movie info
    else if(text.startsWith('.movie')){
        let movieName = text.slice(7);
        let info = await downloader.getMovieInfo(movieName);
        msg.reply(info);
    }
});

client.initialize();
