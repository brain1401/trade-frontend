import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { ApiError } from "./ApiError";

/**
 * TanStack Query의 뮤테이션 옵션을 생성하는 팩토리 함수의 타입 정의.
 * 이 함수는 `queryClient`를 인자로 받아 `mutationFn`을 포함한 전체 뮤테이션 옵션을 반환.
 *
 * @template TData - `mutationFn`이 반환하는 데이터의 타입.
 * @template TError - 뮤테이션 에러의 타입.
 * @template TVariables - `mutationFn`에 전달되는 변수의 타입.
 * @template TContext - `onMutate`에서 반환되고 다른 콜백에 전달되는 컨텍스트의 타입.
 */
type MutationOptionsFactory<TData, TError, TVariables, TContext> = (
  queryClient: QueryClient,
) => UseMutationOptions<TData, TError, TVariables, TContext>;

/**
 * `useMutation`을 기반으로 하는 커스텀 훅을 생성하는 팩토리 함수.
 * 코드 중복을 줄이고 일관된 패턴으로 뮤테이션 훅을 생성.
 *
 * @template TData - `mutationFn`이 반환하는 데이터 타입.
 * @template TError - 커스텀 에러 타입. 기본값은 `ApiError`.
 * @template TVariables - `mutationFn`에 전달되는 변수의 타입.
 * @template TContext - `onMutate` 컨텍스트 타입.
 *
 * @param optionsFactory - `queryClient`를 받아 `mutationFn`을 포함한 뮤테이션 옵션 객체를 반환하는 함수.
 * @returns 생성된 커스텀 뮤테이션 훅.
 */
export const createMutationHook = <
  TData,
  TError = ApiError,
  TVariables = void,
  TContext = unknown,
>(
  optionsFactory: MutationOptionsFactory<TData, TError, TVariables, TContext>,
) => {
  return (
    options?: Omit<
      UseMutationOptions<TData, TError, TVariables, TContext>,
      "mutationFn" | "mutationKey" // mutationFn과 mutationKey는 factory에서 정의
    >,
  ): UseMutationResult<TData, TError, TVariables, TContext> => {
    const queryClient = useQueryClient();
    const factoryOptions = optionsFactory(queryClient);

    const mutationOptions: UseMutationOptions<
      TData,
      TError,
      TVariables,
      TContext
    > = {
      ...factoryOptions,
      ...options,
      onSuccess: (data, variables, context) => {
        factoryOptions.onSuccess?.(data, variables, context);
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        factoryOptions.onError?.(error, variables, context);
        options?.onError?.(error, variables, context);
      },
      onSettled: (data, error, variables, context) => {
        factoryOptions.onSettled?.(data, error, variables, context);
        options?.onSettled?.(data, error, variables, context);
      },
    };

    return useMutation(mutationOptions);
  };
};
