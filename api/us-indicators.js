// 미국 경제지표 (FRED - 세인트루이스 연은 API)
// 필요한 환경변수: FRED_API_KEY
// FRED는 무료이며 https://fred.stlouisfed.org/docs/api/api_key.html 에서 발급

export default async function handler(req, res) {
  const API_KEY = process.env.FRED_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'FRED_API_KEY가 설정되지 않았습니다.' });
  }

  // series_id는 FRED 공식 코드입니다.
  const series = {
    cpi: 'CPIAUCSL',        // 소비자물가지수
    pce: 'PCEPI',           // PCE 물가지수
    unemployment: 'UNRATE', // 실업률
    treasury10y: 'DGS10',   // 미 국채 10년물 금리
    gdp: 'GDPC1',           // 실질 GDP
    vix: 'VIXCLS',          // CBOE 변동성지수(VIX), 하루 단위 갱신
    wti: 'DCOILWTICO',      // WTI 원유 현물가격, 하루 단위 갱신
    dollarIndex: 'DTWEXBGS' // 연준 무역가중 달러지수 (ICE의 DXY와는 다른 지수, 참고용)
  };

  try {
    const results = {};
    for (const [key, id] of Object.entries(series)) {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=1`;
      const r = await fetch(url);
      if (!r.ok) {
        results[key] = { error: `FRED 응답 오류 (${r.status})` };
        continue;
      }
      const data = await r.json();
      const obs = data.observations?.[0];
      results[key] = obs ? { date: obs.date, value: obs.value } : { error: '데이터 없음' };
    }
    res.setHeader('Cache-Control', 's-maxage=3600'); // 1시간 캐시
    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
