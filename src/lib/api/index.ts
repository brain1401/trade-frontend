/**
 * @file API 모듈 통합 내보내기 (Unified API Module Exports)
 * @description
 * 각 API 모듈을 직접 내보내어 타입스크립트의 모듈 해석을 용이하게 하고
 * 개발 편의성을 높힌다. 코드 스플리팅이 필요할 경우,
 * 각 기능을 사용하는 컴포넌트 레벨에서 React.lazy 등을 활용하는 것을 권장
 */
export * from "./bookmark";
export * from "./chat";
export * from "./common";
export * from "./dashboard";
export * from "./exchange-rates";
export * from "./news";
export * from "./notification";
export * from "./statistics";
