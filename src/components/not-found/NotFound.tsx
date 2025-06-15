import React from "react";
import { Link } from "@tanstack/react-router";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">404</h1>
          <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-sm text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              이전 페이지로
            </Link>
          </Button>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>문제가 지속되면 고객지원에 문의해 주세요.</p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
