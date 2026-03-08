
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import pino from 'pino'
import axios from 'axios'
import ytdl from 'ytdl-core'
import { BOT_NAME } from './config.js'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) startBot()
    } else if (connection === 'open') {
      console.log(BOT_NAME + " connected")
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ""
    const from = m.key.remoteJid

    if (text === ".menu") {
      const menu = `
╔═══ ${BOT_NAME} MENU
║ .menu
║ .ai <question>
║ .song <youtube link>
║ .ping
╚══════════`
      await sock.sendMessage(from, { text: menu })
    }

    if (text.startsWith(".ping")) {
      await sock.sendMessage(from, { text: "Bot Online ✅" })
    }

    if (text.startsWith(".ai ")) {
      const q = text.replace(".ai ", "")
      try {
        const res = await axios.get("https://api.popcat.xyz/chatbot?msg=" + encodeURIComponent(q) + "&owner=Bot&botname=" + BOT_NAME)
        await sock.sendMessage(from, { text: res.data.response })
      } catch {
        await sock.sendMessage(from, { text: "AI error" })
      }
    }

    if (text.startsWith(".song ")) {
      const url = text.replace(".song ", "")
      try {
        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title
        await sock.sendMessage(from, { text: "Song found: " + title })
      } catch {
        await sock.sendMessage(from, { text: "Download error" })
      }
    }
  })
}

startBot()
