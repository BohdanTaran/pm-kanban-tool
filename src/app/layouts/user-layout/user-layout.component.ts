import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../shared/components/header/header.component";

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-user-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatIconModule, HeaderComponent],
  templateUrl: "./user-layout.component.html",
  styleUrl: "./user-layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLayoutComponent {
  public readonly sidebarContent = [
    {
      icon: "space_dashboard",
      title: "Dashboard",
      routerLink: "/dashboard",
    },
    {
      icon: "add",
      title: "Add task",
      routerLink: "/add-task",
    },
    {
      icon: "view_week",
      title: "Board",
      routerLink: "/board",
    },
  ];
}
