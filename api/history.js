import { seriesList } from '../lib/series.js';

function rangeToStartDate(range) {
  const d = new Date();
  switch (range) {
    case '1m': d.setMonth(d.getMonth() - 1); break;
    case '3m': d.setMonth(d.getMonth() - 3); break;
    case '1y': d.setFullYear(d.getFullYear() - 1); break;
    case '3y': d.setFullYear(d.getFullYear() - 3); break;
    case '5y': d.setFullYear(d.getFullYear() - 5); break;
    case '10y': d.setFullYear(d.getFullYear() - 10); break;
    default: d.setFullYear(d.getFullYear() - 1);
  }
  return d.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  const { id, range } = req.query;
  const s = seriesList.find(x => x.id === id);

  if (!s) return res.status(404).json({ error: '알 수 없는 지표입니다.' });
  if (s.source !== 'fred') {
    return res.status(200).json({ error: '이 지표는 아직 과거 데이터를 지원하지 않습니다.' });
  }

  const FRED_KEY = process.env.FRED_API_KEY;
  if (!FRED_KEY) return res.status(500).json({ error: 'FRED_API_KEY가 설정되지 않았습니다.' });

  const start = rangeToStartDate(range || '1y');

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${s.code}&api_key=${FRED_KEY}&file_type=json&observation_start=${start}&sort_order=asc`;
    const r = await fetch(url);
    const data = await r.json();
    const points = (data.observations || [])
      .filter(o => o.value !== '.')
      .map(o => ({ date: o.date, value: Number(o.value) }));

    res.setHeader('Cache-Control', 's-maxage=1800');
    return res.status(200).json({ id: s.id, label: s.label, unit: s.unit, points });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
