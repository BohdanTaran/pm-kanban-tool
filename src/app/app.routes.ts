import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./layouts/user-layout/user-layout.component").then(c => c.UserLayoutComponent),
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        pathMatch: "full",
        loadComponent: () => import("./features/dashboard/dashboard.component").then(c => c.DashboardComponent),
      },
      {
        path: "board",
        loadComponent: () => import("./features/board/board.component").then(c => c.BoardComponent),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
