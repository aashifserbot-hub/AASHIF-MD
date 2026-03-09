const fetch = require('node-fetch');

async function getMovieInfo(name){
    let url = `http://www.omdbapi.com/?t=${encodeURIComponent(name)}&apikey=${process.env.OMDB_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    if(data.Response === 'False') return 'Movie not found';
    return `🎬 ${data.Title} (${data.Year})\n⭐ IMDB: ${data.imdbRating}\n📖 Plot: ${data.Plot}`;
}

module.exports = { getMovieInfo };
