import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { Task } from "../../../models/columnBoard.model";
import { DatePipe } from "@angular/common";
import { TaskPriorityDirective } from "../../../directives/task-priority.directive";

import { MatButtonModule } from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { TaskService } from "../../../../core/services/task.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-task-info-modal",
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, DatePipe, TaskPriorityDirective],
  templateUrl: "./task-info-modal.component.html",
  styleUrl: "./task-info-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskInfoModalComponent {
  public readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);

  public readonly data: Task = inject(MAT_DIALOG_DATA);

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.snackBar.open("Task deleted successfully!", "", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 3000,
        });
      }
    });
  }
}
