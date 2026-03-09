function start(client){
    setInterval(() => {
        client.setStatus('Watching movies 🍿');
    }, 60*60*1000); // every 1 hour
}

module.exports = { start };
