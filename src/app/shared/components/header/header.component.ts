import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UserAvatarComponent } from "../../../features/user/user-avatar/user-avatar.component";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [UserAvatarComponent, MatButtonModule, MatIconModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
