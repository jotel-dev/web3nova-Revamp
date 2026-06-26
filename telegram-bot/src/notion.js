import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_OPPORTUNITIES_DB_ID;

export async function createOpportunity(data) {
  const props = {
    Title: { title: [{ text: { content: data.title } }] },
    Organizer: { rich_text: [{ text: { content: data.organizer } }] },
    Description: { rich_text: [{ text: { content: data.description } }] },
    Status: { select: { name: 'Active' } },
  };

  if (data.prize) props['Prize'] = { number: data.prize };
  if (data.prizeLabel) props['Prize Label'] = { rich_text: [{ text: { content: data.prizeLabel } }] };
  if (data.deadline) props['Deadline'] = { date: { start: data.deadline } };
  if (data.format) props['Format'] = { select: { name: data.format } };
  if (data.category?.length) props['Category'] = { multi_select: data.category.map((c) => ({ name: c })) };
  if (data.registrationLink) props['Registration Link'] = { url: data.registrationLink };
  if (data.communityLink) props['Community Link'] = { url: data.communityLink };
  if (typeof data.isFree === 'boolean') props['Free to Enter'] = { checkbox: data.isFree };

  return notion.pages.create({ parent: { database_id: DB_ID }, properties: props });
}

export async function listOpportunities() {
  const res = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: 'Status', select: { equals: 'Active' } },
    sorts: [{ property: 'Deadline', direction: 'ascending' }],
  });

  return res.results.map((p) => ({
    id: p.id,
    title: p.properties['Title']?.title?.[0]?.plain_text ?? '(untitled)',
    deadline: p.properties['Deadline']?.date?.start ?? null,
    status: p.properties['Status']?.select?.name ?? 'Active',
  }));
}

export async function archiveOpportunity(pageId) {
  return notion.pages.update({ page_id: pageId, archived: true });
}
