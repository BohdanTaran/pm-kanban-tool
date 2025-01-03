import { inject, Injectable } from "@angular/core";
import { BoardColumnService } from "./board-column.service";
import { ColumnBoard, Subtask, Task } from "../../shared/models/columnBoard.model";
import { Observable, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private readonly boardColumnService = inject(BoardColumnService);
  private readonly http = inject(HttpClient);

  private readonly baseApiUrl: string = environment.baseApiUrl;

  private findBoardAndTask( boards: ColumnBoard[], taskId: number): { board: ColumnBoard | undefined; task: Task | undefined } {
    const board = boards.find(b => b.tasks.some(t => t.id === taskId));
    const task = board?.tasks.find(t => t.id === taskId);
    return { board, task };
  }

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

        return this.http.put(`${this.baseApiUrl}/boards/1`, boardTodo).pipe(
          switchMap(() => this.boardColumnService.refreshBoards())
        );
      })
    );
  }

  public deleteTask(id: number): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const { board } = this.findBoardAndTask(boards, id);

        if (board) {
          board.tasks = board.tasks.filter(t => t.id !== id);
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(
          switchMap(() => this.boardColumnService.refreshBoards())
        );
      })
    );
  }

  public updateTask(updatedTask: Task): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const { board, task } = this.findBoardAndTask(boards, updatedTask.id);

        if (board && task) {
          Object.assign(task, updatedTask);
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(
          switchMap(() => this.boardColumnService.refreshBoards())
        );
      })
    );
  }

  public updateSubtaskStatus(taskId: number, updatedSubtask: Subtask): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const { board, task } = this.findBoardAndTask(boards, taskId);

        if (board && task) {
          const subtask = task.subtasks.find(st => st.title === updatedSubtask.title);

          if (subtask) {
            subtask.isCompleted = updatedSubtask.isCompleted;
          }
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(
          switchMap(() => this.boardColumnService.refreshBoards())
        );
      })
    );
  }

  public deleteSubtask(taskId: number, subtaskId: number): Observable<void> {
    return this.boardColumnService.getBoardColumns().pipe(
      switchMap(boards => {
        const { board, task } = this.findBoardAndTask(boards, taskId);

        if (board && task) {
          task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
        }

        return this.http.put(`${this.baseApiUrl}/boards/${board?.id}`, board).pipe(
          switchMap(() => this.boardColumnService.refreshBoards())
        );
      })
    );
  }
}
