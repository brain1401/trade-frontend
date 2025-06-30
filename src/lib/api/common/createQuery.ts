import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

/**
 * TanStack Query의 쿼리 옵션을 생성하는 팩토리 함수의 타입 정의
 * @template TParams - 쿼리 키와 쿼리 함수에 전달될 파라미터의 타입
 * @template TQueryFnData - 쿼리 함수가 반환하는 데이터의 타입
 * @template TError - 쿼리 에러의 타입
 */
type QueryOptionsFactory<TParams, TQueryFnData, TError> = (
  params: TParams,
) => UseQueryOptions<TQueryFnData, TError>;

type HookOptionsFactory<TParams, TQueryFnData, TError> = (
  params: TParams,
) => Omit<
  UseQueryOptions<TQueryFnData, TError, TQueryFnData>,
  "queryKey" | "queryFn"
>;

type HookOptions<TQueryFnData, TError, TData> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData>,
  "queryKey" | "queryFn"
>;

/**
 * useQuery를 기반으로 하는 커스텀 훅을 생성하는 팩토리 함수
 * 코드 중복을 줄이고 일관된 패턴으로 쿼리 훅을 생성
 *
 * @template TParams - 훅에 전달될 파라미터의 타입
 * @template TQueryFnData - API가 반환하는 원시 데이터의 타입
 * @template TError - 커스텀 에러 타입
 * @template TData - `select` 옵션 등으로 변환된 최종 데이터 타입 (기본값: TQueryFnData)
 *
 * @param queryOptionsFactory - 파라미터를 받아 queryKey와 queryFn을 포함한 쿼리 옵션 객체를 반환하는 함수
 * @param hookOptions - 훅 레벨에서 동적으로 추가될 옵션을 반환하는 함수 (예: `enabled` 조건부 로직)
 * @returns 생성된 커스텀 쿼리 훅
 *
 * @example
 * // 1. 쿼리 옵션 정의 (queries.ts)
 * export const postQueries = {
 *   detail: (postId: number) => ({
 *     queryKey: ['posts', postId],
 *     queryFn: () => fetchPost(postId),
 *   }),
 * };
 *
 * // 2. 팩토리를 사용하여 훅 생성 (hooks.ts)
 * export const useGetPost = createQueryHook(
 *   postQueries.detail,
 *   (postId) => ({ enabled: !!postId }) // postId가 있을 때만 쿼리 실행
 * );
 */
export const createQueryHook = <TParams, TQueryFnData, TError = Error>(
  queryOptionsFactory: QueryOptionsFactory<TParams, TQueryFnData, TError>,
  hookOptions?: HookOptionsFactory<TParams, TQueryFnData, TError>,
) => {
  return <TData = TQueryFnData>(
    ...args: TParams extends void
      ? [options?: HookOptions<TQueryFnData, TError, TData>]
      : [params: TParams, options?: HookOptions<TQueryFnData, TError, TData>]
  ): UseQueryResult<TData, TError> => {
    const hasParams = queryOptionsFactory.length > 0;

    const params = (hasParams ? args[0] : undefined) as TParams;
    const options = (hasParams ? args[1] : args[0]) as HookOptions<
      TQueryFnData,
      TError,
      TData
    >;

    const baseOptions = queryOptionsFactory(params);
    const dynamicOptions = hookOptions ? hookOptions(params) : {};

    return useQuery({
      ...baseOptions,
      ...dynamicOptions,
      ...options,
    } as UseQueryOptions<TQueryFnData, TError, TData>);
  };
};
