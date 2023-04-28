const { data } = require("./data/movie_link");

const TelegramBot = require("node-telegram-bot-api");

const token = "6032128770:AAE6EkjAgWjGbXlOCFA8-wUU-6boHICo1tc";

const bot = new TelegramBot(token, { polling: true });
console.log("bot is running..");

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "/start") {
    const _m = `Hello, ${msg.from.first_name}!, welcome to mverse bot which movie you want to see now ?`;
    bot.sendMessage(chatId, _m);
  } else {
    const items = data.filter((obj) => obj.name.includes(msg.text));
    if (items.length) {
      const keyboard = {
        inline_keyboard: items.map((option) => [
          {
            text: `${option.name} - [${option.year}] - [${option.resolution}] - [${option.size}]`,
            callback_data: option.id,
          },
        ]),
      };
      bot.sendMessage(chatId, "please select an option :", {
        reply_markup: keyboard,
      });
    } else {
      bot.sendMessage(
        chatId,
        "nothing found, try to enter a movie name with accuracy."
      );
    }
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const option = data.find((obj) => obj.id == query.data);
  try {
    const b = "https://image.tmdb.org/t/p/w300/kuf6dutpsT0vSVehic3EZIqkOBt.jpg";
    const s =
      "https://res.cloudinary.com/shivraj-technology/video/upload/v1658042880/bvypefdlx6smjiwemqwb.mp4";
    const opts = {
      supports_streaming: true,
    };
    const encodedVideoUrl = encodeURI(option.href);
    await bot.sendVideo(chatId, encodedVideoUrl, opts);
    /* code */
  } catch (e) {
    bot.sendMessage(
      chatId,
      "Download : <a href='" +
        option.href +
        "'>Download or watch in web browser</a>",
      {
        parse_mode: "HTML",
      }
    );
  }
});
