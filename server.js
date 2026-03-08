
import express from "express"
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import P from "pino"

const app = express()
const PORT = process.env.PORT || 3000

let sock

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    if(update.connection === "open"){
      console.log("AASHIF-MD Bot Connected")
    }
  })
}

startSock()

app.get("/", (req,res)=>{
res.send(`
<h2>AASHIF-MD Pairing</h2>
<form action="/pair">
<input name="number" placeholder="Enter WhatsApp number with country code"/>
<button type="submit">Get Pair Code</button>
</form>
`)
})

app.get("/pair", async (req,res)=>{
  const number = req.query.number

  if(!number) return res.send("Enter number")

  try{
    const code = await sock.requestPairingCode(number)
    res.send("Your Pair Code: " + code)
  }catch(e){
    res.send("Error generating code")
  }
})

app.listen(PORT, ()=>{
console.log("Server running on port " + PORT)
})
