import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ColumnBoard, Task } from "../../shared/models/columnBoard.model";
import { TaskPriorityDirective } from "../../shared/directives/task-priority.directive";
import { BoardColumnService } from "../../core/services/board-column.service";
import { map, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";

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

  public readonly boards$: Observable<ColumnBoard[]> = this.boardColumnService.getBoardColumns();

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
      this.boardColumnService.updateTaskInColumns(fromColumnTitle, toColumnTitle, task).subscribe()
    }
  }
}
