const axios = require('axios');
axios
  .get('https://anicloud.io/anime/stream/toradora/staffel-1/episode-8')
  .then((res) => {
    console.log(res.data);
  });
