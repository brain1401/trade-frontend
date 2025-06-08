import type { HSCODEResult } from "@/types/hscode";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/hscode/$hscode/")({
  component: RouteComponent,
});

function RouteComponent() {
  // `useParams` 훅을 사용하여 URL의 동적 세그먼트 값을 객체 형태로 가져옴
  // 예: URL이 /hscode/123456 이라면, useParams()는 { hscode: "123456" }을 반환
  const params = Route.useParams();
  const { hscode } = params;

  if (!hscode) {
    // hscode를 입력하지 않았는데 이 route 경로로 접근했을 때 실행할 경우
    // 사실상 말이 안되긴 하는데
    // 위에서 hscode에 마우스를 올려보면 현재 hscode는 string | undefined 타입이므로
    // 타입 안정성을 위해 에러를 던져서 이 if문 아래에서는
    // hscode라는 변수는 확실한 string 타입으로 추론되게끔 했음
    // 즉, 타입 안정성을 위해 에러를 던져서 이 if문 아래에서는
    // if문 아래에서 hscode에 마우스를 올려보면 확실한 string 타입으로 추론되는 것을 확인할 수 있음
    //
    // React 개발 경험으로는 사용할 값이 undefined일수도 있는 경우
    // ( T | undefined ) 타입으로 추론되는 경우
    // 는 타입 안정성이 떨어지고 간혹 런타임 에러가 발생할 수 있음

    throw new Error("입력하지 않았습니다.");
  }

  // 별도의 커스텀 훅으로 빼거나 react-query를 사용하면 훨씬 가독성 좋겠지만
  // 아직 데이터를 어떻게 가져오는지 모르는 사람들을 위해 생으로 로직 넣음

  const [HSCodeState, setHSCodeState] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const getHSCode = async () => {
      try {
        setIsLoading(true);
        setError(false);
        // [중요] 현재 API 호출 방식의 보안 취약점 및 업계 표준 해결 패턴
        //
        // 현재 코드는 클라이언트(브라우저)에서 직접 외부 API를 호출하고 있음.
        // `import.meta.env.VITE_UN_COMTRADE_API_KEY`로 API 키를 가져오지만,
        // Vite에서 `VITE_` 접두사가 붙은 환경 변수는 빌드 시점에 코드에 포함되어 클라이언트에 그대로 노출됨.
        // 따라서, 브라우저의 개발자 도구(네트워크 탭 등)를 통해 누구나 API 키를 확인할 수 있는 심각한 보안 취약점이 존재함.
        //
        // 권장되는 해결 방법: 백엔드(Spring Boot)를 통한 API 호출 (BFF: Backend-for-Frontend 패턴)
        //
        // 이 아키텍처는 외부 API 키와 같은 민감 정보를 클라이언트로부터 완전히 분리하여 보안을 강화하고,
        // 프론트엔드와 백엔드의 역할을 명확히 나누는 현대 웹 개발의 업계 표준(Industry Standard) 방식임.
        //
        // - 클라이언트(React 앱)는 자체 백엔드 서버(Spring Boot)의 API 엔드포인트를 호출함 (API 키 없이).
        // - Spring Boot 서버가 클라이언트의 요청을 받아, 비밀리에 관리하는 API 키를 사용하여 외부 API를 호출함.
        // - 외부 API로부터 받은 데이터를 가공하여 클라이언트에 전달함.
        //
        // 이 구조를 통해 외부 API 키는 Spring Boot 백엔드에만 안전하게 보관되며 클라이언트에게는 절대 노출되지 않음.
        //
        // 추가적인 장점: 비용 절감 및 비즈니스 로직 통합
        //
        // 이 패턴을 사용하면 Spring Boot 백엔드에서 외부 API 호출 전에 추가적인 로직을 실행할 수 있음.
        // 예를 들어, 먼저 사용자 인증(로그인) 여부나 유료 멤버십 등 권한을 확인하고,
        // 권한이 없는 사용자의 요청일 경우, 비용이 발생할 수 있는 외부 API를 애초에 호출하지 않고 요청을 거절함.
        // 이를 통해 불필요한 API 비용 발생을 원천적으로 차단할 수 있음.
        //
        // 또한, 권한에 따라 다음과 같은 차등 서비스를 유연하게 구현할 수 있음.
        // - 로그인한 유료 사용자에게는 더 많은 데이터나 고급 기능을 제공
        // - 비로그인 사용자에게는 제한된 정보만 보여주기

        const URL = `https://api.rapidmock.com/api/brain1401/hscode/hscode`;
        const { data } = await axios.get<HSCODEResult>(URL, {
          params: {
            code: hscode,
          },
        });

        setHSCodeState(data.description);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          setError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getHSCode();
  }, [hscode]);

  // 에러일 경우 보여줄 jsx
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-red-500 text-[3rem]">
        에러가 발생했습니다!
      </div>
    );
  }

  // 로딩 중일 경우 보여줄 jsx
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
        <LoaderCircle className="h-[10rem] w-[10rem] animate-spin text-blue-500" />
        <div className="text-center text-[5rem]">
          <div className="text-[5rem]">HSCODE : {hscode}</div>
          <div>에 대한 데이터를 가져오는 중...</div>
        </div>
      </div>
    );
  }

  // 로딩 중이 아니고 에러도 아니고 데이터도 있을 경우 보여줄 jsx
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center space-y-3 bg-cyan-300 py-5">
      <p className="flex items-center text-8xl">HSCODE : {hscode}</p>
      <p className="text-[2rem]">HSCODE 설명 : {HSCodeState}</p>
      <p className="text-xl">
        지금은 참고로 실제 API를 구현 안 했기 때문에 어떤 HSCODE 값이 들어와도
        고정적인 데이터를 출력해줌
      </p>
    </div>
  );
}
