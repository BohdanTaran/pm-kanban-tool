import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "app-user-avatar",
  standalone: true,
  imports: [],
  templateUrl: "./user-avatar.component.html",
  styleUrl: "./user-avatar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  @Input() avatar: string | null = null;
}
