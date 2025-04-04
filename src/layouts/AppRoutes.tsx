import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { routesComponents } from "../config/routesComponents";
import { useAppContext } from "../data/hooks/AppContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoadingAuth } = useAppContext();

  if (!isAuthenticated) {
    if (isLoadingAuth) {
      return <div>Loading...</div>;
    } else {
      return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
}
export const AppRoutes = () => {
  const routesNodes = routesComponents.map(({ path, Component, isPrivate }) => {
    const LazyComponent = (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    );

    return isPrivate ? (
      <Route
        key={path}
        path={path}
        element={<PrivateRoute>{LazyComponent}</PrivateRoute>}
      />
    ) : (
      <Route key={path} path={path} element={LazyComponent} />
    );
  });

  return <Routes>{routesNodes}</Routes>;
};
