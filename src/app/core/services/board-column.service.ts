import { inject, Injectable } from "@angular/core";
import { ColumnBoard, Task } from "../../shared/models/columnBoard.model";
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BoardColumnService {
  private readonly http = inject(HttpClient);

  private readonly baseApiUrl: string = environment.baseApiUrl;

  private boardsSubject = new BehaviorSubject<ColumnBoard[]>([]);
  public boards$ = this.boardsSubject.asObservable();

  constructor() {
    this.loadBoards();
  }

  private loadBoards(): void {
    this.http.get<ColumnBoard[]>(`${this.baseApiUrl}/boards`).subscribe((boards) => {
      this.boardsSubject.next(boards);
    });
  }

  public refreshBoards(): Observable<void> {
    return this.http.get<ColumnBoard[]>(`${this.baseApiUrl}/boards`).pipe(
      tap((boards) => this.boardsSubject.next(boards)),
      map(() => void 0)
    );
  }

  public getBoardColumns(): Observable<ColumnBoard[]> {
    return this.http.get<ColumnBoard[]>(`${this.baseApiUrl}/boards`);
  }

  public getTaskCountByColumnTitle(columnTitle: string): Observable<number> {
    return this.getBoardColumns().pipe(
      map((boards) => {
        const column = boards.find((board) => board.title === columnTitle);
        return column ? column.tasks.length : 0;
      })
    );
  }

  public getTotalTaskCount(): Observable<number> {
    return this.getBoardColumns().pipe(
      map((boards) => boards.reduce((total, board) => total + board.tasks.length, 0))
    )
  }

  public transferTask(fromColumnTitle: string, toColumnTitle: string, task: Task): Observable<void> {
    return this.getBoardColumns().pipe(
      map((boards) => {
        const fromColumn = boards.find((b) => b.title === fromColumnTitle);
        const toColumn = boards.find((b) => b.title === toColumnTitle);

        if (fromColumn && toColumn) {
          fromColumn.tasks = fromColumn.tasks.filter((t) => t.title !== task.title);
          toColumn.tasks.push(task);
        }

        return { fromColumn, toColumn };
      }),
      switchMap(({ fromColumn, toColumn }) => {
        const updateFrom$ = fromColumn
          ? this.http.put<ColumnBoard[]>(`${this.baseApiUrl}/boards/${fromColumn.id}`, fromColumn)
          : of(undefined);

        const updateTo$ = fromColumn
          ? this.http.put<ColumnBoard[]>(`${this.baseApiUrl}/boards/${toColumn?.id}`, toColumn)
          : of(undefined);

        return forkJoin([updateFrom$, updateTo$]).pipe(
          map(() => void 0)
        )
      })
    )
  }
}
