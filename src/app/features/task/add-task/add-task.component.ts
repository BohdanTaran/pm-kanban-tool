import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AddTaskFormComponent } from "./add-task-form/add-task-form.component";

@Component({
  selector: "app-add-task",
  standalone: true,
  imports: [AddTaskFormComponent],
  templateUrl: "./add-task.component.html",
  styleUrl: "./add-task.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent {}
