export interface Env {
  BOT_TOKEN: string;
  REQUIRED_CHANNEL: string;
  USER_DATA: KVNamespace;
}

// قنوات إجبارية
const REQUIRED_CHANNEL = "BlackArsenalStore";
const REQUIRED_CHANNEL_LINK = "https://t.me/BlackArsenalStore";

// أرقام عشوائية للكابتشا (مؤقتة)
const captchaStore: Record<number, { question: string, answer: number, timestamp: number }> = {};

// منتجات Free Fire
const freefireProducts = [
  { id: 'ff_100', name: '🔥 100 دايموند', price: '$1.5', diamonds: 100 },
  { id: 'ff_200', name: '🔥 200 دايموند', price: '$2.8', diamonds: 200 },
  { id: 'ff_500', name: '🔥 500 دايموند', price: '$6.5', diamonds: 500 },
  { id: 'ff_1000', name: '🔥 1000 دايموند', price: '$12', diamonds: 1000 },
  { id: 'ff_2000', name: '🔥 2000 دايموند', price: '$22', diamonds: 2000 },
  { id: 'ff_5000', name: '🔥 5000 دايموند', price: '$50', diamonds: 5000 },
  { id: 'ff_account', name: '🎮 حساب فري فاير (ليفل عالي)', price: '$30 - $150' },
  { id: 'ff_topup', name: '💎 شحن رصيد فري فاير', price: 'حسب الطلب' }
];

// منتجات FC Mobile
const fcProducts = [
  { id: 'fc_coins_1m', name: '⚽ 1 مليون كوين', price: '$5', coins: 1000000 },
  { id: 'fc_coins_5m', name: '⚽ 5 مليون كوين', price: '$22', coins: 5000000 },
  { id: 'fc_coins_10m', name: '⚽ 10 مليون كوين', price: '$40', coins: 10000000 },
  { id: 'fc_account', name: '🎮 حساب FC Mobile (قوي)', price: '$25 - $100' },
  { id: 'fc_points', name: '⭐ نقاط FC Mobile', price: '$10 - $200' }
];

// قائمة الأدوات
const tools = [
  { id: 'phoneinfoga', name: '📞 جمع معلومات رقم هاتف', price: 'FREE', link: 'https://github.com/sundowndev/phoneinfoga' },
  { id: 'email_osint', name: '📧 جمع معلومات إيميل', price: 'FREE', link: 'https://github.com/ilyassR171194/black-arsenal-bot' },
  { id: 'instagram_hack', name: '📸 اختراق انستا', price: '$20', link: null },
  { id: 'camera_hack', name: '📷 اختراق كاميرا', price: '$30', link: null },
  { id: 'phone_hack', name: '📱 اختراق هواتف', price: '$50', link: null },
  { id: 'termux_tools', name: '💻 تيرمكس فيد', price: 'FREE', link: 'https://github.com/ilyassR171194' }
];

// واجهات الكيبورد
const mainKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '🛒 المنتجات' }, { text: '🏆 العروض' }],
      [{ text: '📊 التطبيقات' }, { text: '💱 تحويل عملة' }],
      [{ text: '💰 شراء رصيد' }, { text: '🎁 كود هدية' }],
      [{ text: 'ℹ️ معلوماتي' }]
    ],
    resize_keyboard: true
  }
};

const productsKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🔥 فري فاير', callback_data: 'cat_freefire' }],
      [{ text: '⚽ FC Mobile', callback_data: 'cat_fc' }],
      [{ text: '🛠️ أدوات', callback_data: 'cat_tools' }],
      [{ text: '🔙 رجوع', callback_data: 'back_main' }]
    ]
  }
};

const freefireKeyboard = {
  reply_markup: {
    inline_keyboard: freefireProducts.map(p => ([
      { text: p.name, callback_data: `prod_ff_${p.id}` }
    ])).concat([[{ text: '🔙 رجوع', callback_data: 'back_products' }]])
  }
};

const fcKeyboard = {
  reply_markup: {
    inline_keyboard: fcProducts.map(p => ([
      { text: p.name, callback_data: `prod_fc_${p.id}` }
    ])).concat([[{ text: '🔙 رجوع', callback_data: 'back_products' }]])
  }
};

