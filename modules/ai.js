const { Configuration, OpenAIApi } = require("openai");
const config = require('../config');

const openai = new OpenAIApi(new Configuration({ apiKey: config.OPENAI_KEY }));

async function chat(query){
    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: query }]
    });
    return response.data.choices[0].message.content;
}

module.exports = { chat };
