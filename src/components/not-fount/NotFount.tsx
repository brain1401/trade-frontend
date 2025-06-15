import { Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

const PAGE_BUTTON_CLASSES = "transition-shadow hover:shadow-md";

const PAGE_BUTTON_CONTENT_CLASSES = "text-center text-blue-500";

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-4xl">
        {/* 404 메인 콘텐츠 */}
        <Card className="mx-auto w-full max-w-2xl shadow-lg">
          <CardContent className="space-y-4 py-5 text-center">
            {/* 404 아이콘 */}
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-brand-50">
              <span className="text-6xl font-bold text-brand-700">404</span>
            </div>

            {/* 에러 메시지 */}
            <h1 className="text-4xl leading-relaxed font-bold">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-lg leading-relaxed text-gray-600">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              <br />
              주소를 다시 확인해 주시거나 아래 버튼을 통해 이동해 주세요.
            </p>

            {/* 액션 버튼들 */}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
              <Button
                asChild
                className="bg-brand-700 px-8 py-3 text-lg hover:bg-brand-800"
              >
                <Link to="/">
                  <Home size={20} className="mr-2" />
                  홈으로 돌아가기
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="border-brand-700 px-8 py-3 text-lg text-brand-700 hover:bg-brand-50"
              >
                <Link to="/help">
                  <HelpCircle size={20} className="mr-2" />
                  도움말
                </Link>
              </Button>
            </div>

            {/* 추가 도움말 */}
            <div className="text-sm text-gray-500">
              <p>계속해서 문제가 발생한다면</p>
              <Button
                variant="link"
                asChild
                className="h-auto p-0 text-blue-600 hover:underline"
              >
                <Link to="/support">고객센터에 문의</Link>
              </Button>
              <span>해 주세요.</span>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 링크 섹션 */}
        <div>
          <h2 className="my-5 text-center text-2xl leading-relaxed font-semibold text-gray-800">
            자주 찾는 페이지
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/regulations">
              <Card className={PAGE_BUTTON_CLASSES}>
                <CardContent className={PAGE_BUTTON_CONTENT_CLASSES}>
                  최신 규제
                </CardContent>
              </Card>
            </Link>

            <Link to="/trade/statistics">
              <Card className={PAGE_BUTTON_CLASSES}>
                <CardContent className={PAGE_BUTTON_CONTENT_CLASSES}>
                  무역 통계
                </CardContent>
              </Card>
            </Link>

            <Link to="/country-info">
              <Card className={PAGE_BUTTON_CLASSES}>
                <CardContent className={PAGE_BUTTON_CONTENT_CLASSES}>
                  국가별 정보
                </CardContent>
              </Card>
            </Link>

            <Link to="/statistics">
              <Card className={PAGE_BUTTON_CLASSES}>
                <CardContent className={PAGE_BUTTON_CONTENT_CLASSES}>
                  품목별 통계
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
