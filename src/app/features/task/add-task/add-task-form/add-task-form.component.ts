import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

import { Subtask, Task } from "../../../../shared/models/columnBoard.model";

import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { TaskService } from "../../../../core/services/task.service";

@Component({
  selector: "app-add-task-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
    MatIconButton,
    MatIcon,
    MatListModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
  ],
  templateUrl: "./add-task-form.component.html",
  styleUrl: "./add-task-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);

  public newSubtask: string | "" = "";
  public priorityType: string[] = ["High", "Medium", "Low"];

  public readonly form = this.fb.group({
    title: ["", [Validators.required]],
    description: [""],
    assigned_to: [""],
    deadline: ["", [Validators.required]],
    priority: [""],
    subtasks: this.fb.array<Subtask[]>([]),
  });

  addSubtask(event: MouseEvent): void {
    event.preventDefault();

    if (this.newSubtask.trim()) {
      const subtasksArray = this.form.get("subtasks") as FormArray;
      subtasksArray.push(this.fb.group({
        id: Date.now(),
        title: this.newSubtask.trim(),
        isCompleted: false
      }));
      this.newSubtask = "";
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.taskService.addTask(this.form.value as Partial<Task>).subscribe({
        next: () => {
          this.snackBar.open("Task added successfully!", "", {
            horizontalPosition: "right",
            verticalPosition: "top",
            duration: 3000,
          });

          this.form.reset();
        },
      });
    }
  }
}
