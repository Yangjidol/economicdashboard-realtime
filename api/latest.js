import { seriesList } from '../lib/series.js';

export default async function handler(req, res) {
  const FRED_KEY = process.env.FRED_API_KEY;
  const results = {};

  await Promise.all(seriesList.map(async (s) => {
    if (s.source === 'unavailable') {
      results[s.id] = { error: s.note || '준비 중', unavailable: true };
      return;
    }
    if (s.source === 'fred') {
      if (!FRED_KEY) {
        results[s.id] = { error: 'FRED_API_KEY가 설정되지 않았습니다.' };
        return;
      }
      try {
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${s.code}&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=1`;
        const r = await fetch(url);
        const data = await r.json();
        const obs = data.observations?.[0];
        results[s.id] = (obs && obs.value !== '.') ? { value: obs.value, date: obs.date } : { error: '데이터 없음' };
      } catch (e) {
        results[s.id] = { error: e.message };
      }
    }
  }));

  const meta = seriesList.map(({ id, label, category, unit, source }) => ({
    id, label, category, unit, available: source !== 'unavailable'
  }));

  res.setHeader('Cache-Control', 's-maxage=1800');
  return res.status(200).json({ meta, results });
}