const toolsKeyboard = {
  reply_markup: {
    inline_keyboard: tools.map(t => ([
      { text: t.name, callback_data: `tool_${t.id}` }
    ])).concat([[{ text: '🔙 رجوع', callback_data: 'back_products' }]])
  }
};

const appsKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '📱 تطبيقات مجانية', callback_data: 'apps_free' }],
      [{ text: '💰 تطبيقات مدفوعة', callback_data: 'apps_paid' }],
      [{ text: '🔙 رجوع', callback_data: 'back_main' }]
    ]
  }
};

const infoKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🎁 هدية يومية', callback_data: 'daily_gift' }],
      [{ text: '👥 رابط الإحالة', callback_data: 'referral' }],
      [{ text: '👤 حسابي', callback_data: 'my_account' }],
      [{ text: '📢 الشكوى', callback_data: 'complaint' }],
      [{ text: '🔙 رجوع', callback_data: 'back_main' }]
    ]
  }
};

// دوال مساعدة لـ KV
async function getUserData(chatId: number, env: Env) {
  const data = await env.USER_DATA.get(`user_${chatId}`, 'json');
  if (data) return data as any;
  return {
    balance: 0,
    joinedChannel: false,
    captchaPassed: false,
    referralCode: Math.random().toString(36).substring(2, 8),
    dailyClaimed: ''
  };
}

async function saveUserData(chatId: number, data: any, env: Env) {
  await env.USER_DATA.put(`user_${chatId}`, JSON.stringify(data));
}

