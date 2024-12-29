import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./layouts/user-layout/user-layout.component").then(c => c.UserLayoutComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
