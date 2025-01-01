import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { ColumnBoard, Task } from "../../shared/models/columnBoard.model";
import { TaskPriorityDirective } from "../../shared/directives/task-priority.directive";
import { BoardColumnService } from "../../core/services/board-column.service";
import { map, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";

import { MatDialog } from "@angular/material/dialog";
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { TaskInfoModalComponent } from "../../shared/components/modals/task-info-modal/task-info-modal.component";
@Component({
  selector: "app-board",
  standalone: true,
  imports: [DragDropModule, TaskPriorityDirective, AsyncPipe],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private readonly boardColumnService = inject(BoardColumnService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  public boards$: Observable<ColumnBoard[]> = this.boardColumnService.getBoardColumns();

  public openTaskInfo(task: Task): void {
    const dialogRef = this.dialog.open(TaskInfoModalComponent, {
      data: task
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateBoardData();
    })
  }

  private updateBoardData(): void {
    this.boards$ = this.boardColumnService.getBoardColumns();
    this.cdr.markForCheck();
  }

  public connectedLists$: Observable<string[] | null> = this.boards$.pipe(
    map((boards) => boards.map((b) => `list_${b.title}`))
  );

  drop(event: CdkDragDrop<Task[]>) {
    const task: Task = event.item.data;
    const fromColumnTitle = event.previousContainer.id.split('_')[1];
    const toColumnTitle = event.container.id.split('_')[1];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.boardColumnService.transferTask(fromColumnTitle, toColumnTitle, task).subscribe()
    }
  }
}
