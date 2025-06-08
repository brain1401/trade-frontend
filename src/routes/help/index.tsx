import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Book, HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";

export const Route = createFileRoute("/help/")({
  component: RouteComponent,
});

const helpSections = [
  {
    title: "HS Code 검색 방법",
    icon: <Book className="h-6 w-6" />,
    description: "HS Code를 효율적으로 검색하고 분류하는 방법을 안내합니다.",
    items: [
      "키워드 검색 활용법",
      "카테고리별 탐색 방법",
      "유사 품목 비교 기능",
      "즐겨찾기 관리하기",
    ],
  },
  {
    title: "무역 규제 정보",
    icon: <HelpCircle className="h-6 w-6" />,
    description: "최신 무역 규제 및 변경사항에 대한 정보를 제공합니다.",
    items: [
      "수출입 금지/제한 품목",
      "관세율 변경 알림",
      "원산지 규정 안내",
      "FTA 활용 가이드",
    ],
  },
  {
    title: "통계 및 분석",
    icon: <MessageSquare className="h-6 w-6" />,
    description: "무역 통계 데이터 해석 및 활용 방법을 설명합니다.",
    items: [
      "수출입 동향 분석",
      "시장 점유율 확인",
      "경쟁사 분석 도구",
      "예측 데이터 활용법",
    ],
  },
];

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col justify-center space-y-3">
      {/* 도움말 섹션들 */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {helpSections.map((section, index) => (
          <Card
            key={index}
            className="shadow-lg transition-shadow hover:shadow-xl last:odd:md:col-span-2"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-brand-700">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-2 text-gray-600">{section.description}</p>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 자주 묻는 질문 */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-brand-700">
            자주 묻는 질문
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Q. HS Code 검색이 정확하지 않은 경우는?
            </h3>
            <p className="text-gray-600">
              다양한 키워드로 재검색을 시도하거나, 유사 품목 비교 기능을 활용해
              보세요.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Q. 무역 규제 정보는 얼마나 자주 업데이트되나요?
            </h3>
            <p className="text-gray-600">
              하루마다 변동사항을 감지하여 알림을 보내드립니다.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Q. 통계 데이터의 출처는 어디인가요?
            </h3>
            <p className="text-gray-600">
              관세청, 한국무역협회 등 공신력 있는 기관의 공식 데이터를 활용하고
              있습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 연락처 정보 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-brand-700">
              <Phone className="h-6 w-6" />
              전화 문의
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-2 text-2xl font-bold text-gray-800">1588-0000</p>
            <p className="text-gray-600">평일 09:00 - 18:00</p>
            <p className="text-gray-600">점심시간 12:00 - 13:00</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-brand-700">
              <Mail className="h-6 w-6" />
              이메일 문의
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-2 text-lg font-semibold text-gray-800">
              support@tradegenie.com
            </p>
            <p className="mb-2 text-gray-600">24시간 접수 가능</p>

            <Link className="bg-brand-700 hover:bg-brand-800" to="/support">
              문의하기
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
