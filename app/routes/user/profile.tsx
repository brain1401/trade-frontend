import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Shield,
  Bell,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const userStats = [
    {
      label: "총 검색 횟수",
      value: "1,247",
      icon: <Eye className="h-5 w-5" />,
    },
    { label: "북마크", value: "34", icon: <Shield className="h-5 w-5" /> },
    { label: "분석 이력", value: "89", icon: <Calendar className="h-5 w-5" /> },
    { label: "알림 설정", value: "12", icon: <Bell className="h-5 w-5" /> },
  ];

  const recentActivity = [
    { action: "HS Code 검색", item: "8517.12 (스마트폰)", time: "2분 전" },
    { action: "북마크 추가", item: "EU CBAM 규제", time: "1시간 전" },
    { action: "통계 조회", item: "중국 수출 동향", time: "3시간 전" },
    { action: "HS Code 검색", item: "8471.30 (노트북)", time: "5시간 전" },
  ];

  return (
    <div className="space-y-2">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* 프로필 정보 */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <Avatar className="mx-auto mb-4 h-24 w-24">
                <AvatarImage
                  src="https://placehold.co/96x96/FFFFFF/004E98?text=A"
                  alt="사용자 프로필"
                />
                <AvatarFallback className="bg-brand-700 text-2xl text-white">
                  A
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl text-gray-800">Aiden 님</CardTitle>
              <Badge className="bg-brand-50 text-brand-700">
                프리미엄 회원
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">brain1401@tradegenie.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">010-1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">가입일: 2024.01.15</span>
              </div>
              <Button className="mt-6 w-full bg-brand-700 hover:bg-brand-800">
                <Edit className="mr-2 h-4 w-4" />
                프로필 수정
              </Button>
            </CardContent>
          </Card>

          {/* 사용 통계 */}
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-700">사용 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {stat.icon}
                    <span className="text-gray-700">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-brand-700">
                    {stat.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 활동 내역 및 설정 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 최근 활동 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-700">최근 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">{activity.item}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">전체 활동 내역 보기</Button>
              </div>
            </CardContent>
          </Card>

          {/* 계정 설정 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-700">계정 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  알림 설정
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  보안 설정
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  개인정보 수정
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  구독 관리
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 즐겨찾기 관리 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-700">즐겨찾기 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium">8517.12 - 스마트폰</p>
                    <p className="text-sm text-gray-600">전자/통신 분야</p>
                  </div>
                  <Button variant="outline" size="sm">
                    관리
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium">EU CBAM 규제</p>
                    <p className="text-sm text-gray-600">환경/에너지 규제</p>
                  </div>
                  <Button variant="outline" size="sm">
                    관리
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium">중국 수출 통계</p>
                    <p className="text-sm text-gray-600">무역 통계</p>
                  </div>
                  <Button variant="outline" size="sm">
                    관리
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">전체 즐겨찾기 관리</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
