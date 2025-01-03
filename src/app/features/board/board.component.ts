import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Task } from "../../shared/models/columnBoard.model";
import { TaskPriorityDirective } from "../../shared/directives/task-priority.directive";
import { BoardColumnService } from "../../core/services/board-column.service";
import { map, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";

import { MatDialog } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { TaskInfoModalComponent } from "../../shared/components/modals/task-info-modal/task-info-modal.component";

@Component({
  selector: "app-board",
  standalone: true,
  imports: [DragDropModule, TaskPriorityDirective, MatProgressBarModule, AsyncPipe],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private readonly boardColumnService = inject(BoardColumnService);
  private readonly dialog = inject(MatDialog);

  public columns$ = this.boardColumnService.boards$;

  public openTaskInfo(task: Task): void {
    this.dialog.open(TaskInfoModalComponent, {
      data: task,
    });
  }

  public getTotalSubtasks(task: Task): number {
    return task.subtasks?.filter(st => st.isCompleted).length || 0;
  }

  public connectedLists$: Observable<string[] | null> = this.columns$.pipe(
    map(boards => boards.map(b => `list_${b.title}`))
  );

  drop(event: CdkDragDrop<Task[]>) {
    const task: Task = event.item.data;
    const fromColumnTitle = event.previousContainer.id.split("_")[1];
    const toColumnTitle = event.container.id.split("_")[1];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.boardColumnService.transferTask(fromColumnTitle, toColumnTitle, task).subscribe();
    }
  }
}
