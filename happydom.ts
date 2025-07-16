import { GlobalRegistrator } from "@happy-dom/global-registrator";
// jest-dom 매처 확장
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "bun:test";

// 콘솔 객체 보존
const oldConsole = console;

// Happy DOM 글로벌 등록
GlobalRegistrator.register();

// 콘솔 객체 복원 (Happy DOM이 콘솔을 덮어쓰는 문제 방지)
window.console = oldConsole;

expect.extend(matchers);
