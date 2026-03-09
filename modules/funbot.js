const axios = require('axios');

module.exports.handleMessage = async (client, msg) => {
    const text = msg.body.slice(1).trim(); // remove prefix
    if(text.toLowerCase() === 'hi'){
        msg.reply(`Hello! I am ${process.env.BOT_NAME}. How can I help you today?`);
    }
    // GPT friendly chat simulation
    else {
        try {
            let reply = await axios.post('https://api.example.com/gpt', {prompt: text});
            msg.reply(reply.data.response);
        } catch(e) {
            msg.reply("Sorry, something went wrong!");
        }
    }
};
