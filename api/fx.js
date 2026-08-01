// 원/달러 환율 (ExchangeRate-API)
// 필요한 환경변수: EXCHANGERATE_API_KEY
// 발급: https://www.exchangerate-api.com (무료 티어: 월 1,500회 호출)

export default async function handler(req, res) {
  const API_KEY = process.env.EXCHANGERATE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'EXCHANGERATE_API_KEY가 설정되지 않았습니다.' });
  }

  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/USD/KRW`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    if (data.result !== 'success') {
      return res.status(200).json({ error: data['error-type'] || '조회 실패' });
    }
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json({
      usdkrw: data.conversion_rate,
      updated: data.time_last_update_utc
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
