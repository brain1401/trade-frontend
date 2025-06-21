import { useState } from "react";
import { Calculator } from "lucide-react";
import ContentCard from "@/components/common/ContentCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockExchangeRates } from "@/data/mockData";

// 환율 계산기 컴포넌트
function ExchangeCalculator() {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("KRW");
  const [toCurrency, setToCurrency] = useState<string>("USD");

  const calculateExchange = (): string => {
    const numAmount = parseFloat(amount) || 0;
    if (fromCurrency === "KRW") {
      const targetRate = mockExchangeRates.find(
        (r) => r.currency === toCurrency,
      );
      if (targetRate) {
        const result = numAmount / targetRate.rate;
        return result.toFixed(toCurrency === "JPY" ? 0 : 2);
      }
    } else if (toCurrency === "KRW") {
      const sourceRate = mockExchangeRates.find(
        (r) => r.currency === fromCurrency,
      );
      if (sourceRate) {
        const result = numAmount * sourceRate.rate;
        return result.toFixed(0);
      }
    }
    return "0";
  };

  return (
    <ContentCard
      title="환율 계산기"
      titleRightElement={<Calculator size={16} className="text-neutral-500" />}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-sm text-neutral-700">
            금액
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1"
            placeholder="금액을 입력해주세요"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-neutral-700">기준 통화</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KRW">KRW (원)</SelectItem>
                {mockExchangeRates.map((rate) => (
                  <SelectItem key={rate.currency} value={rate.currency}>
                    {rate.currency} ({rate.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-neutral-700">환전 통화</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KRW">KRW (원)</SelectItem>
                {mockExchangeRates.map((rate) => (
                  <SelectItem key={rate.currency} value={rate.currency}>
                    {rate.currency} ({rate.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg bg-primary-50 p-4">
          <p className="mb-1 text-sm text-neutral-600">환전 결과</p>
          <p className="text-lg font-semibold text-primary-800">
            {calculateExchange()} {toCurrency}
          </p>
        </div>
      </div>
    </ContentCard>
  );
}

export default ExchangeCalculator;
