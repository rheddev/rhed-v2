import type { QueryClient } from "@tanstack/react-query";

export type Fetcher<T> = OptionalFetcher<undefined, undefined, Promise<T>>;

export interface RouteContext {
  queryClient: QueryClient;
}
