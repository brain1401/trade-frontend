import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/")({
  component: UserPage,
});

function UserPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">사용자 페이지</h1>
      <p className="mt-2 text-muted-foreground">
        사용자 관련 정보를 확인할 수 있습니다.
      </p>
    </div>
  );
}
