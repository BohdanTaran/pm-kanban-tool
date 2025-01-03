import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from "@angular/core";
import { Subtask, Task } from "../../../models/columnBoard.model";
import { FormArray, FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from "@angular/forms";

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatList, MatListItem } from "@angular/material/list";
import { TaskService } from "../../../../core/services/task.service";

@Component({
  selector: "app-task-edit-modal",
  standalone: true,
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatList,
    MatListItem,
    FormsModule,
  ],
  templateUrl: "./task-edit-modal.component.html",
  styleUrl: "./task-edit-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialogRef<TaskEditModalComponent>);

  public readonly data: Task = inject(MAT_DIALOG_DATA);
  public priorityType: string[] = ["High", "Medium", "Low"];

  public newSubtask: string | "" = "";

  @ViewChild("taskForm") taskForm!: NgForm;

  public readonly form = this.fb.group({
    title: [this.data.title, [Validators.required]],
    description: [this.data.description],
    assigned_to: [this.data.assigned_to],
    deadline: [this.data.deadline, [Validators.required]],
    priority: [this.data.priority],
    subtasks: this.fb.array<Subtask>(this.data.subtasks),
  });

  public onDeleteSubtask(taskId: number, subtask: Subtask | null): void {
    if (subtask) {
      this.taskService.deleteSubtask(taskId, subtask.id).subscribe({
        next: () => {
          const subtasksArray = this.form.get("subtasks") as FormArray;
          const updatedSubtasks = subtasksArray.value.filter((st: Subtask) => st.id !== subtask.id);
          this.form.setControl("subtasks", this.fb.array(updatedSubtasks));

          this.cdr.markForCheck();
        },
      });
    }
  }

  addSubtask(event: MouseEvent): void {
    event.preventDefault();

    if (this.newSubtask.trim()) {
      const subtasksArray = this.form.get("subtasks") as FormArray;
      subtasksArray.push(
        this.fb.group({
          id: Date.now(),
          title: this.newSubtask.trim(),
          isCompleted: false,
        })
      );
      this.newSubtask = "";
    }
  }

  public submitForm(): void {
    if (this.form.valid) {
      this.taskService.updateTask({ ...this.data, ...this.form.value } as Task).subscribe({
        next: () => {
          this.dialog.close({ ...this.form.value });
        },
      });
    }
  }
}
