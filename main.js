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

let newUrls = [];
let messageContent = '';

client.on(`messageCreate`, (message) => {

  if (message.author.bot) return;
  let hasEmbeds = messageHasEmbed(message.embeds);
  
  console.log('message, has embeds?', hasEmbeds, JSON.stringify(message.embeds));

  // if (message.embeds.length > 0 && !hasEmbeds) {
  //   return;
  // }


  newUrls = [];
  messageContent = message.content;

  let hiddenEmbeds = messageContent.match(/\<\b(https?:\/\/(mobile.)?twitter\.com\/[^\s]*\b)\>/g);
  if (hiddenEmbeds && hiddenEmbeds.length > 0) {
    for (var i = 0; i < hiddenEmbeds.length; i++) {
      messageContent = messageContent.replace(hiddenEmbeds[i], '');
    }
    
  }

  let spoiledTwitterUrls = messageContent.match(/\|\| *\b(https?:\/\/(mobile.)?twitter\.com\/[^\s]*\b) *\|\|/g);
  if (spoiledTwitterUrls && spoiledTwitterUrls.length > 0) {
    message.suppressEmbeds(true);
    processUrls(spoiledTwitterUrls);
    setTimeout(() => { message.suppressEmbeds(true); }, 2500);
  }

  let twitterUrls = messageContent.match(/\b(https?:\/\/(mobile.)?twitter\.com\/[^\s]*\b)/g);
  if (twitterUrls && twitterUrls.length > 0) {
    console.log('embeds', JSON.stringify(message.embeds));
    message.suppressEmbeds(true);
    processUrls(twitterUrls);
    setTimeout(() => { message.suppressEmbeds(true); }, 2500);
    
  }

  if (newUrls.length > 0) {
    message.channel.send({
      content: newUrls.join('\n')
    });
  }


})

function processUrls(urls) {
  for (var i = 0; i < urls.length; i++) {
    let url = urls[i];
    let newUrl = '';
    messageContent = messageContent.replace(url, '');
    newUrl = url.replace('mobile.', '');
    newUrl = newUrl.replace(/\?.*\b/g, '');
    newUrl = newUrl.replace('/twitter', `/${ config.prefix }twitter`);
    newUrls.push(newUrl);
  }

}

function messageHasEmbed(embeds) {
  for (var i = 0; i < embeds.length; i++) {
    let item = embeds[i];
    if (item.image || item.video) {
      return true;
    }
  }
  return false;
}

client.on('messageDelete', (message) => {
  
})

// hopefully fixes the issue with tweets showing the embed anyway
// from https://github.com/discord/discord-api-docs/issues/4442
client.on('messageUpdate', (oldMessage, newMessage) => {
  if (
    newMessage.embeds.length > 0 &&
    newMessage.flags.has(MessageFlags.FLAGS.SUPPRESS_EMBEDS)
  ) {
    newMessage.suppressEmbeds(true).catch(() => {});
  }
})

client.login(loginToken);