// دالة التحقق من الاشتراك في القناة
async function checkChannelMembership(userId: number, botToken: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=@${REQUIRED_CHANNEL}&user_id=${userId}`);
    const data = await response.json() as any;
    if (data.ok && data.result) {
      const status = data.result.status;
      return ['member', 'administrator', 'creator'].includes(status);
    }
    return false;
  } catch {
    return false;
  }
}

// دالة إنشاء كابتشا
function generateCaptcha(chatId: number): { question: string, answer: number } {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = num1 + num2;
  const question = `${num1} + ${num2} = ?`;
  captchaStore[chatId] = { question, answer, timestamp: Date.now() };
  return { question, answer };
}

// دالة إرسال الرسائل
async function sendMessage(chatId: number, text: string, botToken: string, keyboard?: any) {
  const body: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };
  if (keyboard) {
    body.reply_markup = keyboard.reply_markup;
  }
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/webhook' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        
        if (body.message) {
          const chatId = body.message.chat.id;
          const text = body.message.text;
          const username = body.message.from?.username || 'مستخدم';
          
          // التحقق من الاشتراك في القناة
          const isMember = await checkChannelMembership(chatId, env.BOT_TOKEN);
          if (!isMember) {
            await sendMessage(chatId, `🔒 *الاشتراك إجباري*\n\nيرجى الاشتراك في قناتنا أولاً:\n${REQUIRED_CHANNEL_LINK}\n\nثم أعد إرسال /start`, env.BOT_TOKEN);
            return new Response('OK');
          }
          
          // جلب بيانات المستخدم من KV
          let user = await getUserData(chatId, env);
          
          // التحقق من الكابتشا
          if (!user.captchaPassed && text !== '/start') {
            if (captchaStore[chatId] && text === captchaStore[chatId].answer.toString()) {
              user.captchaPassed = true;
              await saveUserData(chatId, user, env);
              delete captchaStore[chatId];
              await sendMessage(chatId, '✅ تم التحقق بنجاح! أهلاً بك.\n\nأرسل /start للبدء.', env.BOT_TOKEN);
            } else if (captchaStore[chatId] && Date.now() - captchaStore[chatId].timestamp > 300000) {
              const newCaptcha = generateCaptcha(chatId);
              await sendMessage(chatId, `⏰ انتهت صلاحية الكابتشا. أعد المحاولة:\n\nحل: ${newCaptcha.question}`, env.BOT_TOKEN);
            } else if (!captchaStore[chatId]) {
              const captcha = generateCaptcha(chatId);
              await sendMessage(chatId, `🛡️ *تحقق أمني*\n\nللتحقق من أنك لست روبوت، أجب على السؤال التالي:\n\n${captcha.question}`, env.BOT_TOKEN);
            }
            return new Response('OK');
          }
          
          // معالجة الأوامر
          if (text === '/start') {
            if (!user.captchaPassed) {
              const captcha = generateCaptcha(chatId);
              await sendMessage(chatId, `🌟 *مرحباً بك في Black Ilyass* 🌟\n\nالمتجر الأقوى والأرخص\nكل ما تحتاج بمكان واحد\nالثقة والأمان هدفنا 😊\n\n🛡️ *تحقق أمني:*\n${captcha.question}`, env.BOT_TOKEN);
            } else {
              await sendMessage(chatId, `🎉 *أهلاً وسهلاً* ${username}!\n\nشكراً لاختيار Black Ilyass 😊\nنتمنى لك وقتاً ممتعاً 😍\n\nرصيدك الحالي: $${user.balance.toFixed(2)}`, env.BOT_TOKEN, mainKeyboard);
            }
          }
          else if (text === '🛒 المنتجات') {
            await sendMessage(chatId, '📦 *اختر القسم:*', env.BOT_TOKEN, productsKeyboard);
          }
          else if (text === '🏆 العروض') {
            await sendMessage(chatId, '🏆 *العروض الحالية:*\n\n🔥 خصم 20% على جميع منتجات فري فاير\n⚽ عرض FC Mobile: 5 مليون كوين بـ $20\n🎁 كود هدية: WELCOME10 للحصول على 10% خصم', env.BOT_TOKEN);
          }
          else if (text === '📊 التطبيقات') {
            await sendMessage(chatId, '📱 *اختر نوع التطبيقات:*', env.BOT_TOKEN, appsKeyboard);
          }
          else if (text === '💱 تحويل عملة') {
            await sendMessage(chatId, '💱 *تحويل العملة*\n\n1 USD = 0.92 EUR\nللتحويل الفعلي، تواصل مع الدعم.', env.BOT_TOKEN);
          }
          else if (text === '💰 شراء رصيد') {
            await sendMessage(chatId, '💰 *شراء رصيد*\n\nللشراء، تواصل مع الدعم:\n@BlackArsenalSupport', env.BOT_TOKEN);
          }
          else if (text === '🎁 كود هدية') {
            await sendMessage(chatId, '🎁 *أدخل كود الهدية:*\n\nأرسل الكود الآن.', env.BOT_TOKEN);
          }
          else if (text === 'ℹ️ معلوماتي') {
            await sendMessage(chatId, `👤 *معلومات حسابك*\n\n🆔 المعرف: ${chatId}\n👤 اسم المستخدم: @${username}\n💰 الرصيد: $${user.balance.toFixed(2)}\n🔗 رابط الإحالة: \`https://t.me/${env.BOT_TOKEN.split(':')[0]}?start=${user.referralCode}\``, env.BOT_TOKEN, infoKeyboard);
          }
          else if (text && text.startsWith('GIFT-')) {
            if (text === 'GIFT-WELCOME10') {
              user.balance += 10;
              await saveUserData(chatId, user, env);
              await sendMessage(chatId, `🎉 تم تفعيل الكود! رصيدك الآن: $${user.balance.toFixed(2)}`, env.BOT_TOKEN);
            } else {
              await sendMessage(chatId, '❌ كود هدية غير صالح.', env.BOT_TOKEN);
            }
          }
          else {
            await sendMessage(chatId, '❓ خيار غير معروف. استخدم الأزرار.', env.BOT_TOKEN);
          }
        }
        
        // معالجة الأزرار
        if (body.callback_query) {
          const chatId = body.callback_query.message.chat.id;
          const data = body.callback_query.data;
          let user = await getUserData(chatId, env);
          
          if (data === 'back_main') {
            await sendMessage(chatId, '🏠 *القائمة الرئيسية:*', env.BOT_TOKEN, mainKeyboard);
          }
          else if (data === 'back_products') {
            await sendMessage(chatId, '📦 *اختر القسم:*', env.BOT_TOKEN, productsKeyboard);
          }
          else if (data === 'cat_freefire') {
            await sendMessage(chatId, '🔥 *منتجات فري فاير:*', env.BOT_TOKEN, freefireKeyboard);
          }
          else if (data === 'cat_fc') {
            await sendMessage(chatId, '⚽ *منتجات FC Mobile:*', env.BOT_TOKEN, fcKeyboard);
          }
          else if (data === 'cat_tools') {
            await sendMessage(chatId, '🛠️ *الأدوات:*', env.BOT_TOKEN, toolsKeyboard);
          }
          else if (data === 'apps_free') {
            let msg = `📱 *تطبيقات مجانية:*\n\n`;
            for (const tool of tools) {
              if (tool.price === 'FREE' && tool.link) {
                msg += `🔧 *${tool.name}*\n${tool.link}\n\n`;
              }
            }
            msg += `🔗 *جميع مشاريعي:*\nhttps://github.com/ilyassR171194`;
            await sendMessage(chatId, msg, env.BOT_TOKEN);
          }
          else if (data === 'apps_paid') {
            await sendMessage(chatId, '💰 *تطبيقات مدفوعة:*\n\nللشراء، تواصل مع الدعم.\n@BlackArsenalSupport', env.BOT_TOKEN);
          }
          else if (data === 'daily_gift') {
            const today = new Date().toDateString();
            if (user.dailyClaimed === today) {
              await sendMessage(chatId, '🎁 لقد حصلت على هديتك اليوم بالفعل! عد غداً.', env.BOT_TOKEN);
            } else {
              user.balance += 0.05;
              user.dailyClaimed = today;
              await saveUserData(chatId, user, env);
              await sendMessage(chatId, `🎁 *مبروك!*\n\nلقد ربحت $0.05 هدية يومية\nرصيدك الآن: $${user.balance.toFixed(2)}`, env.BOT_TOKEN);
            }
          }
          else if (data === 'referral') {
            await sendMessage(chatId, `👥 *نظام الإحالة*\n\nلكل صديق يسجل عبر رابطك، تحصل على $1\n\nرابطك: \`https://t.me/${env.BOT_TOKEN.split(':')[0]}?start=${user.referralCode}\``, env.BOT_TOKEN);
          }
          else if (data === 'my_account') {
            await sendMessage(chatId, `👤 *حسابي*\n\n💰 الرصيد: $${user.balance.toFixed(2)}\n🔗 رابط الإحالة: \`https://t.me/${env.BOT_TOKEN.split(':')[0]}?start=${user.referralCode}\``, env.BOT_TOKEN);
          }
          else if (data === 'complaint') {
            await sendMessage(chatId, '📢 *تقديم شكوى*\n\nللشكاوى والمقترحات، تواصل مع:\n@BlackArsenalSupport', env.BOT_TOKEN);
          }
          else if (data.startsWith('prod_ff_')) {
            const productId = data.replace('prod_ff_', '');
            const product = freefireProducts.find(p => p.id === productId);
            if (product) {
              await sendMessage(chatId, `🔥 *${product.name}*\n💰 السعر: ${product.price}\n\nللشراء، تواصل مع الدعم.\n@BlackArsenalSupport`, env.BOT_TOKEN);
            }
          }
          else if (data.startsWith('prod_fc_')) {
            const productId = data.replace('prod_fc_', '');
            const product = fcProducts.find(p => p.id === productId);
            if (product) {
              await sendMessage(chatId, `⚽ *${product.name}*\n💰 السعر: ${product.price}\n\nللشراء، تواصل مع الدعم.\n@BlackArsenalSupport`, env.BOT_TOKEN);
            }
          }
          else if (data.startsWith('tool_')) {
            const toolId = data.replace('tool_', '');
            const tool = tools.find(t => t.id === toolId);
            if (tool) {
              let msg = `🛠️ *${tool.name}*\n💰 السعر: ${tool.price}\n\n`;
              if (tool.link) {
                msg += `🔗 *رابط التحميل:*\n${tool.link}`;
              } else {
                msg += `للوصول إلى الأداة، تواصل مع الدعم.\n@BlackArsenalSupport`;
              }
              await sendMessage(chatId, msg, env.BOT_TOKEN);
            }
          }
          
          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: body.callback_query.id })
          });
        }
        
        return new Response('OK');
      } catch (err) {
        console.error(err);
        return new Response('Error', { status: 500 });
      }
    }
    
    return new Response('Bot is running on Cloudflare Workers with KV storage!');
  }
};
