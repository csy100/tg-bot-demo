import { Bot } from "grammy";
import { HttpsProxyAgent } from "https-proxy-agent";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

// 配置代理
const proxyUrl = process.env.NET_PROXY || "socks5://127.0.0.1:10808";
const botConfig: any = {};

// 只有在代理URL不为空时才使用代理
if (proxyUrl && proxyUrl.trim() !== "") {
  botConfig.client = {
    baseFetchConfig: {
      agent: new HttpsProxyAgent(proxyUrl),
    },
  };
}

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  throw new Error("BOT_TOKEN 环境变量未设置");
}

const bot = new Bot(botToken, botConfig);

// 添加调试信息
bot.command("start", (ctx) => {
  console.log("收到 /start 命令");
  return ctx.reply("Welcome! Up and running.");
});

bot.on("message", (ctx) => {
  console.log("收到消息:", ctx.message?.text);
  return ctx.reply("Got another message!");
});

// 添加错误处理
bot.catch((err) => {
  console.error("Bot 错误:", err);
});

console.log("Bot 正在启动...");
bot.start();
console.log("Bot 已启动，正在监听消息...");