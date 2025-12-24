import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required in .env file');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Telegram bot started...');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    `🎯 *PriceAnalyst Bot*\n\n` +
    `Привет! Я помогу отслеживать цены товаров.\n\n` +
    `*Команды:*\n` +
    `/add <product_id> <url> <price> — добавить товар\n` +
    `/list — показать отслеживаемые товары\n` +
    `/help — помощь`,
    { parse_mode: 'Markdown' }
  );
});

bot.onText(/\/add (.+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  const text = match[1];
  const parts = text.trim().split(/\s+/);
  
  if (parts.length < 3) {
    bot.sendMessage(chatId, 
      '❌ *Неверный формат*\n\n' +
      'Используй: `/add PRODUCT_ID URL PRICE`\n\n' +
      '*Пример:*\n`/add airpods123 https://wb.ru/12345 19990`',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  const [productId, url, priceStr] = parts;
  const price = parseInt(priceStr, 10);

  if (isNaN(price) || price <= 0) {
    bot.sendMessage(chatId, '❌ Цена должна быть числом больше 0');
    return;
  }

  try {
    await axios.post(`${backendUrl}/api/products/${productId}/${chatId}`, {
      name: `Товар из Telegram (${url})`,
      marketplace: url.includes('wildberries') ? 'Wildberries' : 
                  url.includes('ozon') ? 'Ozon' : 'Другой',
      price
    });

    bot.sendMessage(chatId, 
      `✅ *Товар добавлен!*\n\n` +
      `🆔 ID: \`${productId}\`\n` +
      `💰 Цена: ${price.toLocaleString('ru-RU')}₽\n` +
      `🔗 ${url}\n\n` +
      `Теперь проверяй цены командой /list`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Ошибка при добавлении товара. Попробуй позже.');
  }
});

bot.onText(/\/list/, async (msg) => {
  const chatId = msg.chat.id.toString();
  
  try {
    const response = await axios.get(`${backendUrl}/api/products/${chatId}`);
    const products = response.data;

    if (!products.length) {
      bot.sendMessage(chatId, '📭 У тебя пока нет отслеживаемых товаров.\n\nИспользуй /add чтобы начать!');
      return;
    }

    const message = products.map(p => 
      `🛍️ *${p.name}*\n` +
      `💰 ${p.current_price.toLocaleString('ru-RU')}₽ ` +
      `(${p.change_percent > 0 ? '📈' : '📉'}${p.change_percent.toFixed(1)}%)\n` +
      `🏪 ${p.marketplace}`
    ).join('\n\n');

    bot.sendMessage(chatId, `*Твои товары (${products.length}):*\n\n${message}`, { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true 
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Ошибка загрузки товаров');
  }
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `🎯 *PriceAnalyst Bot — Помощь*\n\n` +
    `/start — начать работу\n` +
    `/add <id> <url> <price> — добавить товар\n` +
    `/list — список товаров\n` +
    `/help — эта справка\n\n` +
    `*Пример добавления:*\n` +
    "`/add airpods https://www.wildberries.ru/catalog/12345/detail.aspx 19990`",
    { parse_mode: 'Markdown' }
  );
});
