import { newsQueries } from "./queries";
import { createQueryHook } from "../common/createQuery";

export const useGetNews = createQueryHook(newsQueries.list);

export const useGetNewsById = createQueryHook(
  newsQueries.detail,
  (articleId) => ({
    enabled: !!articleId, // articleId가 있을 때만 쿼리 실행
  }),
);
