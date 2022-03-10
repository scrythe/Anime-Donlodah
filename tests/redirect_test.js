const axios = require('axios');

(async () => {
  const res = await axios({
    url: '/get_video?id=wYbk842YRYSJOMq&expires=1646994570&ip=F0yQKRWPES9XKxR&token=_W3njgoK5brZ',
    method: 'get',
    baseURL: 'https://streamtape.com/',
    maxRedirect: 0,
  });
  console.log(res.request);
})();
