import InsideData from "@/components/faq/InsideData";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/faq/")({
  component: RouteComponent,
});

type InsideDataData = {
  id: string;
  title: string;
  description: Description[];
  isActive: boolean;
}[];

export type Description = {
  question: string;
  answer: string;
}

function RouteComponent() {
  const [insideData, setInsideData] = useState<InsideDataData>([
    {
      id: "1",
      title: "무역",
      description: [
        { question: "통관 절차에 대해 알고 있나요?", answer: "통관 절차는 수출입 물품이 세관을 통과하는 과정으로, 필요한 서류를 제출하고 관세를 납부하는 절차입니다." },
        { question: "무역 시 필수 서류가 있나요?", answer: "계약서, 상업송장, 포장명세서, 운송 서류, 원산지증명서, 보험증서 등의 필수 서류를 요구합니다." },
        { question: "수입금지 품목이나 수출 제한 상품은 어디서 확인하나요?", answer: "관세청 ‘수출입요건확인’ 시스템, 무역협회 ‘트레이드넷’, 산업통상자원부 전략물자관리원 그리고 식약처, 농림축산검역본부 등 관련 부처가 있습니다." },
        { question: "FTA(자유무역협정) 활용 방법이 있나요?", answer: "FTA는 국가 간 협정이므로, 먼저 수출입 대상국과 한국이 FTA를 체결했는지 확인해야 하며 제품의 정확한 HS코드(품목 분류 코드)가 필요합니다. 해당 제품이 협정에 따른 원산지 기준을 충족해야 합니다." },
        { question: "HS 코드란 무엇이고, 어떻게 확인하나요?", answer: "관세청 유니패스, 한국무역정보통신(KTNET), 세계 HS 코드 조회용 사이트 등을 참고해 볼 수 있습니다." },
      ],
      isActive: true,
    },

    {
      id: "2",
      title: "환율",
      description: [
        { question: "환율이란 무엇인가요?", answer: "환율은 한 나라의 통화가 다른 나라의 통화로 교환되는 비율을 의미합니다." },
        { question: "환율 변동의 원인은 무엇인가요?", answer: "환율은 경제 지표, 정치적 안정성, 금리 차이 등 다양한 요인에 의해 영향을 받습니다." },
        { question: "환율을 어떻게 확인할 수 있나요?", answer: "한국은행, 외환은행, 금융감독원 등의 공식 웹사이트에서 실시간 환율 정보를 확인할 수 있습니다." },
        { question: "환전 수수료는 어떻게 계산되나요?", answer: "환전 수수료는 환전 금액의 일정 비율로 계산되며, 은행이나 환전소마다 다를 수 있습니다." },
        { question: "환율 예측 방법이 있나요?", answer: "경제 뉴스, 전문가 의견, 기술적 분석 등을 통해 환율을 예측할 수 있습니다." },
      ],
      isActive: false,
    },

    {
      id: "3",
      title: "세관",
      description: [
        { question: "세관의 역할은 무엇인가요?", answer: "세관은 수출입 물품의 통관, 세금 징수, 불법 물품 단속 등의 역할을 수행합니다." },
        { question: "세관 신고는 어떻게 하나요?", answer: "전자통관시스템(UNI-PASS)을 통해 온라인으로 신고할 수 있으며, 필요한 서류를 제출해야 합니다." },
        { question: "세관 검사란 무엇인가요?", answer: "세관 검사는 수출입 물품이 법규에 적합한지 확인하기 위한 절차로, 샘플링 검사나 전수 검사가 있습니다." },
        { question: "세관에서 요구하는 서류는 무엇인가요?", answer: "상업송장, 포장명세서, 운송서류, 원산지증명서 등이 필요합니다." },
        { question: "세관 벌금이나 과태료는 어떻게 부과되나요?", answer: "법규 위반 시 세관에서 벌금이나 과태료를 부과하며, 금액은 위반 내용에 따라 다릅니다." },
      ],
      isActive: false,
    },

    {
      id: "4",
      title: "A/S",
      description: [
        { question: "A/S 신청은 어떻게 하나요?", answer: "제조사나 판매자의 고객센터를 통해 A/S를 신청할 수 있습니다." },
        { question: "A/S 보증 기간은 어떻게 되나요?", answer: "제품마다 다르지만 일반적으로 1년에서 2년 사이입니다." },
        { question: "A/S 비용은 어떻게 되나요?", answer: "보증 기간 내에는 무료로 제공되며, 이후에는 유상으로 처리될 수 있습니다." },
        { question: "A/S 진행 기간은 얼마나 걸리나요?", answer: "일반적으로 1주일에서 2주일 정도 소요됩니다." },
        { question: "A/S 서비스 센터는 어디에 있나요?", answer: "제조사 공식 웹사이트나 고객센터에서 가까운 서비스 센터를 찾을 수 있습니다." },
      ],
      isActive: false,
    },

    {
      id: "5",
      title: "  기타",
      description: [
        { question: "관세청 유니패스 시스템은 무엇인가요?", answer: "유니패스란 수출입 통관, 관세 환급, 선박·항공기 입출항 및 출입국 여행자 관리 등은 물론 보세화물 추적 관리와 수출입에 필요한 요건확인까지도 세관신고로 통합(Uni)하여 원스톱 처리(Pass)가 가능한 관세청의 전자통관 포탈시스템입니다." },
        { question: "무역 관련 법률은 어디서 확인하나요?", answer: "산업통상자원부, 관세청, 무역협회 등의 공식 웹사이트에서 관련 법률을 확인할 수 있습니다." },
        { question: "무역 관련 뉴스는 어디서 확인하나요?", answer: "한국무역신문, 무역협회 뉴스레터, 경제 전문 매체 등을 통해 최신 뉴스를 확인할 수 있습니다." },
        { question: "무역 관련 교육 프로그램은 어디서 찾을 수 있나요?", answer: "무역협회, KOTRA, 각종 대학 및 전문 교육 기관에서 다양한 교육 프로그램을 제공합니다." },
        { question: "무역 관련 자격증은 어떤 것이 있나요?", answer: "무역영어, 무역관리사, 국제무역사 등의 자격증이 있습니다." },
      ],
      isActive: false,
    }
  ]);

  const handleButtonClick = (id: string) => {
    setInsideData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: true } : { ...item, isActive: false }
      )
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">FAQ</h1>
        <p className="text-gray-600">자주 하는 질문! 아래 내용에서 확인해주세요</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg" onClick={() => handleButtonClick("1")}>무역</button>
        <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg" onClick={() => handleButtonClick("2")}>환율</button>
        <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg" onClick={() => handleButtonClick("3")}>세관</button>
        <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg" onClick={() => handleButtonClick("4")}>A/S</button>
        <button className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg" onClick={() => handleButtonClick("5")}>기타</button>
      </div>

      <div className="w-full flex justify-center">
        {insideData.map((data) => (
          <InsideData
            key={data.id}
            title={data.title}
            descriptions={data.description}
            isActive={data.isActive}
          />
        ))}
      </div>
    </div>
  );
}
