import { ChangeDetectionStrategy, Component } from "@angular/core";

import { MatDividerModule } from "@angular/material/divider";
import { WidgetComponent } from "../../shared/components/widget/widget.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [MatDividerModule, WidgetComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
