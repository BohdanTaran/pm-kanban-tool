import { inject, Injectable } from "@angular/core";
import { BoardColumnService } from "./board-column.service";
import { Subtask, Task } from "../../shared/models/columnBoard.model";
import { map, Observable, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private readonly boardColumnService = inject(BoardColumnService);
  private readonly http = inject(HttpClient);

  private readonly baseApiUrl: string = environment.baseApiUrl;

  public addTask(task: Partial<Task>): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const boardTodo = boards.find(b => b.title === "To-do");

        if (boardTodo) {
          task = { ...task, id: Date.now() };
          //@ts-ignore
          // I use ts-ignore because of local database source
          boardTodo.tasks.push(task);
        }

        return this.http.put(`${this.baseApiUrl}/boards/1`, boardTodo).pipe(map(() => {}));
      })
    );
  }

  public deleteTask(id: string): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const board = boards.find(b => {
          return b.tasks.some(t => t.id.toString() === id);
        });

        if (board) {
          board.tasks = board.tasks.filter(t => t.id.toString() !== id);
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(map(() => {}));
      })
    );
  }

  public updateTask(updatedTask: Task): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const board = boards.find(b => {
          return b.tasks.some(t => t.id === updatedTask.id);
        });
        const task: Task | undefined = board?.tasks.find(t => t.id === updatedTask.id);

        if (task) {
          Object.assign(task, updatedTask);
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(map(() => {}));
      })
    );
  }

  public updateSubtaskStatus(taskId: number, updatedSubtask: Subtask): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const board = boards.find(b => {
          return b.tasks.some(t => t.id === taskId);
        });
        const task: Task | undefined = board?.tasks.find(t => t.id === taskId);

        if (task) {
          const subtask = task.subtasks.find(st => st.title === updatedSubtask.title);

          if (subtask) {
            subtask.isCompleted = updatedSubtask.isCompleted;
          }
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(map(() => {}));
      })
    );
  }

  public deleteSubtask(taskId: number, subtaskId: number): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const board = boards.find(b => {
          return b.tasks.some(t => t.id === taskId);
        });
        const task: Task | undefined = board?.tasks.find(t => t.id === taskId);

        if (task) {
          task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(map(() => {}));
      })
    );
  }
}
