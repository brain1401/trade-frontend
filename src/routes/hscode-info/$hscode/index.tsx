import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, FileText, Globe, LinkIcon } from "lucide-react";

export const Route = createFileRoute("/hscode-info/$hscode/")({
  component: HSCodeDetailPage,
});

/**
 * HS Code 상세 정보 페이지 컴포넌트
 *
 * 특정 HS Code에 대한 상세 정보, 분류 기준, 해설서 내용,
 * 관련 사례 및 참고 자료를 제공하는 페이지
 *
 * @returns HS Code 상세 정보 페이지 JSX 엘리먼트
 */
function HSCodeDetailPage() {
  const { hscode } = Route.useParams();

  // HS Code 관련 정보 구성
  const hsCodeInfo = {
    /** 전체 HS Code */
    fullCode: hscode,
    /** 6자리 기본 HS Code (앞 6자리) */
    baseCode: hscode.substring(0, 6),
    /** 호(章) 번호 (앞 4자리) */
    chapterCode: hscode.substring(0, 4),
  };

  // 예시 데이터 - 실제로는 API에서 가져올 데이터
  const hsCodeData = {
    /** HS Code 분류명 */
    classification: "전기기기 및 그 부분품",
    /** 상세 설명 */
    description: "무선통신기기, 방송용 송신기기 및 텔레비전 카메라",
    /** 주요 적용 품목들 */
    applicableItems: ["휴대전화", "스마트폰", "무선통신기기", "방송장비"],
    /** 분류 원칙 */
    classificationPrinciple: "주된 기능에 따른 분류",
    /** 관련 GRI (General Rules for Interpretation) */
    relatedGRI: "GRI 3(b) - 주된 기능의 원칙",
  };

  // 참고 자료 링크
  const referenceLinks = [
    {
      title: `관세법령정보포털 - HS 해설서 (제${hsCodeInfo.chapterCode}호)`,
      description: `HS Code 제${hsCodeInfo.chapterCode}호에 대한 공식 해설서입니다.`,
      icon: LinkIcon,
      iconColor: "text-blue-500",
      url: "#",
    },
    {
      title: "WCO 품목분류 의견서 (Classification Opinion)",
      description: "해당 분류에 대한 세계관세기구(WCO)의 공식 의견서입니다.",
      icon: FileText,
      iconColor: "text-green-600",
      url: "#",
    },
  ];

  return (
    <div className="flex-1 bg-slate-50 p-5 font-sans antialiased">
      {/* 페이지 헤더 */}
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-5xl font-bold text-slate-800">
          HS Code {hsCodeInfo.fullCode}
        </h1>
      </div>

      {/* 메인 콘텐츠 카드 */}
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="p-6 sm:p-8 md:p-10">
          <header className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              HS Code 상세 정보
            </h2>
            <p className="mt-2 text-slate-500">
              해당 HS Code의 분류 기준과 적용 범위에 대한 상세 정보입니다.
            </p>
          </header>

          <main className="space-y-10">
            {/* 품목 해설 섹션 */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-700">
                1. 품목 해설 (Explanatory Notes)
              </h3>
              <div className="prose prose-slate max-w-none leading-relaxed text-slate-600">
                <p>
                  <strong>HS Code {hsCodeInfo.baseCode}</strong>의 공식 해설에
                  따르면 이 코드는 '{hsCodeData.description}'을 포함합니다. 주요
                  적용 대상 품목으로는{" "}
                  {hsCodeData.applicableItems.map((item, index) => (
                    <span key={item}>
                      <strong>{item}</strong>
                      {index < hsCodeData.applicableItems.length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))}{" "}
                  등이 있습니다.
                </p>
              </div>
            </div>

            {/* 분류 원칙 섹션 */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-700">
                2. {hsCodeData.relatedGRI}
              </h3>
              <div className="prose prose-slate max-w-none leading-relaxed text-slate-600">
                <p>
                  여러 기능이 결합된 복합기기의 경우{" "}
                  <strong>물품의 본질적인 특성을 부여하는 주된 기능</strong>에
                  따라 분류됩니다. {hsCodeData.classificationPrinciple}을
                  적용하여 해당 품목의 가장 중요한 기능과 용도를 고려해{" "}
                  <strong>제{hsCodeInfo.chapterCode}호</strong>에 분류합니다.
                </p>
              </div>
            </div>

            {/* 관련 분류 사례 섹션 */}
            <div>
              <h3 className="mb-3 text-xl font-semibold text-slate-700">
                3. 관련 분류 사례 (Classification Rulings)
              </h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">
                  분류 기준 적용 사례
                </p>
                <p className="mt-2 text-slate-600">
                  과거 분류 사례를 보면, 유사한 기능을 가진 제품들도 주된 기능과
                  용도에 따라 동일한 HS Code로 분류됩니다. 이는 제품의 외형이나
                  부가 기능보다는
                  <strong>핵심 기능과 주된 용도</strong>가 분류의 결정적
                  기준임을 보여주는 중요한 근거입니다.
                </p>
              </div>
            </div>

            {/* 신뢰할 수 있는 출처 섹션 */}
            <div className="mt-12">
              <h3 className="mb-4 text-xl font-semibold text-slate-700">
                참고 자료 및 출처
              </h3>
              <div className="space-y-3">
                {referenceLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="flex items-center rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                  >
                    <link.icon
                      className={`mr-4 h-5 w-5 flex-shrink-0 ${link.iconColor}`}
                    />
                    <div>
                      <p className="font-medium text-slate-800">{link.title}</p>
                      <p className="text-sm text-slate-500">
                        {link.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </main>

          {/* 관련 통계 바로가기 푸터 */}
          <footer className="mt-12 border-t border-slate-200 pt-8">
            <h3 className="mb-5 text-xl font-semibold text-slate-700">
              관련 통계 바로가기
            </h3>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none sm:w-auto"
              >
                <BarChart3 className="h-5 w-5" />
                <span>국가별 수출입 통계</span>
              </button>
              <button
                type="button"
                className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-slate-600 px-6 py-3 font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-slate-700 focus:ring-4 focus:ring-slate-300 focus:outline-none sm:w-auto"
              >
                <Globe className="h-5 w-5" />
                <span>글로벌 무역 통계</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
