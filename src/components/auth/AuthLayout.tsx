import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            AI HS Code 분석 시스템
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            무역 통관을 위한 지능형 HS Code 분류 서비스
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent>{children}</CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>&copy; 2024 AI HS Code Radar System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
