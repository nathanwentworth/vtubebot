const config = require('./config.json');
const auth = require('./auth.js');
const loginToken = auth.token;
const Discord = require(`discord.js`);
const client = new Discord.Client();

client.on(`ready`, () => {
  console.log('vtube bot started');
});

client.on(`message`, (message) => {
  console.log('message');

  if (message.author.bot) return;

  let twitterUrls = message.content.match(/\b(https?:\/\/.*?\.[a-z]{2,4}\/[^\s]*\b)/g);
  if (twitterUrls.length > 0) {
    message.suppressEmbeds(true);
    let newUrls = [];
    for (var i = 0; i < twitterUrls.length; i++) {
      let url = twitterUrls[i];
      newUrl = url.replace('/twitter', `/${ config.prefix }twitter`);
      newUrls.push(newUrl);
    }
    message.channel.send({
      content: newUrls.join('\n');
    })
  }

})
