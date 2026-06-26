import 'dotenv/config';
import { Bot, InlineKeyboard } from 'grammy';
import { createOpportunity, listOpportunities, archiveOpportunity } from './notion.js';
import { getSession, setSession, clearSession } from './session.js';

const bot = new Bot(process.env.BOT_TOKEN);

const ADMIN_IDS = (process.env.ADMIN_IDS ?? '')
  .split(',')
  .map((id) => parseInt(id.trim(), 10))
  .filter(Boolean);

function isAdmin(ctx) {
  return ADMIN_IDS.includes(ctx.from?.id);
}

// ---------------------------------------------------------------
// /start
// ---------------------------------------------------------------
bot.command('start', (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply('This bot is for Web3Nova admins only.');
  ctx.reply(
    `*Web3Nova Opportunities Bot*\n\nCommands:\n/add — Post a new hackathon\n/list — List active opportunities\n/delete — Remove an opportunity\n/cancel — Cancel current action`,
    { parse_mode: 'Markdown' }
  );
});

// ---------------------------------------------------------------
// /cancel
// ---------------------------------------------------------------
bot.command('cancel', (ctx) => {
  clearSession(ctx.from.id);
  ctx.reply('Cancelled.');
});

// ---------------------------------------------------------------
// /list — show active opportunities
// ---------------------------------------------------------------
bot.command('list', async (ctx) => {
  if (!isAdmin(ctx)) return;
  try {
    const items = await listOpportunities();
    if (!items.length) return ctx.reply('No active opportunities.');
    const text = items
      .map((o, i) => `${i + 1}. *${o.title}*\nDeadline: ${o.deadline ?? 'N/A'}\nID: \`${o.id}\``)
      .join('\n\n');
    ctx.reply(text, { parse_mode: 'Markdown' });
  } catch (e) {
    ctx.reply('Failed to fetch list: ' + e.message);
  }
});

// ---------------------------------------------------------------
// /delete — list opportunities with delete buttons
// ---------------------------------------------------------------
bot.command('delete', async (ctx) => {
  if (!isAdmin(ctx)) return;
  try {
    const items = await listOpportunities();
    if (!items.length) return ctx.reply('No active opportunities to delete.');

    for (const o of items) {
      const keyboard = new InlineKeyboard().text('🗑 Delete', `delete:${o.id}`);
      await ctx.reply(
        `*${o.title}*\nDeadline: ${o.deadline ?? 'N/A'}`,
        { parse_mode: 'Markdown', reply_markup: keyboard }
      );
    }
  } catch (e) {
    ctx.reply('Failed to fetch list: ' + e.message);
  }
});

bot.callbackQuery(/^delete:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const pageId = ctx.match[1];
  try {
    await archiveOpportunity(pageId);
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    ctx.reply('✅ Opportunity deleted.');
  } catch (e) {
    ctx.reply('Failed to delete: ' + e.message);
  }
});

// ---------------------------------------------------------------
// /add — starts multi-step wizard
// ---------------------------------------------------------------
const STEPS = [
  { key: 'title',            prompt: '📌 *Title*\nWhat is the hackathon name?' },
  { key: 'organizer',        prompt: '🏢 *Organizer*\nWho is running it? (e.g. ETHGlobal)' },
  { key: 'description',      prompt: '📝 *Description*\nBrief 1–2 sentence summary.' },
  { key: 'deadline',         prompt: '📅 *Deadline*\nRegistration deadline in YYYY-MM-DD format. (or skip with /skip)' },
  { key: 'prize',            prompt: '🏆 *Prize Pool*\nNumeric USD amount (e.g. 50000), or type the label like "Devices + $5k" if non-cash. (or /skip)' },
  { key: 'format',           prompt: '🌐 *Format*\nReply with one of: Online, In-Person, Hybrid' },
  { key: 'category',         prompt: '🏷 *Category*\nReply with one or more: Web3, AI, Both (comma-separated if multiple, e.g. Web3, AI)' },
  { key: 'isFree',           prompt: '💸 *Free to Enter?*\nReply yes or no.' },
  { key: 'registrationLink', prompt: '🔗 *Registration Link*\nPaste the sign-up URL. (or /skip)' },
  { key: 'communityLink',    prompt: '👥 *Community / Team-Finding Link*\nPaste the Telegram group link for team finding. (or /skip)' },
];

bot.command('add', (ctx) => {
  if (!isAdmin(ctx)) return;
  setSession(ctx.from.id, { step: 0, data: {} });
  ctx.reply(STEPS[0].prompt, { parse_mode: 'Markdown' });
});

// ---------------------------------------------------------------
// /skip — skip optional steps
// ---------------------------------------------------------------
bot.command('skip', async (ctx) => {
  const session = getSession(ctx.from.id);
  if (!session) return;
  await advanceStep(ctx, session, null);
});

// ---------------------------------------------------------------
// Handle text input during wizard
// ---------------------------------------------------------------
bot.on('message:text', async (ctx) => {
  const session = getSession(ctx.from.id);
  if (!session) return;

  const text = ctx.message.text.trim();
  if (text.startsWith('/')) return; // let command handlers deal with it

  await advanceStep(ctx, session, text);
});

