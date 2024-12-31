import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { MatDividerModule } from "@angular/material/divider";
import { WidgetComponent } from "../../shared/components/widget/widget.component";
import { BoardColumnService } from "../../core/services/board-column.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [MatDividerModule, WidgetComponent, AsyncPipe],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly boardColumnService = inject(BoardColumnService);

  public toDoCount$ = this.boardColumnService.getTaskCountByColumnTitle('To-do');
  public inProgressCount$ = this.boardColumnService.getTaskCountByColumnTitle('In Progress');
  public awaitingFeedbackCount$ = this.boardColumnService.getTaskCountByColumnTitle('Awaiting Feedback');
  public doneCount$ = this.boardColumnService.getTaskCountByColumnTitle('Done');
  public totalInBoard$ = this.boardColumnService.getTotalTaskCount();
}
