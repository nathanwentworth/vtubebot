const config = require('./config.json');
const auth = require('./auth.json');
const loginToken = auth.token;
const { Client, GatewayIntentBits } = require(`discord.js`);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.on(`ready`, () => {
  console.log('vtube bot started');

});

client.on(`messageCreate`, (message) => {
  console.log('message');

  if (message.author.bot) return;

  let twitterUrls = message.content.match(/\b(https?:\/\/(mobile.)?twitter\.com\/[^\s]*\b)/g);
  if (twitterUrls && twitterUrls.length > 0) {
    message.suppressEmbeds(true);
    let newUrls = [];
    for (var i = 0; i < twitterUrls.length; i++) {
      let url = twitterUrls[i];
      let newUrl = '';
      newUrl = url.replace('mobile.', '');
      newUrl = newUrl.replace(/\?.*\b/g, '');
      newUrl = newUrl.replace('/twitter', `/${ config.prefix }twitter`);
      newUrls.push(newUrl);
    }
    message.channel.send({
      content: newUrls.join('\n')
    })
  }

})

client.login(loginToken);