/**
 * 통화 정보 타입
 */
export type CurrencyInfo = {
  koreanName: string;
  flagUrl: string;
};

/**
 * 통화 코드별 정보 맵
 * - 데이터와 뷰의 분리를 위해 switch문에서 데이터 객체로 전환
 * - 유지보수 및 확장성 향상
 */
export const currencyInfoMap: Record<string, CurrencyInfo> = {
  AED: {
    koreanName: "아랍에미리트 연합",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551487_BR8MI9H0F.png%2F120_p.png%3Ftype%3Dm1500",
  },
  ARS: {
    koreanName: "아르헨티나",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555325_93FQFYWBF.png%2F144_p.png%3Ftype%3Dm1500",
  },
  AUD: {
    koreanName: "호주",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554595_B7JLBMSR1.png%2F127_p.png%3Ftype%3Dm1500",
  },
  BDT: {
    koreanName: "방글라데시",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552948_CIAJ1Y0CZ.png%2F53_p.png%3Ftype%3Dm1500",
  },
  BHD: {
    koreanName: "바레인",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550692_BKHVJ8UNL.png%2F35_p.png%3Ftype%3Dm1500",
  },
  BND: {
    koreanName: "브루나이",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553426_LJ3LAD2JV.png%2F191_p.png%3Ftype%3Dm1500",
  },
  BRL: {
    koreanName: "브라질",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553697_AHXIC7N2I.png%2F160_p.png%3Ftype%3Dm1500",
  },
  CAD: {
    koreanName: "캐나다",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553398_EU113FX2F.png%2F152_p.png%3Ftype%3Dm1500",
  },
  CHF: {
    koreanName: "스위스",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120702113301741_JNOA37WIZ.png%2F171_p.png%3Ftype%3Dm1500",
  },
  CLP: {
    koreanName: "칠레",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555710_UZK8MOQUC.png%2F146_p.png%3Ftype%3Dm1500",
  },
  CNY: {
    koreanName: "중국",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554823_P2U3KQFIG.png%2F196_p.png%3Ftype%3Dm1500",
  },
  COP: {
    koreanName: "콜롬비아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555754_7I028TUZH.png%2F61_p.png%3Ftype%3Dm1500",
  },
  CZK: {
    koreanName: "체코공화국",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548363_LZP6UR7PL.png%2F156_p.png%3Ftype%3Dm1500",
  },
  DKK: {
    koreanName: "덴마크",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174547691_FOCLZ984X.png%2F154_p.png%3Ftype%3Dm1500",
  },
  EGP: {
    koreanName: "이집트",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556212_J0G073GXP.png%2F135_p.png%3Ftype%3Dm1500",
  },
  ETB: {
    koreanName: "에티오피아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556083_Q44PUSVHJ.png%2F137_p.png%3Ftype%3Dm1500",
  },
  EUR: {
    koreanName: "유럽연합",
    flagUrl:
      "https://i.namu.wiki/i/k0aDjQVvAgslAPsouxdk6ybUcG04ncjqsvlzExb0AcasYOy2cb992poXL5WrMYTf3HcNtSEl6oGnVJAy9BXGnTJFvLI5RwkwBY1clAkD2NBGz8L9YRjWdSzp4dDAZB8wKH_HgJG9XRrPNv3XzehEsg.svg",
  },
  FJD: {
    koreanName: "피지",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550217_YH0NFPVSX.png%2F124_p.png%3Ftype%3Dm1500",
  },
  GBP: {
    koreanName: "영국",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555210_7QC1PBGJ2.png%2F178_p.png%3Ftype%3Dm1500",
  },
  HKD: {
    koreanName: "홍콩",
    flagUrl:
      "https://i.namu.wiki/i/ho9FlXg_62YlOuWMcE-D2GStnfBtiGzpCHRi5PpQh8zgpdgiqtwnMDjYhKktmhiD76MIa6Ra_s9ZH4nH0N0FPPy0FyKuUZhyZsZTZbRLNGVm-y37PDajjR-ADd4hOYSeYxPxcxwUFhZ_0fW3F5A-OA.svg",
  },
  HUF: {
    koreanName: "헝가리",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550655_0D39QZNHV.png%2F162_p.png%3Ftype%3Dm1500",
  },
  IDR: {
    koreanName: "인도네시아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554679_24BGO6MSP.png%2F189_p.png%3Ftype%3Dm1500",
  },
  ILS: {
    koreanName: "이스라엘",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552748_MK5CMYGHQ.png%2F185_p.png%3Ftype%3Dm1500",
  },
  INR: {
    koreanName: "인도",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554674_9GZJ46BRA.png%2F198_p.png%3Ftype%3Dm1500",
  },
  JOD: {
    koreanName: "요르단",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552229_H0HZ123NK.png%2F190_p.png%3Ftype%3Dm1500",
  },
  JPY: {
    koreanName: "일본",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554812_TWE08D1Y3.png%2F194_p.png%3Ftype%3Dm1500",
  },
  KES: {
    koreanName: "케냐",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548413_NJCGKKDGG.png%2F131_p.png%3Ftype%3Dm1500",
  },
  KHR: {
    koreanName: "캄보디아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20131030183448848_HA3F4KP7A.png%2Fcambodia_108X81.png%3Ftype%3Dm1500",
  },
  KRW: {
    koreanName: "대한민국",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551009_GNUFXN9OD.png%2F122_p.png%3Ftype%3Dm1500",
  },
  KWD: {
    koreanName: "쿠웨이트",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552831_CP71M1YEX.png%2F49_p.png%3Ftype%3Dm1500",
  },
  KZT: {
    koreanName: "카자흐스탄",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554851_H3J0HJYDZ.png%2F78_p.png%3Ftype%3Dm1500",
  },
  LKR: {
    koreanName: "스리랑카",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553475_8F5QMC03M.png%2F184_p.png%3Ftype%3Dm1500",
  },
  LYD: {
    koreanName: "리비아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550023_YSWO1IOBL.png%2F149_p.png%3Ftype%3Dm1500",
  },
  MMK: {
    koreanName: "미얀마",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120702113059733_ID1E46WT2.png%2F183.png%3Ftype%3Dm1500",
  },
  MNT: {
    koreanName: "몽골",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552439_Q3X61NFIU.png%2F195_p.png%3Ftype%3Dm1500",
  },
  MOP: {
    koreanName: "마카오",
    flagUrl:
      "https://i.namu.wiki/i/fFRA3Wr-RqDijkfHwMr80vIOcFU-LXzn8HGH3wJkFqoffqpxSRloi6KbCG2viyABIO-UmWRo9pIjVH1ZOrj-yj3X3lCPzxd7aOHVUUje9OvKuFM7Jc8L1Sv_wj5lw-ZDr0Zs7SbT_wvo0rvF6BZnbw.svg",
  },
  MXN: {
    koreanName: "멕시코",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551388_JRXSSBHJL.png%2F143_p.png%3Ftype%3Dm1500",
  },
  MYR: {
    koreanName: "말레이시아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551184_JS93DBNFQ.png%2F197_p.png%3Ftype%3Dm1500",
  },
  NOK: {
    koreanName: "노르웨이",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174547704_21EMF0VH3.png%2F165_p.png%3Ftype%3Dm1500",
  },
  NPR: {
    koreanName: "네팔",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550512_TFIM2EB43.png%2F192_p.png%3Ftype%3Dm1500",
  },
  NZD: {
    koreanName: "뉴질랜드",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553896_GY1J8X4WT.png%2F125_p.png%3Ftype%3Dm1500",
  },
  OMR: {
    koreanName: "오만",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552078_5L42JXOFB.png%2F15_p.png%3Ftype%3Dm1500",
  },
  PHP: {
    koreanName: "필리핀",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556753_HDOZL6S03.png%2F173_p.png%3Ftype%3Dm1500",
  },
  PKR: {
    koreanName: "파키스탄",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556696_07LTJRU62.png%2F181_p.png%3Ftype%3Dm1500",
  },
  PLN: {
    koreanName: "폴란드",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174549922_0P9LVEN7L.png%2F153_p.png%3Ftype%3Dm1500",
  },
  QAR: {
    koreanName: "카타르",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552812_3H5VXLBTB.png%2F80_p.png%3Ftype%3Dm1500",
  },
  RON: {
    koreanName: "루마니아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548779_QJ36UAR76.png%2F30_p.png%3Ftype%3Dm1500",
  },
  RUB: {
    koreanName: "러시아 연방",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548414_KS3EO8MB0.png%2F163_p.png%3Ftype%3Dm1500",
  },
  SAR: {
    koreanName: "사우디아라비아",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550747_2STAZOIU8.png%2F187_p.png%3Ftype%3Dm1500",
  },
  SEK: {
    koreanName: "스웨덴",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552725_ZT1F6YTQU.png%2F169_p.png%3Ftype%3Dm1500",
  },
  SGD: {
    koreanName: "싱가포르",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553547_H00G337AF.png%2F182_p.png%3Ftype%3Dm1500",
  },
  THB: {
    koreanName: "태국",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556521_16O07H1HB.png%2F186_p.png%3Ftype%3Dm1500",
  },
  TRY: {
    koreanName: "튀르키예",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552925_C9G8JVOMN.png%2F179_p.png%3Ftype%3Dm1500",
  },
  TWD: {
    koreanName: "대만",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556566_E8THO6KAI.png%2F180_p.png%3Ftype%3Dm1500",
  },
  USD: {
    koreanName: "미국",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174547033_D0O1SER5Z.png%2F155_p.png%3Ftype%3Dm1500",
  },
  UZS: {
    koreanName: "우즈베키스탄",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554616_A6S6UIIM9.png%2F70_p.png%3Ftype%3Dm1500",
  },
  VND: {
    koreanName: "베트남",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552951_9JTGQEH3Y.png%2F188_p.png%3Ftype%3Dm1500",
  },
  ZAR: {
    koreanName: "남아프리카 공화국",
    flagUrl:
      "https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174549130_UJ65GJUYX.png%2F145_p.png%3Ftype%3Dm1500",
  },
};

/**
 * 환율 카드 표시를 위한 우선순위 국가 코드 목록
 */
export const PREFERRED_CURRENCY_CODES = ["KRW", "USD", "CNY", "JPY", "VND", "TWD"];

/**
 * 알 수 없는 통화에 대한 기본값
 */
const defaultCurrencyInfo: CurrencyInfo = {
  koreanName: "알 수 없음",
  flagUrl: "", // 빈 문자열이나 기본 이미지를 사용할 수 있음
};

/**
 * 통화 코드로 국가명과 국기 URL을 조회하는 헬퍼 함수
 * @param code 통화 코드 (e.g., "USD")
 * @returns {CurrencyInfo} 통화 정보 객체
 */
export const getCurrencyInfo = (code: string): CurrencyInfo => {
  return currencyInfoMap[code.toUpperCase()] ?? defaultCurrencyInfo;
};
