# 경제지표 실시간 대시보드 - 배포 가이드

## 구조
```
dashboard-realtime/
├── index.html          ← 대시보드 화면
├── api/
│   ├── us-indicators.js  ← 미국 지표 (FRED)
│   ├── kr-rate.js        ← 한국 기준금리 (한국은행 ECOS)
│   ├── market.js         ← VIX/DXY/WTI (Twelve Data)
│   └── fx.js              ← 원/달러 환율 (ExchangeRate-API)
└── package.json
```

API 키는 `api/` 폴더의 코드가 서버에서만 사용하고, `index.html`은 `/api/...` 주소만
호출하기 때문에 브라우저(다른 사람 화면)에는 키가 노출되지 않습니다.

---

## 1단계. API 키 발급 (4개, 모두 무료 티어 있음)

| 서비스 | 발급 링크 |
|---|---|
| FRED | https://fred.stlouisfed.org/docs/api/api_key.html |
| 한국은행 ECOS | https://ecos.bok.or.kr |
| Twelve Data | https://twelvedata.com |
| ExchangeRate-API | https://www.exchangerate-api.com |

## 2단계. GitHub에 업로드
1. github.com에서 새 저장소(repository) 생성 (Public이어도 되고 Private이어도 됨)
2. 이 폴더 전체를 업로드

## 3단계. Vercel 배포
1. https://vercel.com 가입 (GitHub 계정으로 로그인 가능)
2. **Add New → Project** → 방금 만든 GitHub 저장소 선택
3. **Environment Variables**에 아래 4개를 추가:
   - `FRED_API_KEY`
   - `ECOS_API_KEY`
   - `TWELVEDATA_API_KEY`
   - `EXCHANGERATE_API_KEY`
4. **Deploy** 클릭 → 1~2분 후 `https://프로젝트이름.vercel.app` 주소 생성됨

## 4단계. 공유
생성된 주소를 다른 사람에게 보내면, 그 사람은 키 없이도 실시간 데이터를 볼 수 있습니다.

---

## 확인이 필요한 부분 (솔직하게 안내드립니다)

이 코드는 각 API의 공식 문서를 기반으로 작성했지만, 이 환경에서는 해당 API들에
직접 접속해서 실제 응답을 테스트해보지 못했습니다. 배포 후 다음을 확인해주세요.

- **한국은행 ECOS**: `api/kr-rate.js`의 통계코드(`722Y001`)와 항목코드(`0101000`)가
  정확한지 ECOS API 문서(https://ecos.bok.or.kr/api/#/StatisticSearch)에서
  재확인이 필요할 수 있습니다.
- **Twelve Data**: 무료 티어에서 VIX, DXY 심볼 조회가 제한될 수 있습니다.
  화면에 "조회 실패"가 뜨면 Twelve Data 대시보드에서 심볼명을 확인해주세요.

각 API는 조회 실패 시 화면에 실제 오류 메시지를 그대로 보여주도록 만들어서,
문제가 생겼을 때 원인을 바로 확인할 수 있게 했습니다.

## 비용 관련
모든 API는 무료 티어로 충분합니다 (하루 새로고침 몇 번 수준). 다만 대시보드에
방문자가 아주 많아지면 무료 호출 한도를 넘을 수 있으니, 그 경우 Vercel의
Environment Variables는 그대로 두고 유료 플랜 업그레이드만 하면 됩니다.
