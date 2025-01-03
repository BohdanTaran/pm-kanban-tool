import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";

import { Subtask, Task } from "../../../models/columnBoard.model";
import { DatePipe } from "@angular/common";
import { TaskPriorityDirective } from "../../../directives/task-priority.directive";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { TaskService } from "../../../../core/services/task.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TaskEditModalComponent } from "../task-edit-modal/task-edit-modal.component";

@Component({
  selector: "app-task-info-modal",
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatCheckboxModule, MatButtonModule, DatePipe, TaskPriorityDirective],
  templateUrl: "./task-info-modal.component.html",
  styleUrl: "./task-info-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskInfoModalComponent {
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  public readonly data: Task = inject(MAT_DIALOG_DATA);

  onDeleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.snackBar.open("Task deleted successfully!", "", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 3000,
        });
      },
    });
  }

  onToggleSubtask(subtask: Subtask): void {
    subtask.isCompleted = !subtask.isCompleted;

    this.taskService.updateSubtaskStatus(this.data.id, subtask).subscribe();
  }

  public openTaskEdit(task: Task): void {
    const dialog = this.dialog.open(TaskEditModalComponent, {
      data: task,
    });

    dialog.afterClosed().subscribe((updatedTask: Task) => {
      if (updatedTask) {
        Object.assign(this.data, updatedTask);
        this.cdr.markForCheck();
      }
    });
  }
}
