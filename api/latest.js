import { seriesList } from '../lib/series.js';

async function fetchEcosSeries(apiKey, statCode, itemCode, period) {
  const now = new Date();
  let start, end;
  if (period === 'D') {
    end = now.toISOString().slice(0, 10).replace(/-/g, '');
    const s = new Date(now);
    s.setMonth(s.getMonth() - 2);
    start = s.toISOString().slice(0, 10).replace(/-/g, '');
  } else {
    end = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const s = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    start = `${s.getFullYear()}${String(s.getMonth() + 1).padStart(2, '0')}`;
  }
  const url = `https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/20/${statCode}/${period}/${start}/${end}/${itemCode}`;
  const r = await fetch(url);
  const data = await r.json();
  if (data?.RESULT) return { error: data.RESULT.MESSAGE || 'ECOS 오류' };
  const rows = data?.StatisticSearch?.row;
  if (!rows || !rows.length) return { error: '데이터 없음' };
  const latest = rows[rows.length - 1];
  return { value: latest.DATA_VALUE, date: latest.TIME };
}

// ECOS 100대 통계지표(KeyStatisticList)를 가져와서, row 안의 모든 문자열 값을 뒤져
// 지정한 이름(match)을 포함하는 행을 찾는다. 필드명이 정확히 무엇인지 확인이
// 안 된 상태라 방어적으로 짰다. 못 찾으면 에러로 정직하게 표시한다.
async function fetchEcosKeyStats(apiKey) {
  const url = `https://ecos.bok.or.kr/api/KeyStatisticList/${apiKey}/json/kr/1/100`;
  const r = await fetch(url);
  const data = await r.json();
  const rows = data?.KeyStatisticList?.row || [];
  return rows;
}

function findInKeyStats(rows, match, exactOnly) {
  for (const row of rows) {
    const values = Object.values(row).filter(v => typeof v === 'string');
    const nameCandidate = values.find(v => exactOnly ? v === match : v.includes(match));
    if (nameCandidate) {
      const value = row.DATA_VALUE || row.dataValue || row.VALUE;
      const date = row.CYCLE || row.TIME || row.time || '';
      if (value) return { value, date };
    }
  }
  return null;
}

export default async function handler(req, res) {
  const FRED_KEY = process.env.FRED_API_KEY;
  const ECOS_KEY = process.env.ECOS_API_KEY;
  const results = {};

  const needsEcosKeyStat = seriesList.some(s => s.source === 'ecos-keystat');
  let ecosRows = [];
  let ecosError = null;
  if (needsEcosKeyStat) {
    if (!ECOS_KEY) {
      ecosError = 'ECOS_API_KEY가 설정되지 않았습니다.';
    } else {
      try {
        ecosRows = await fetchEcosKeyStats(ECOS_KEY);
      } catch (e) {
        ecosError = e.message;
      }
    }
  }

  await Promise.all(seriesList.map(async (s) => {
    if (s.source === 'unavailable') {
      results[s.id] = { error: s.note || '준비 중', unavailable: true };
      return;
    }
    if (s.source === 'ecos') {
      if (!ECOS_KEY) { results[s.id] = { error: 'ECOS_API_KEY가 설정되지 않았습니다.' }; return; }
      try {
        results[s.id] = await fetchEcosSeries(ECOS_KEY, s.statCode, s.itemCode, s.period || 'D');
      } catch (e) {
        results[s.id] = { error: e.message };
      }
      return;
    }
    if (s.source === 'ecos-keystat') {
      if (ecosError) { results[s.id] = { error: ecosError }; return; }
      const found = findInKeyStats(ecosRows, s.match, s.exactOnly);
      results[s.id] = found ? found : { error: '값을 찾지 못함 (100대 지표에 없을 수 있음)' };
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
