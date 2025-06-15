import React from "react";
import { Link } from "@tanstack/react-router";

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-2 font-semibold">AI HS Code Radar</h3>
            <p className="text-sm text-muted-foreground">
              AI 기반 품목분류 및 무역 정보 시스템
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">서비스</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  AI 분석
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  화물 추적
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-muted-foreground hover:text-primary"
                >
                  무역 통계
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">지원</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/notifications"
                  className="text-muted-foreground hover:text-primary"
                >
                  도움말
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-primary"
                >
                  고객지원
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">정보</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/auth/login"
                  className="text-muted-foreground hover:text-primary"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/signup"
                  className="text-muted-foreground hover:text-primary"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
          © 2024 AI HS Code Radar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
