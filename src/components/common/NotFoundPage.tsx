import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 정의되지 않은 경로 접근 시 표시되는 404 페이지 컴포넌트
 *
 * 사용자에게 명확한 안내와 네비게이션 옵션 제공
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-8 text-center">
          {/* 404 아이콘 및 숫자 */}
          <div className="space-y-2">
            <div className="text-6xl font-bold text-primary-600">404</div>
            <h1 className="text-xl font-semibold text-neutral-800">
              페이지를 찾을 수 없습니다
            </h1>
          </div>

          {/* 설명 메시지 */}
          <div className="space-y-2">
            <p className="text-sm text-neutral-600">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
            <p className="text-xs text-neutral-500">
              URL을 다시 확인하거나 아래 버튼을 통해 이동해보세요.
            </p>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/">홈으로 돌아가기</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              이전 페이지로
            </Button>
          </div>

          {/* 추가 도움말 */}
          <div className="border-t border-neutral-200 pt-4">
            <p className="text-xs text-neutral-400">
              문제가 지속되면 관리자에게 문의해주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
