import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ContentCard from "@/components/common/ContentCard";
import {
  Bookmark,
  Share2,
  ExternalLink,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  Scale,
  FileText,
  Award,
} from "lucide-react";
import { mockHSCodeResult } from "@/data/mock/hscode";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hscode/result/$resultId")({
  component: HSCodeResultPage,
}) as any;

function HSCodeResultPage() {
  // 현재는 목업이므로 resultId를 하드코딩으로 설정
  const resultId = "result-8517.12.10";
  const result = mockHSCodeResult;
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="lg:flex lg:space-x-8">
      {/* 메인 콘텐츠 영역 */}
      <div className="space-y-6 lg:w-2/3">
        {/* 헤더 카드 */}
        <Card className="py-0">
          <div className="flex flex-row items-center justify-between border-b p-4">
            <div>
              <h1 className="!mt-0 text-lg font-semibold text-neutral-800">
                HS Code 분석 결과
              </h1>
              <p className="text-xs text-neutral-500">결과 ID: {resultId}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={isBookmarked ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark size={16} className="mr-1" />
                북마크
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-1" />
                공유
              </Button>
            </div>
          </div>

          <div className="p-4">
            {/* 기본 정보 */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-800">
                  {result.hscode}
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="text-sm">
                    신뢰도 {result.confidence}%
                  </Badge>
                  <CheckCircle2 size={20} className="text-success-500" />
                </div>
              </div>
              <p className="mb-3 text-lg text-neutral-700">
                {result.description}
              </p>
              <p className="text-sm text-neutral-500">
                분류: {result.category}
              </p>
            </div>

            {/* 기본 분류 정보 */}
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-4">
              <div>
                <p className="mb-1 text-xs text-neutral-500">챕터</p>
                <p className="font-medium">{result.basicInfo.chapter}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-neutral-500">헤딩</p>
                <p className="font-medium">{result.basicInfo.heading}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-neutral-500">한글명</p>
                <p className="font-medium">{result.basicInfo.koranName}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-neutral-500">영문명</p>
                <p className="font-medium">{result.basicInfo.englishName}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 분류 근거 카드 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <div className="flex items-center space-x-2">
              <Scale size={20} className="text-primary-600" />
              <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
                분류 근거 및 판단 기준
              </h3>
            </div>
          </div>
          <div className="p-4">
            {/* 주요 분류 근거 */}
            <div className="mb-6 rounded-lg border-l-4 border-primary-500 bg-primary-50 p-4">
              <h4 className="mb-2 font-semibold text-primary-800">
                주요 분류 근거
              </h4>
              <p className="text-sm text-primary-700">
                {result.classificationBasis.primaryReason}
              </p>
            </div>

            {/* 핵심 판단 요소 */}
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-neutral-800">
                핵심 판단 요소
              </h4>
              <div className="space-y-3">
                {result.classificationBasis.keyFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 rounded-lg border border-neutral-200 p-3"
                  >
                    <div className="flex-shrink-0">
                      <Badge
                        variant={
                          factor.weight === "높음"
                            ? "default"
                            : factor.weight === "보통"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {factor.weight}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-neutral-800">
                        {factor.factor}
                      </h5>
                      <p className="mt-1 text-sm text-neutral-600">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 제외된 분류 */}
            <div>
              <h4 className="mb-3 font-semibold text-neutral-800">
                제외된 분류
              </h4>
              <div className="space-y-2">
                {result.classificationBasis.excludedCategories.map(
                  (excluded, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 rounded-lg bg-neutral-50 p-3"
                    >
                      <div className="flex-shrink-0">
                        <AlertCircle
                          size={16}
                          className="mt-0.5 text-neutral-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-neutral-700">
                          {excluded.category}
                        </h5>
                        <p className="mt-1 text-sm text-neutral-500">
                          {excluded.reason}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 수출입 요건 카드 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-danger-600" />
              <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
                수출입 요건 및 인증
              </h3>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {result.requirements.map((req, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-200 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {req.mandatory ? (
                        <Shield size={16} className="text-danger-500" />
                      ) : (
                        <Clock size={16} className="text-warning-500" />
                      )}
                      <h4 className="font-medium">{req.title}</h4>
                    </div>
                    <Badge
                      variant={req.mandatory ? "destructive" : "secondary"}
                    >
                      {req.mandatory ? "필수" : "권장"}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-neutral-600">
                    {req.description}
                  </p>
                  <p className="text-xs text-neutral-500">
                    담당기관: {req.agency}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 관련 규제 카드 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-warning-600" />
              <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
                최신 규제 및 뉴스
              </h3>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {result.regulations.map((reg, index) => (
                <div
                  key={index}
                  className="rounded-r-lg border-l-4 border-warning-300 bg-warning-50 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-medium text-warning-800">
                      {reg.title}
                    </h4>
                    <Badge
                      variant={
                        reg.impact === "high" ? "destructive" : "secondary"
                      }
                    >
                      {reg.impact === "high" ? "중요" : "일반"}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-warning-700">{reg.summary}</p>
                  <div className="flex items-center justify-between text-xs text-warning-600">
                    <span>출처: {reg.source}</span>
                    <span>{reg.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 무역 통계 카드 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-info-600" />
              <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
                무역 통계
              </h3>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-info-50 p-4 text-center">
                <TrendingUp size={24} className="mx-auto mb-2 text-info-600" />
                <p className="mb-1 text-xs text-info-600">연간 수출량</p>
                <p className="text-xl font-bold text-info-800">
                  {result.tradeStatistics.exportVolume.toLocaleString()}
                </p>
                <p className="text-xs text-info-600">개</p>
              </div>
              <div className="rounded-lg bg-success-50 p-4 text-center">
                <TrendingUp
                  size={24}
                  className="mx-auto mb-2 text-success-600"
                />
                <p className="mb-1 text-xs text-success-600">연간 수입량</p>
                <p className="text-xl font-bold text-success-800">
                  {result.tradeStatistics.importVolume.toLocaleString()}
                </p>
                <p className="text-xs text-success-600">개</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="mb-2 font-medium">평균 단가</h4>
              <p className="text-2xl font-bold text-primary-600">
                ${result.tradeStatistics.averagePrice}
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-medium">주요 교역국</h4>
              <div className="flex flex-wrap gap-2">
                {result.tradeStatistics.majorPartners.map((country, index) => (
                  <Badge key={index} variant="outline">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 참고 출처 카드 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <div className="flex items-center space-x-2">
              <Award size={20} className="text-primary-600" />
              <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
                신뢰할 수 있는 참고 출처
              </h3>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {result.sources.map((source, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-200 p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="mb-1 font-medium text-neutral-800">
                        {source.title}
                      </h4>
                      <div className="mb-2 flex items-center space-x-2">
                        <Badge
                          variant={
                            source.reliability === "high"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {source.reliability === "high"
                            ? "신뢰도 높음"
                            : "신뢰도 보통"}
                        </Badge>
                        <span className="text-xs text-neutral-500">
                          {source.documentType}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {source.citationDate}
                        </span>
                      </div>
                    </div>
                    <ExternalLink
                      size={16}
                      className="ml-2 flex-shrink-0 text-neutral-400"
                    />
                  </div>

                  <div className="mb-3 rounded-lg border-l-2 border-neutral-300 bg-neutral-50 p-3">
                    <p className="text-sm leading-relaxed text-neutral-700">
                      "{source.snippet}"
                    </p>
                  </div>

                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-primary-600 hover:underline"
                    asChild
                  >
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      원문 보기 →
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 사이드바 */}
      <div className="mt-8 space-y-6 lg:mt-0 lg:w-1/3">
        {/* 빠른 액션 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              빠른 액션
            </h3>
          </div>
          <div className="space-y-2 p-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link
                to="/hscode/analyze/$sessionId"
                params={{ sessionId: "new-session" }}
              >
                새로운 분석 시작
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/tracking/search">화물 추적하기</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/search/results" search={{ q: result.hscode }}>
                관련 뉴스 검색
              </Link>
            </Button>
          </div>
        </Card>

        {/* 모니터링 설정 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              모니터링 설정
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">규제 변경 알림</span>
                <Button variant="outline" size="sm">
                  활성화
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">관세율 변동 알림</span>
                <Button variant="outline" size="sm">
                  활성화
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">뉴스 업데이트 알림</span>
                <Button variant="outline" size="sm">
                  비활성화
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 관련 HS Code */}
        <Card className="py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              유사한 HS Code
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <Button
                variant="link"
                className="h-auto justify-start p-0 text-sm text-primary-600 hover:underline"
                asChild
              >
                <Link
                  to="/hscode/result/$resultId"
                  params={{ resultId: "result-8517.11" }}
                >
                  8517.11 - 일반 휴대폰
                </Link>
              </Button>
              <Button
                variant="link"
                className="h-auto justify-start p-0 text-sm text-primary-600 hover:underline"
                asChild
              >
                <Link
                  to="/hscode/result/$resultId"
                  params={{ resultId: "result-8517.13" }}
                >
                  8517.13 - 스마트워치
                </Link>
              </Button>
              <Button
                variant="link"
                className="h-auto justify-start p-0 text-sm text-primary-600 hover:underline"
                asChild
              >
                <Link
                  to="/hscode/result/$resultId"
                  params={{ resultId: "result-8517.18" }}
                >
                  8517.18 - 기타 통신기기
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
