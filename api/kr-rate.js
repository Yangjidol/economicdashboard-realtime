// 한국 기준금리 (한국은행 ECOS API)
// 필요한 환경변수: ECOS_API_KEY
// 발급: https://ecos.bok.or.kr (회원가입 > 인증키 신청)
//
// 주의: 통계코드(722Y001)와 항목코드(0101000)는 한국은행 기준금리 시계열로
// 알려진 값을 사용했습니다. 배포 후 실제 응답이 다르게 나오면
// https://ecos.bok.or.kr/api/#/StatisticSearch 에서 정확한 코드를 다시 확인해주세요.
// 이 부분은 제가 직접 호출 테스트를 해보지 못해 100% 확정은 아닙니다.

export default async function handler(req, res) {
  const API_KEY = process.env.ECOS_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'ECOS_API_KEY가 설정되지 않았습니다.' });
  }

  const now = new Date();
  const end = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const start = `${startDate.getFullYear()}${String(startDate.getMonth() + 1).padStart(2, '0')}`;

  const url = `https://ecos.bok.or.kr/api/StatisticSearch/${API_KEY}/json/kr/1/20/722Y001/M/${start}/${end}/0101000`;

  try {
    const r = await fetch(url);
    const data = await r.json();

    if (data?.RESULT) {
      // ECOS는 오류도 200으로 반환하는 경우가 있어 RESULT 필드를 확인
      return res.status(200).json({ error: data.RESULT.MESSAGE || 'ECOS 오류', raw: data });
    }

    const rows = data?.StatisticSearch?.row;
    const latest = rows && rows.length ? rows[rows.length - 1] : null;

    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json({
      baseRate: latest ? { date: latest.TIME, value: latest.DATA_VALUE } : null
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
