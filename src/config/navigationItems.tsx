import {
  Home,
  Building2,
  Briefcase,
  FolderHeart,
  Search,
  UserCircle,
} from "lucide-react";

export const navigationItems = [
  {
    name: "Salut",
    path: "/",
    icon: Home,
    end: true,
  },
  {
    name: "Organizations",
    path: "/organizations",
    icon: Building2,
    end: false,
  },
  {
    name: "Oportunitati",
    path: "/jobs",
    icon: Briefcase,
    end: false,
  },
  {
    name: "Collections",
    path: "/collections",
    icon: FolderHeart,
    end: false,
  },
  {
    name: "Search",
    path: "/search",
    icon: Search,
    end: true,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircle,
    end: true,
  },
];
