const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

// ====== CONFIG ======
const SESSION_ID = "PASTE_YOUR_SESSION_ID"; // 🔴 replace this
const AUTH_FOLDER = './auth';

// ====== STEP 1: CREATE AUTH FOLDER ======
if (!fs.existsSync(AUTH_FOLDER)) {
    fs.mkdirSync(AUTH_FOLDER);
}

// ====== STEP 2: CONVERT SESSION ID ======
function convertSession() {
    try {
        if (SESSION_ID && SESSION_ID !== "PASTE_YOUR_SESSION_ID") {
            const decoded = Buffer.from(SESSION_ID, 'base64').toString('utf-8');

            fs.writeFileSync(path.join(AUTH_FOLDER, 'creds.json'), decoded);
            console.log("✅ Session converted to creds.json");
        }
    } catch (err) {
        console.log("❌ Session convert failed:", err.message);
    }
}

// ====== MAIN BOT ======
async function startBot() {
    convertSession();

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log("🤖 Bot Connected Successfully!");
        }

        if (connection === 'close') {
            console.log("❌ Connection closed, reconnecting...");
            startBot();
        }
    });

    // ====== SIMPLE COMMAND SYSTEM ======
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const from = msg.key.remoteJid;

        if (!text) return;

        console.log("📩 Message:", text);

        // Command: .ping
        if (text === '.ping') {
            await sock.sendMessage(from, { text: '🏓 Pong!' });
        }

        // Command: .alive
        if (text === '.alive') {
            await sock.sendMessage(from, { text: '✅ Bot is alive!' });
        }
    });
}

// ====== START ======
startBot();
