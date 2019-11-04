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

  async finish(bot, event, context) {
    await bot.reply({
      type: 'text',
      text: `あいよっ。じゃあ${context.confirmed.searchRanking}を表示しますわ。おおきに。`,
    });
  }

};