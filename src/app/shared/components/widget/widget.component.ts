import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-widget",
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: "./widget.component.html",
  styleUrl: "./widget.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent {
  @Input() icon: string | null = null;
  @Input() count: number = 0;
  @Input({ required: true }) title!: string;
}