async function advanceStep(ctx, session, value) {
  const userId = ctx.from.id;
  const current = STEPS[session.step];

  // Parse & validate current step value
  if (value !== null) {
    if (current.key === 'deadline') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return ctx.reply('Use YYYY-MM-DD format (e.g. 2026-08-01), or /skip to leave blank.');
      }
      const [, month, day] = value.split('-').map(Number);
      if (month > 12) {
        return ctx.reply(`Month "${month}" is invalid — remember the format is YYYY-MM-DD (year, then month, then day). Try again or /skip.`);
      }
      if (day > 31) {
        return ctx.reply(`Day "${day}" is invalid — remember the format is YYYY-MM-DD. Try again or /skip.`);
      }
      session.data.deadline = value;
    } else if (current.key === 'prize') {
      const numeric = parseInt(value.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numeric) && String(numeric).length > 2) {
        session.data.prize = numeric;
      } else {
        session.data.prizeLabel = value;
      }
    } else if (current.key === 'format') {
      const valid = ['Online', 'In-Person', 'Hybrid'];
      const match = valid.find((v) => v.toLowerCase() === value.toLowerCase());
      if (!match) return ctx.reply('Reply with one of: Online, In-Person, Hybrid');
      session.data.format = match;
    } else if (current.key === 'category') {
      const valid = ['Web3', 'AI', 'Both'];
      const cats = value.split(',').map((c) => {
        const t = c.trim();
        return valid.find((v) => v.toLowerCase() === t.toLowerCase());
      }).filter(Boolean);
      if (!cats.length) return ctx.reply('Reply with: Web3, AI, Both (or comma-separated combination)');
      session.data.category = cats;
    } else if (current.key === 'isFree') {
      session.data.isFree = value.toLowerCase().startsWith('y');
    } else {
      session.data[current.key] = value;
    }
  }

  session.step += 1;

  if (session.step < STEPS.length) {
    setSession(userId, session);
    ctx.reply(STEPS[session.step].prompt, { parse_mode: 'Markdown' });
    return;
  }

  // All steps done — show summary and confirm
  const d = session.data;
  const summary = [
    `*Review your opportunity:*`,
    `📌 *Title:* ${d.title ?? '—'}`,
    `🏢 *Organizer:* ${d.organizer ?? '—'}`,
    `📝 *Description:* ${d.description ?? '—'}`,
    `📅 *Deadline:* ${d.deadline ?? '—'}`,
    `🏆 *Prize:* ${d.prize ? '$' + d.prize.toLocaleString() : d.prizeLabel ?? '—'}`,
    `🌐 *Format:* ${d.format ?? '—'}`,
    `🏷 *Category:* ${d.category?.join(', ') ?? '—'}`,
    `💸 *Free:* ${d.isFree ? 'Yes' : 'No'}`,
    `🔗 *Reg Link:* ${d.registrationLink ?? '—'}`,
    `👥 *Community:* ${d.communityLink ?? '—'}`,
  ].join('\n');

  const keyboard = new InlineKeyboard()
    .text('✅ Publish', 'confirm_publish')
    .text('❌ Discard', 'confirm_discard');

  session.step = 'confirm';
  setSession(userId, session);

  ctx.reply(summary, { parse_mode: 'Markdown', reply_markup: keyboard });
}

// ---------------------------------------------------------------
// Inline button callbacks
// ---------------------------------------------------------------
bot.callbackQuery('confirm_publish', async (ctx) => {
  await ctx.answerCallbackQuery();
  const session = getSession(ctx.from.id);
  if (!session) return ctx.reply('Session expired. Use /add to start again.');

  try {
    await createOpportunity(session.data);
    clearSession(ctx.from.id);
    ctx.reply('✅ Opportunity published! It will appear on the website within ~5 minutes.');
  } catch (e) {
    ctx.reply('Failed to publish: ' + e.message);
  }
});

bot.callbackQuery('confirm_discard', async (ctx) => {
  await ctx.answerCallbackQuery();
  clearSession(ctx.from.id);
  ctx.reply('Discarded. Use /add to start over.');
});

// ---------------------------------------------------------------
// /delete — list active opportunities with delete buttons
// ---------------------------------------------------------------
bot.command('delete', async (ctx) => {
  if (!isAdmin(ctx)) return;
  try {
    const items = await listOpportunities();
    if (!items.length) return ctx.reply('No active opportunities to delete.');

    for (const o of items) {
      const keyboard = new InlineKeyboard().text('🗑 Delete', `delete_${o.id}`);
      await ctx.reply(
        `*${o.title}*\nDeadline: ${o.deadline ?? 'N/A'}`,
        { parse_mode: 'Markdown', reply_markup: keyboard }
      );
    }
  } catch (e) {
    ctx.reply('Failed to fetch list: ' + e.message);
  }
});

bot.callbackQuery(/^delete_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const pageId = ctx.match[1];
  try {
    await archiveOpportunity(pageId);
    await ctx.editMessageReplyMarkup({ reply_markup: new InlineKeyboard() });
    ctx.reply('Opportunity deleted.');
  } catch (e) {
    ctx.reply('Failed to delete: ' + e.message);
  }
});

// ---------------------------------------------------------------
// Start
// ---------------------------------------------------------------
bot.start();
console.log('Web3Nova bot is running...');
