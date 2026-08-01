// 시장 심리 / 원자재 지표 (Twelve Data API)
// 필요한 환경변수: TWELVEDATA_API_KEY
// 발급: https://twelvedata.com (무료 티어: 하루 800회 호출)
//
// 참고: 무료 티어에서 VIX, DXY, WTI 심볼이 모두 지원되는지는
// 요금제/약관이 바뀔 수 있어 제가 확정해서 말씀드리기 어렵습니다.
// 배포 후 결과에 error가 뜨면 Twelve Data 문서에서 정확한 심볼명을 확인해주세요.

export default async function handler(req, res) {
  const API_KEY = process.env.TWELVEDATA_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'TWELVEDATA_API_KEY가 설정되지 않았습니다.' });
  }

  const symbols = {
    vix: 'VIX',
    dxy: 'DXY',
    wti: 'WTI/USD'
  };

  try {
    const results = {};
    for (const [key, symbol] of Object.entries(symbols)) {
      const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
      const r = await fetch(url);
      const data = await r.json();
      if (data.status === 'error' || !data.close) {
        results[key] = { error: data.message || '조회 실패' };
      } else {
        results[key] = { value: data.close, changePercent: data.percent_change };
      }
    }
    res.setHeader('Cache-Control', 's-maxage=900'); // 15분 캐시
    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
