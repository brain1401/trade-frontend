import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { exchangeRatesApi } from "@/lib/api";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import React, { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";


/**
 * 환율 정보 라우트 정의
 */
export const Route = createFileRoute("/exchange-rates/")({
  component: ExchangeRatesPage,
});

function FlagIcon({ src, alt }: { src: string, alt?: string }) {
  return (
    <img className="h-[2.5rem]" src={src} />
  )
}

/**
 * 통화 코드에 따른 국기 이모지 및 한국어 이름 반환 (임시)
 * 실제로는 더 견고한 매핑 로직이나 API를 사용해야 합니다.
 */
type FlagAndKoreanName = { koreanName: string; Flag: ReactNode };
const getFlagByCurrencyCode = (code: string): FlagAndKoreanName => {
  // 사용자가 제공한 파일이름을 src에 사용
  switch (code.toUpperCase()) {
    case "AED": return { koreanName: "아랍에미리트 연합", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551487_BR8MI9H0F.png%2F120_p.png%3Ftype%3Dm1500" alt="아랍에미리트 연합 국기" /> };
    case "ARS": return { koreanName: "아르헨티나", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555325_93FQFYWBF.png%2F144_p.png%3Ftype%3Dm1500" alt="아르헨티나 국기" /> };
    case "AUD": return { koreanName: "호주", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554595_B7JLBMSR1.png%2F127_p.png%3Ftype%3Dm1500" alt="호주 국기" /> };
    case "BDT": return { koreanName: "방글라데시", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552948_CIAJ1Y0CZ.png%2F53_p.png%3Ftype%3Dm1500" alt="방글라데시 국기" /> };
    case "BHD": return { koreanName: "바레인", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550692_BKHVJ8UNL.png%2F35_p.png%3Ftype%3Dm1500" alt="바레인 국기" /> };
    case "BND": return { koreanName: "브루나이", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553426_LJ3LAD2JV.png%2F191_p.png%3Ftype%3Dm1500" alt="브루나이 국기" /> };
    case "BRL": return { koreanName: "브라질", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553697_AHXIC7N2I.png%2F160_p.png%3Ftype%3Dm1500" alt="브라질 국기" /> };
    case "CAD": return { koreanName: "캐나다", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553398_EU113FX2F.png%2F152_p.png%3Ftype%3Dm1500" alt="캐나다 국기" /> };
    case "CHF": return { koreanName: "스위스", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120702113301741_JNOA37WIZ.png%2F171_p.png%3Ftype%3Dm1500" alt="스위스 국기" /> };
    case "CLP": return { koreanName: "칠레", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555710_UZK8MOQUC.png%2F146_p.png%3Ftype%3Dm1500" alt="칠레 국기" /> };
    case "CNY": return { koreanName: "중국", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554823_P2U3KQFIG.png%2F196_p.png%3Ftype%3Dm1500" alt="중국 국기" /> };
    case "COP": return { koreanName: "콜롬비아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555754_7I028TUZH.png%2F61_p.png%3Ftype%3Dm1500" alt="콜롬비아 국기" /> };
    case "CZK": return { koreanName: "체코공화국", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548363_LZP6UR7PL.png%2F156_p.png%3Ftype%3Dm1500" alt="체코공화국 국기" /> };
    case "DKK": return { koreanName: "덴마크", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174547691_FOCLZ984X.png%2F154_p.png%3Ftype%3Dm1500" alt="덴마크 국기" /> };
    case "EGP": return { koreanName: "이집트", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556212_J0G073GXP.png%2F135_p.png%3Ftype%3Dm1500" alt="이집트 국기" /> };
    case "ETB": return { koreanName: "에티오피아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556083_Q44PUSVHJ.png%2F137_p.png%3Ftype%3Dm1500" alt="에티오피아 국기" /> };
    case "EUR": return { koreanName: "유럽연합", Flag: <FlagIcon src="https://i.namu.wiki/i/k0aDjQVvAgslAPsouxdk6ybUcG04ncjqsvlzExb0AcasYOy2cb992poXL5WrMYTf3HcNtSEl6oGnVJAy9BXGnTJFvLI5RwkwBY1clAkD2NBGz8L9YRjWdSzp4dDAZB8wKH_HgJG9XRrPNv3XzehEsg.svg" alt="유럽연합 국기" /> };
    case "FJD": return { koreanName: "피지", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550217_YH0NFPVSX.png%2F124_p.png%3Ftype%3Dm1500" alt="피지 국기" /> };
    case "GBP": return { koreanName: "영국", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174555210_7QC1PBGJ2.png%2F178_p.png%3Ftype%3Dm1500" alt="영국 국기" /> };
    case "HKD": return { koreanName: "홍콩", Flag: <FlagIcon src="https://i.namu.wiki/i/ho9FlXg_62YlOuWMcE-D2GStnfBtiGzpCHRi5PpQh8zgpdgiqtwnMDjYhKktmhiD76MIa6Ra_s9ZH4nH0N0FPPy0FyKuUZhyZsZTZbRLNGVm-y37PDajjR-ADd4hOYSeYxPxcxwUFhZ_0fW3F5A-OA.svg" alt="홍콩 국기" /> };
    case "HUF": return { koreanName: "헝가리", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550655_0D39QZNHV.png%2F162_p.png%3Ftype%3Dm1500" alt="헝가리 국기" /> };
    case "IDR": return { koreanName: "인도네시아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554679_24BGO6MSP.png%2F189_p.png%3Ftype%3Dm1500" alt="인도네시아 국기" /> };
    case "ILS": return { koreanName: "이스라엘", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552748_MK5CMYGHQ.png%2F185_p.png%3Ftype%3Dm1500" alt="이스라엘 국기" /> };
    case "INR": return { koreanName: "인도", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554674_9GZJ46BRA.png%2F198_p.png%3Ftype%3Dm1500" alt="인도 국기" /> };
    case "JOD": return { koreanName: "요르단", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552229_H0HZ123NK.png%2F190_p.png%3Ftype%3Dm1500" alt="요르단 국기" /> };
    case "JPY": return { koreanName: "일본", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554812_TWE08D1Y3.png%2F194_p.png%3Ftype%3Dm1500" alt="일본 국기" /> };
    case "KES": return { koreanName: "케냐", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548413_NJCGKKDGG.png%2F131_p.png%3Ftype%3Dm1500" alt="케냐 국기" /> };
    case "KHR": return { koreanName: "캄보디아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20131030183448848_HA3F4KP7A.png%2Fcambodia_108X81.png%3Ftype%3Dm1500" alt="캄보디아 국기" /> };
    case "KRW": return { koreanName: "대한민국", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551009_GNUFXN9OD.png%2F122_p.png%3Ftype%3Dm1500" alt="대한민국 국기" /> };
    case "KWD": return { koreanName: "쿠웨이트", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552831_CP71M1YEX.png%2F49_p.png%3Ftype%3Dm1500" alt="쿠웨이트 국기" /> };
    case "KZT": return { koreanName: "카자흐스탄", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554851_H3J0HJYDZ.png%2F78_p.png%3Ftype%3Dm1500" alt="카자흐스탄 국기" /> };
    case "LKR": return { koreanName: "스리랑카", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553475_8F5QMC03M.png%2F184_p.png%3Ftype%3Dm1500" alt="스리랑카 국기" /> };
    case "LYD": return { koreanName: "리비아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550023_YSWO1IOBL.png%2F149_p.png%3Ftype%3Dm1500" alt="리비아 국기" /> };
    case "MMK": return { koreanName: "미얀마", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120702113059733_ID1E46WT2.png%2F183.png%3Ftype%3Dm1500" alt="미얀마 국기" /> };
    case "MNT": return { koreanName: "몽골", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552439_Q3X61NFIU.png%2F195_p.png%3Ftype%3Dm1500" alt="몽골 국기" /> };
    case "MOP": return { koreanName: "마카오", Flag: <FlagIcon src="https://i.namu.wiki/i/fFRA3Wr-RqDijkfHwMr80vIOcFU-LXzn8HGH3wJkFqoffqpxSRloi6KbCG2viyABIO-UmWRo9pIjVH1ZOrj-yj3X3lCPzxd7aOHVUUje9OvKuFM7Jc8L1Sv_wj5lw-ZDr0Zs7SbT_wvo0rvF6BZnbw.svg" alt="마카오 국기" /> };
    case "MXN": return { koreanName: "멕시코", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551388_JRXSSBHJL.png%2F143_p.png%3Ftype%3Dm1500" alt="멕시코 국기" /> };
    case "MYR": return { koreanName: "말레이시아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174551184_JS93DBNFQ.png%2F197_p.png%3Ftype%3Dm1500" alt="말레이시아 국기" /> };
    case "NOK": return { koreanName: "노르웨이", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174547704_21EMF0VH3.png%2F165_p.png%3Ftype%3Dm1500" alt="노르웨이 국기" /> };
    case "NPR": return { koreanName: "네팔", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550512_TFIM2EB43.png%2F192_p.png%3Ftype%3Dm1500" alt="네팔 국기" /> };
    case "NZD": return { koreanName: "뉴질랜드", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553896_GY1J8X4WT.png%2F125_p.png%3Ftype%3Dm1500" alt="뉴질랜드 국기" /> };
    case "OMR": return { koreanName: "오만", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552078_5L42JXOFB.png%2F15_p.png%3Ftype%3Dm1500" alt="오만 국기" /> };
    case "PHP": return { koreanName: "필리핀", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556753_HDOZL6S03.png%2F173_p.png%3Ftype%3Dm1500" alt="필리핀 국기" /> };
    case "PKR": return { koreanName: "파키스탄", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556696_07LTJRU62.png%2F181_p.png%3Ftype%3Dm1500" alt="파키스탄 국기" /> };
    case "PLN": return { koreanName: "폴란드", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174549922_0P9LVEN7L.png%2F153_p.png%3Ftype%3Dm1500" alt="폴란드 국기" /> };
    case "QAR": return { koreanName: "카타르", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552812_3H5VXLBTB.png%2F80_p.png%3Ftype%3Dm1500" alt="카타르 국기" /> };
    case "RON": return { koreanName: "루마니아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548779_QJ36UAR76.png%2F30_p.png%3Ftype%3Dm1500" alt="루마니아 국기" /> };
    case "RUB": return { koreanName: "러시아 연방", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174548414_KS3EO8MB0.png%2F163_p.png%3Ftype%3Dm1500" alt="러시아 연방 국기" /> };
    case "SAR": return { koreanName: "사우디아라비아", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174550747_2STAZOIU8.png%2F187_p.png%3Ftype%3Dm1500" alt="사우디아라비아 국기" /> };
    case "SEK": return { koreanName: "스웨덴", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552725_ZT1F6YTQU.png%2F169_p.png%3Ftype%3Dm1500" alt="스웨덴 국기" /> };
    case "SGD": return { koreanName: "싱가포르", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174553547_H00G337AF.png%2F182_p.png%3Ftype%3Dm1500" alt="싱가포르 국기" /> };
    case "THB": return { koreanName: "태국", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556521_16O07H1HB.png%2F186_p.png%3Ftype%3Dm1500" alt="태국 국기" /> };
    case "TRY": return { koreanName: "튀르키예", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552925_C9G8JVOMN.png%2F179_p.png%3Ftype%3Dm1500" alt="튀르키예 국기" /> };
    case "TWD": return { koreanName: "대만", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174556566_E8THO6KAI.png%2F180_p.png%3Ftype%3Dm1500" alt="대만 국기" /> };
    case "USD": return { koreanName: "미국", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174547033_D0O1SER5Z.png%2F155_p.png%3Ftype%3Dm1500" alt="미국 국기" /> };
    case "UZS": return { koreanName: "우즈베키스탄", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174554616_A6S6UIIM9.png%2F70_p.png%3Ftype%3Dm1500" alt="우즈베키스탄 국기" /> };
    case "VND": return { koreanName: "베트남", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174552951_9JTGQEH3Y.png%2F188_p.png%3Ftype%3Dm1500" alt="베트남 국기" /> };
    case "ZAR": return { koreanName: "남아프리카 공화국", Flag: <FlagIcon src="https://search.pstatic.net/common?type=o&size=108x81&quality=75&direct=true&src=http%3A%2F%2Fdbscthumb.phinf.naver.net%2F1230_000_1%2F20120625174549130_UJ65GJUYX.png%2F145_p.png%3Ftype%3Dm1500" alt="남아프리카 공화국 국기" /> };

    // 필요한 다른 통화 코드 추가
    default: return { koreanName: "알 수 없음", Flag: <FlagIcon src="" alt="알 수 없는 국기" /> }; // 알 수 없는 통화
  }
};



/**
 * 환율 카드 컴포넌트 Props (수입/수출 정보를 담는 ConsolidatedExchangeRate 타입에 맞춰 수정)
 */
type ExchangeRateCardProps = {
  currencyCode: string;
  koreanName: string;
  Flag: ReactNode;
  importRate: {
    currencyName: string;
    exchangeRate: number;
    lastUpdated: string;
  } | null;
  exportRate: {
    currencyName: string;
    exchangeRate: number;
    lastUpdated: string;
  } | null;
} & FlagAndKoreanName;

function ExchangeRateCard({
  currencyCode,
  koreanName,
  Flag,
  importRate,
  exportRate,
}: ExchangeRateCardProps) {
  // 마지막 업데이트 시간은 수입 또는 수출 데이터 중 하나라도 있으면 가져옴
  const lastUpdated = importRate?.lastUpdated || exportRate?.lastUpdated || "";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className=" w-full flex items-center justify-center">
          <div className="flex gap-x-3 h-fit justify-center items-center gap-2">
            <div className="items-center justify-center">{Flag}</div>
            <div>{koreanName}</div>
            <CardTitle className="text-lg">{currencyCode}</CardTitle>
          </div>
          {/* 개별 통화명 배지는 이제 각 수입/수출 섹션 내부에 표시됩니다. */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 수입 환율 섹션 */}
          {importRate && (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">
                  수입{" "}
                  <Badge variant="outline" className="text-xs">
                    {importRate.currencyName}
                  </Badge>
                </span>
                <div className="text-xl font-bold text-gray-900">
                  ₩{importRate.exchangeRate.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm justify-end">
                {/* changeRate가 0이 아닌 경우에만 아이콘 및 색상 표시 */}
              </div>
            </div>
          )}

          {/* 수출 환율 섹션 */}
          {exportRate && (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">
                  수출{" "}
                  <Badge variant="outline" className="text-xs">
                    {exportRate.currencyName}
                  </Badge>
                </span>
                <div className="text-xl font-bold text-gray-900">
                  ₩{exportRate.exchangeRate.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm justify-end">
                {/* changeRate가 0이 아닌 경우에만 아이콘 및 색상 표시 */}
              </div>
            </div>
          )}

          {/* 마지막 업데이트 시간 */}
          {lastUpdated && (
            <div className="text-xs text-gray-500">
              기준 시간: {new Date(lastUpdated).toLocaleString("ko-KR")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 환율 정보 페이지 컴포넌트
 */
function ExchangeRatesPage() {
  const { data: exchangeRates, isLoading, error } = useQuery({
    queryKey: ["exchange_rate"],
    queryFn: () => exchangeRatesApi.getExchangeRates(),
  });

  // 백엔드에서 받은 데이터를 ConsolidatedExchangeRate 형태로 가공하는 메모이제이션된 함수
  const consolidatedRates: ExchangeRateCardProps[] = React.useMemo(() => {
    if (!exchangeRates) return [];

    const map = new Map<string, ExchangeRateCardProps>();

    // 각 환율 데이터를 순회하며 통화 코드별로 그룹화
    exchangeRates.forEach((rate) => {
      const { currencyCode, currencyName } = rate;
      let consolidated = map.get(currencyCode);

      // 해당 통화 코드가 맵에 없으면 새로운 통합 객체 생성
      if (!consolidated) {
        const { Flag: flag, koreanName } = getFlagByCurrencyCode(currencyCode);
        consolidated = {
          currencyCode,
          koreanName,
          Flag: flag,
          importRate: null,
          exportRate: null,
        };
        map.set(currencyCode, consolidated);
      }

      // currencyName에 따라 수입 또는 수출 정보 할당
      if (currencyName.includes("(수입)")) {
        consolidated.importRate = {
          currencyName: currencyName,
          exchangeRate: rate.exchangeRate,
          lastUpdated: rate.lastUpdated,
        };
      } else if (currencyName.includes("(수출)")) {
        consolidated.exportRate = {
          currencyName: currencyName,
          exchangeRate: rate.exchangeRate,
          lastUpdated: rate.lastUpdated,
        };
      }
    });

    // 맵의 값들을 배열로 변환하여 반환
    return Array.from(map.values());
  }, [exchangeRates]); // exchangeRates 데이터가 변경될 때만 다시 계산

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-700">
        환율 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        오류: {error.message}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">실시간 환율</h1>
          <p className="text-gray-600">
            주요 통화의 현재 환율을 확인하세요
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* 통합된 환율 데이터를 사용하여 ExchangeRateCard 렌더링 */}
        {consolidatedRates.length > 0 ? (
          consolidatedRates.map((rate) => (
            <ExchangeRateCard
              key={rate.currencyCode} // 통화 코드를 기준으로 key 설정 (이제 각 통화별 카드는 하나뿐이므로)
              currencyCode={rate.currencyCode}
              koreanName={rate.koreanName}
              Flag={rate.Flag}
              importRate={rate.importRate}
              exportRate={rate.exportRate}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            표시할 환율 정보가 없습니다.
          </div>
        )}
      </div>

      {/* 환율 정보 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            환율 정보 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-medium">• 기준 통화:</span>
              <span>원화(KRW) 기준 외국환 매매기준율</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 업데이트:</span>
              <span>매일 자정 업데이트되며, 영업일 기준으로 제공됩니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 활용:</span>
              <span>무역 거래 시 참고용으로 활용하시기 바랍니다</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
