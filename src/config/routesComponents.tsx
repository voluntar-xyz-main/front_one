import { lazy } from "react";

export const routesComponents = [
  { path: "/", Component: lazy(() => import("../components/Home")) },
  { path: "/auth", Component: lazy(() => import("../components/AuthForm")) },
  { path: "/search", Component: lazy(() => import("../components/Search")) },
  { path: "/jobs", Component: lazy(() => import("../components/JobList")) },
  {
    path: "/jobs/:id",
    Component: lazy(() => import("../components/JobDetails")),
  },
  {
    path: "/organizations",
    Component: lazy(() => import("../components/OrganizationList")),
  },
  {
    path: "/organizations/:id",
    Component: lazy(() => import("../components/OrganizationDetails")),
  },
  {
    path: "/profile",
    Component: lazy(() => import("../components/Profile")),
    isPrivate: true,
  },
  {
    path: "/collections",
    Component: lazy(() => import("../components/CollectionList")),
    isPrivate: true,
  },
  {
    path: "/collections/new",
    Component: lazy(() => import("../components/CollectionForm")),
    isPrivate: true,
  },
  {
    path: "/collections/:id",
    Component: lazy(() => import("../components/CollectionDetails")),
  },
  {
    path: "/logoGenerator",
    Component: lazy(() => import("../tools/logoGenerator/LogoGenerator")),
  },
  {
    path: "/thumbnailGenerator",
    Component: lazy(() => import("../tools/logoGenerator/ThumbnailGenerator")),
  },
];
