// 전체 지표 목록 (카테고리별)
// source: 'fred' = FRED API로 확인됨 / 'unavailable' = 무료 소스 확인 안 됨 (임의로 지어내지 않음)

export const seriesList = [
  // 1. 주요 증시
  { id: 'dow', label: '다우존스산업평균', category: '주요 증시', source: 'fred', code: 'DJIA', unit: '' },
  { id: 'nasdaq', label: '나스닥종합지수', category: '주요 증시', source: 'fred', code: 'NASDAQCOM', unit: '' },
  { id: 'sp500', label: 'S&P500', category: '주요 증시', source: 'fred', code: 'SP500', unit: '' },
  { id: 'nikkei225', label: '니케이225', category: '주요 증시', source: 'fred', code: 'NIKKEI225', unit: '' },
  { id: 'sox', label: '필라델피아반도체지수', category: '주요 증시', source: 'unavailable', note: '무료 API 확인 안 됨' },
  { id: 'kospi', label: '코스피', category: '주요 증시', source: 'unavailable', note: '무료 API 확인 안 됨' },
  { id: 'kosdaq', label: '코스닥', category: '주요 증시', source: 'unavailable', note: '무료 API 확인 안 됨' },

  // 2. 국채수익률
  { id: 'us2y', label: '미국 2년', category: '국채수익률', source: 'fred', code: 'DGS2', unit: '%' },
  { id: 'us3y', label: '미국 3년', category: '국채수익률', source: 'fred', code: 'DGS3', unit: '%' },
  { id: 'us5y', label: '미국 5년', category: '국채수익률', source: 'fred', code: 'DGS5', unit: '%' },
  { id: 'us10y', label: '미국 10년', category: '국채수익률', source: 'fred', code: 'DGS10', unit: '%' },
  { id: 'us30y', label: '미국 30년', category: '국채수익률', source: 'fred', code: 'DGS30', unit: '%' },
  { id: 'kr2y', label: '한국 2년', category: '국채수익률', source: 'unavailable', note: 'ECOS 통계코드 확인 필요' },
  { id: 'kr3y', label: '한국 3년', category: '국채수익률', source: 'unavailable', note: 'ECOS 통계코드 확인 필요' },
  { id: 'kr5y', label: '한국 5년', category: '국채수익률', source: 'unavailable', note: 'ECOS 통계코드 확인 필요' },
  { id: 'kr10y', label: '한국 10년', category: '국채수익률', source: 'unavailable', note: 'ECOS 통계코드 확인 필요' },
  { id: 'kr30y', label: '한국 30년', category: '국채수익률', source: 'unavailable', note: 'ECOS 통계코드 확인 필요' },

  // 3. 유가
  { id: 'wti', label: 'WTI', category: '유가', source: 'fred', code: 'DCOILWTICO', unit: '달러' },
  { id: 'brent', label: '브렌트유', category: '유가', source: 'fred', code: 'DCOILBRENTEU', unit: '달러' },
  { id: 'dubai', label: '두바이유', category: '유가', source: 'unavailable', note: '무료 API 확인 안 됨' },

  // 4. 금값
  { id: 'gold_intl', label: '국제 금', category: '금값', source: 'unavailable', note: '무료 API 확인 안 됨' },
  { id: 'gold_domestic', label: '국내 금', category: '금값', source: 'unavailable', note: '무료 API 확인 안 됨' },

  // 5. 환율
  { id: 'dollarIndex', label: '달러지수 (무역가중)', category: '환율', source: 'fred', code: 'DTWEXBGS', unit: '' },
  { id: 'usdkrw', label: '미국 USD/KRW', category: '환율', source: 'fred', code: 'DEXKOUS', unit: '원' },
  { id: 'usdjpy', label: '일본 USD/JPY', category: '환율', source: 'fred', code: 'DEXJPUS', unit: '엔' },
  { id: 'usdcny', label: '중국 USD/CNY', category: '환율', source: 'fred', code: 'DEXCHUS', unit: '위안' },
  { id: 'usdeur', label: '유럽연합 USD/EUR', category: '환율', source: 'fred', code: 'DEXUSEU', unit: '유로' }
];
