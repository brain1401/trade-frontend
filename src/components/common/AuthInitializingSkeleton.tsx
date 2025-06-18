/**
 * 인증 상태 초기화 중 표시되는 스켈레톤 UI 컴포넌트
 *
 * 사용자에게 앱이 정상적으로 로딩 중임을 알려주는 시각적 피드백 제공
 * 전체 화면을 차단하지 않고 콘텐츠 영역에만 표시됨
 */
export function AuthInitializingSkeleton() {
  return (
    <div className="flex animate-pulse flex-col space-y-6 p-6">
      {/* 상단 헤더 영역 스켈레톤 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-3 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="h-8 w-16 rounded bg-gray-200"></div>
          <div className="h-8 w-16 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 스켈레톤 */}
      <div className="space-y-4">
        <div className="h-6 w-1/3 rounded bg-gray-200"></div>
        <div className="space-y-3">
          <div className="h-4 rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* 카드 형태 콘텐츠 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-3 rounded-lg border p-4">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            <div className="h-20 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>

      {/* 로딩 상태 표시 */}
      <div className="flex items-center justify-center space-x-2 text-gray-500">
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-r-transparent"></div>
        <span className="text-sm">인증 상태 확인 중...</span>
      </div>
    </div>
  );
}
