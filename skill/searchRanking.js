module.exports = class SkillHandleDeliveryOrder {

  constructor() {
    this.required_parameter = {
      searchRanking: {
        message_to_confirm: {
          type: 'template',
          altText: 'どのプラットフォームのランキングを確認しますか？',
          template: {
            type: 'buttons',
            text: '確認したいプラットフォームは？',
            actions: [
              { type: 'message', label: 'Apple', text: 'Apple' },
              { type: 'message', label: 'Google', text: 'Google' },
            ],
          },
        },
        parser: async (value, bot, event, context) => {
          if (['Apple', 'Google'].includes(value)) {
            return value;
          }

          throw new Error();
        },
        reaction: async (error, value, bot, event, context) => {
          if (error) return;

          bot.queue({
            type: 'text',
            text: `あいよっ！${value}ね。`,
          });
        },
      },
    };
  }
  const https = require('https');
  const URL = 'https://itunes.apple.com/jp/rss/topgrossingapplications/limit=100/json';

  https.get(URL, function (res) {
      let body = '';
      res.setEncoding('utf8');
      res.on('date',function (chunk) {
          body += chunk;
      });
      res.on('date',function (chunk) {
          res = JSON.parse(body);
          console.log(res.entry.im:name.label);
          
        })
  }).on('error', function(e){
      console.log(e.message);
  });
  
  async finish(bot, event, context) {
    await bot.reply({
      type: 'text',
      text: `あいよっ。じゃあ${context.confirmed.searchRanking}を表示しますわ。おおきに。`,
    });
  }

};