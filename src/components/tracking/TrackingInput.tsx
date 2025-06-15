import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type TrackingInputProps = {
  onSearch?: (trackingNumber: string) => void;
  className?: string;
};

export const TrackingInput: React.FC<TrackingInputProps> = ({
  onSearch,
  className,
}) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      if (onSearch) {
        await onSearch(trackingNumber.trim());
      } else {
        // 기본 동작: 추적 페이지로 이동
        navigate({
          to: "/tracking/$number",
          params: { number: trackingNumber.trim() },
        });
      }
    } catch (error) {
      console.error("추적 검색 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 특수문자 제거 및 대문자 변환
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setTrackingNumber(value);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          화물 추적
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tracking-input" className="text-sm font-medium">
              추적 번호
            </label>
            <Input
              id="tracking-input"
              type="text"
              placeholder="예: ABC123456789 또는 MSKU123456789"
              value={trackingNumber}
              onChange={handleInputChange}
              maxLength={20}
              disabled={isLoading}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              화물 관리번호 또는 B/L 번호를 입력하세요
            </p>
          </div>

          <Button
            type="submit"
            disabled={!trackingNumber.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                추적 중...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                추적하기
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
