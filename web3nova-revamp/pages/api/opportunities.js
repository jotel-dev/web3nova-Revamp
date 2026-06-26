const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function buildFilters() {
  return {
    filter: {
      and: [
        { property: 'Status', select: { equals: 'Active' } },
      ],
    },
    sorts: [{ property: 'Deadline', direction: 'ascending' }],
  };
}

function mapNotionPage(page) {
  const p = page.properties;

  const getText = (prop) =>
    prop?.title?.[0]?.plain_text ??
    prop?.rich_text?.[0]?.plain_text ??
    '';

  const getSelect = (prop) => prop?.select?.name ?? '';
  const getMultiSelect = (prop) => prop?.multi_select?.map((s) => s.name) ?? [];
  const getDate = (prop) => prop?.date?.start ?? null;
  const getUrl = (prop) => prop?.url ?? '';
  const getNumber = (prop) => prop?.number ?? null;
  const getCheckbox = (prop) => prop?.checkbox ?? false;

  return {
    id: page.id,
    title: getText(p['Title']),
    organizer: getText(p['Organizer']),
    description: getText(p['Description']),
    format: getSelect(p['Format']),
    category: getMultiSelect(p['Category']),
    prize: getNumber(p['Prize']),
    prizeLabel: getText(p['Prize Label']),
    deadline: getDate(p['Deadline']),
    registrationLink: getUrl(p['Registration Link']),
    communityLink: getUrl(p['Community Link']),
    isFree: getCheckbox(p['Free to Enter']),
    status: getSelect(p['Status']),
    addedAt: page.created_time,
  };
}

function getDaysLeft(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_OPPORTUNITIES_DB_ID;

  if (!token || !dbId) {
    return res.status(500).json({ error: 'Notion credentials not configured' });
  }

  try {
    const response = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildFilters()),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.message ?? 'Notion error' });
    }

    const data = await response.json();
    const opportunities = data.results.map(mapNotionPage).map((o) => ({
      ...o,
      daysLeft: getDaysLeft(o.deadline),
    }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ opportunities, total: opportunities.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
}
