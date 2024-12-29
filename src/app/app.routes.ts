import { Routes } from "@angular/router";
import { UserLayoutComponent } from "./layouts/user-layout/user-layout.component";

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
