import { ChangeDetectionStrategy, Component } from "@angular/core";

import { MatSidenavModule } from "@angular/material/sidenav";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../shared/components/header/header.component";

@Component({
  selector: "app-user-layout",
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, HeaderComponent],
  templateUrl: "./user-layout.component.html",
  styleUrl: "./user-layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLayoutComponent {}
