import { createFileRoute } from "@tanstack/react-router";
import { ExchangeRates } from "@/components/trade/ExchangeRates";

export const Route = createFileRoute("/trade/exchange-rates")({
  component: ExchangeRatesPage,
});

function ExchangeRatesPage() {
  return (
    <div className="container mx-auto py-6">
      <ExchangeRates />
    </div>
  );
}
