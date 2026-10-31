const DO_URL = 'https://inference.do-ai.run/v1/chat/completions';
const OR_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SYSTEM = `You turn an untrusted campus notice into a draft. Return JSON only: {"title":"","body":"","category":"Campus","urgency":"Info","tags":[]}. Never invent dates, venues, organizers, or verification. Preserve uncertainty in body.`;

const safeDraft = (text, provider) => {
  const clean = String(text || '').trim().slice(0, 10000);
  if (!clean) return null;
  return { title: clean.split(/[.!?\n]/)[0].slice(0, 180), body: clean, category: 'Campus', urgency: 'Draft', tags: ['Unverified'], provider };
};

async function request(url, key, model, text) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: text }], max_tokens: 600, temperature: 0.1 }) });
  if (!response.ok) throw new Error(`Provider responded ${response.status}`);
  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  const parsed = JSON.parse(String(content).replace(/^```json\s*|\s*```$/g, ''));
  return { ...safeDraft(parsed.body || text, model), title: String(parsed.title || '').slice(0, 180) || safeDraft(text, model).title, category: ['Academics','Exams','Associations','Clubs','Events','Campus'].includes(parsed.category) ? parsed.category : 'Campus', urgency: ['Urgent','Important','Info'].includes(parsed.urgency) ? parsed.urgency : 'Info', tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6).map(String) : [] };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const text = String(req.body?.text || '').trim();
  if (!text || text.length > 10000) return res.status(400).json({ error: 'Paste a notice between 1 and 10,000 characters.' });
  try {
    if (process.env.DIGITALOCEAN_MODEL_ACCESS_KEY) return res.status(200).json({ draft: await request(DO_URL, process.env.DIGITALOCEAN_MODEL_ACCESS_KEY, 'gemma-4-31B-it', text), provider: 'DigitalOcean Gemma' });
  } catch (error) { console.warn('DigitalOcean inference failed; trying fallback.', error.message); }
  try {
    if (process.env.OPENROUTER_API_KEY) return res.status(200).json({ draft: await request(OR_URL, process.env.OPENROUTER_API_KEY, 'google/gemma-4-31b-it:free', text), provider: 'OpenRouter Gemma fallback' });
  } catch (error) { console.warn('OpenRouter inference failed.', error.message); }
  return res.status(503).json({ error: 'AI extraction is not configured or unavailable. Your text has not been published.' });
}
