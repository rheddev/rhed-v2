import { QueryClient } from "@tanstack/react-query";
import { createRouter, Link } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => {
      return (
        <div className="glass flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-4">
            The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="text-blue-500 hover:underline">
            Go back home
          </Link>
        </div>
      );
    },
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};
