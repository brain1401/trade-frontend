import { Button } from "@/components/ui/button";
import ContentCard from "@/components/common/ContentCard";
import { Home, RefreshCw, Search } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

const NotFound = () => {
  const router = useRouter();

  // 이전 페이지로 이동 또는 홈으로 이동 처리
  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  // 홈으로 이동 처리
  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  // 페이지 새로고침 처리
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* 메인 레이아웃: THEME_GUIDE.md의 2/3 + 1/3 비율 적용 */}
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          <ContentCard title="페이지를 찾을 수 없음" className="shadow-lg">
            <div className="space-y-6 text-center">
              {/* 404 큰 숫자 표시 */}
              <div className="space-y-2">
                <div className="text-6xl font-bold text-neutral-300 md:text-8xl">
                  404
                </div>
                <h1 className="text-2xl font-semibold text-neutral-800 md:text-3xl">
                  페이지를 찾을 수 없습니다
                </h1>
              </div>

              {/* 설명 텍스트 */}
              <div className="space-y-2">
                <p className="text-neutral-600">
                  요청하신 페이지가 존재하지 않거나 이동되었습니다.
                </p>
                <p className="text-sm text-neutral-500">
                  URL을 다시 확인하거나 아래 버튼을 통해 다른 페이지로 이동해
                  주세요.
                </p>
              </div>

              {/* 액션 버튼들 - THEME_GUIDE.md의 버튼 시스템 적용 */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleGoHome}
                  className="flex items-center justify-center bg-primary-600 text-white hover:bg-primary-700"
                >
                  <Home size={16} className="mr-1.5" />
                  홈으로 이동
                </Button>

                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex items-center justify-center border-neutral-300 bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                >
                  <RefreshCw size={16} className="mr-1.5" />
                  이전 페이지
                </Button>

                <Button
                  onClick={handleRefresh}
                  variant="ghost"
                  className="flex items-center justify-center text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                >
                  <RefreshCw size={16} className="mr-1.5" />
                  새로고침
                </Button>
              </div>
            </div>
          </ContentCard>
        </div>

        {/* 사이드바 영역 - THEME_GUIDE.md의 사이드바 패턴 적용 */}
        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          <ContentCard title="도움말" className="shadow-sm">
            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-800">
                  자주 찾는 페이지
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-primary-600 hover:underline"
                      onClick={() => router.navigate({ to: "/hscode" })}
                    >
                      HS Code 분석
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-primary-600 hover:underline"
                      onClick={() => router.navigate({ to: "/tracking" })}
                    >
                      화물 추적
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-primary-600 hover:underline"
                      onClick={() => router.navigate({ to: "/dashboard" })}
                    >
                      마이 대시보드
                    </Button>
                  </li>
                </ul>
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <p className="text-xs text-neutral-500">
                  문제가 지속되면 브라우저 캐시를 삭제하거나 다른 브라우저를
                  사용해 보세요.
                </p>
              </div>
            </div>
          </ContentCard>

          {/* 검색 카드 */}
          <ContentCard title="빠른 검색" className="mt-8">
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">
                원하는 정보를 검색해 보세요
              </p>
              <Button
                onClick={() => router.navigate({ to: "/" })}
                variant="outline"
                className="flex w-full items-center justify-center border-neutral-300 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
              >
                <Search size={16} className="mr-1.5" />
                검색하러 가기
              </Button>
            </div>
          </ContentCard>
        </aside>
      </div>
    </div>
  );
};

export default NotFound;
