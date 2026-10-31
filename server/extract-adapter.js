/**
 * Server-only contract for a Vercel function or similar trusted runtime.
 * The browser must never receive GEMMA_API_KEY or talk to DigitalOcean directly.
 */
import { MAX_TEXT_LENGTH } from '../src/domain.js';

export function providerConfig(env = process.env) {
  const { GEMMA_ENDPOINT, GEMMA_API_KEY, GEMMA_MODEL } = env;
  if (!GEMMA_ENDPOINT || !GEMMA_API_KEY || !GEMMA_MODEL) return null;
  const url = new URL(GEMMA_ENDPOINT);
  if (url.protocol !== 'https:') throw new Error('GEMMA_ENDPOINT must use HTTPS.');
  return { endpoint: url.href, apiKey: GEMMA_API_KEY, model: GEMMA_MODEL };
}

export async function extractWithGemma(input, env = process.env, request = fetch) {
  const config = providerConfig(env);
  if (!config) throw new Error('EXTRACTOR_NOT_CONFIGURED');
  if (!input?.text || input.text.length > MAX_TEXT_LENGTH) throw new Error('INVALID_INPUT');
  const response = await request(config.endpoint, { method:'POST', headers:{ Authorization:`Bearer ${config.apiKey}`, 'Content-Type':'application/json' }, body:JSON.stringify({ model:config.model, messages:[{ role:'system', content:'Return only strict JSON actions. Never invent a date or official verification.' }, { role:'user', content:input.text }], response_format:{ type:'json_object' } }) });
  if (!response.ok) throw new Error(`PROVIDER_${response.status}`);
  return response.json();
}
