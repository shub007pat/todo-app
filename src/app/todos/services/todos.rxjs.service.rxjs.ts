import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of, forkJoin } from 'rxjs';
import { map, catchError, tap, switchMap, debounceTime } from 'rxjs/operators';
import { TodoInterface } from '../types/todo.interface';
import { FilterEnum } from '../types/filter.enum';

@Injectable({
  providedIn: 'root',
})
export class TodosRxjsService {
  private httpClient = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:3000/todos';

  // Reactive state management with BehaviorSubject
  private todosSubject = new BehaviorSubject<TodoInterface[]>([]);
  private filterSubject = new BehaviorSubject<FilterEnum>(FilterEnum.all);

  // Public observables
  public todos$ = this.todosSubject.asObservable();
  public filter$ = this.filterSubject.asObservable();

  // Filtered todos observable
  public filteredTodos$ = this.todos$.pipe(
    switchMap(todos => 
      this.filter$.pipe(
        map(filter => this.filterTodos(todos, filter))
      )
    )
  );

  private filterTodos(todos: TodoInterface[], filter: FilterEnum): TodoInterface[] {
    switch (filter) {
      case FilterEnum.active:
        return todos.filter(todo => !todo.isCompleted);
      case FilterEnum.completed:
        return todos.filter(todo => todo.isCompleted);
      default:
        return todos;
    }
  }

  // GET - Load todos using RxJS streams
  getTodos(): Observable<TodoInterface[]> {
    return this.httpClient.get<TodoInterface[]>(this.apiBaseUrl).pipe(
      tap(todos => this.todosSubject.next(todos)),
      catchError(this.handleError<TodoInterface[]>('getTodos', []))
    );
  }

  // POST - Add new todo using RxJS streams
  addTodo(text: string): Observable<TodoInterface> {
    const newTodo = { text, isCompleted: false };
    return this.httpClient.post<TodoInterface>(this.apiBaseUrl, newTodo).pipe(
      tap(todo => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next([...currentTodos, todo]);
      }),
      catchError(this.handleError<TodoInterface>('addTodo'))
    );
  }

  // PATCH - Update todo text using RxJS streams
  changeTodo(id: string, text: string): Observable<TodoInterface> {
    return this.httpClient.patch<TodoInterface>(`${this.apiBaseUrl}/${id}`, { text }).pipe(
      tap(updatedTodo => {
        const currentTodos = this.todosSubject.value;
        const index = currentTodos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          currentTodos[index] = updatedTodo;
          this.todosSubject.next([...currentTodos]);
        }
      }),
      catchError(this.handleError<TodoInterface>('changeTodo'))
    );
  }

  // DELETE - Remove todo using RxJS streams
  removeTodo(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiBaseUrl}/${id}`).pipe(
      tap(() => {
        const currentTodos = this.todosSubject.value.filter(todo => todo.id !== id);
        this.todosSubject.next(currentTodos);
      }),
      catchError(this.handleError<any>('removeTodo'))
    );
  }

  // PATCH - Toggle todo completion using RxJS streams
  toggleTodo(id: string): Observable<TodoInterface> {
    const todo = this.todosSubject.value.find(t => t.id === id);
    if (!todo) {
      return throwError(() => new Error("Didn't find todo to update"));
    }

    return this.httpClient.patch<TodoInterface>(`${this.apiBaseUrl}/${id}`, { 
      isCompleted: !todo.isCompleted 
    }).pipe(
      tap(updatedTodo => {
        const currentTodos = this.todosSubject.value;
        const index = currentTodos.findIndex(t => t.id === id);
        if (index !== -1) {
          currentTodos[index] = updatedTodo;
          this.todosSubject.next([...currentTodos]);
        }
      }),
      catchError(this.handleError<TodoInterface>('toggleTodo'))
    );
  }

  // Toggle all todos using RxJS streams
  toggleAll(isCompleted: boolean): Observable<TodoInterface[]> {
    const todos = this.todosSubject.value;
    const updateObservables = todos.map(todo => 
      this.httpClient.patch<TodoInterface>(`${this.apiBaseUrl}/${todo.id}`, { isCompleted })
    );

    if (updateObservables.length === 0) {
      return of([]);
    }

    return forkJoin(updateObservables).pipe(
      tap(updatedTodos => this.todosSubject.next(updatedTodos)),
      catchError(this.handleError<TodoInterface[]>('toggleAll', []))
    );
  }

  // Set filter using RxJS streams
  changeFilter(filter: FilterEnum): void {
    this.filterSubject.next(filter);
  }

  // Search todos with debounce using RxJS streams
  searchTodos(searchTerm: string): Observable<TodoInterface[]> {
    return of(searchTerm).pipe(
      debounceTime(300),
      switchMap(term => 
        this.todos$.pipe(
          map(todos => 
            term ? 
            todos.filter(todo => todo.text.toLowerCase().includes(term.toLowerCase())) : 
            todos
          )
        )
      )
    );
  }

  // Get todo counts using RxJS streams
  getTodoCounts(): Observable<{total: number, active: number, completed: number}> {
    return this.todos$.pipe(
      map(todos => ({
        total: todos.length,
        active: todos.filter(todo => !todo.isCompleted).length,
        completed: todos.filter(todo => todo.isCompleted).length
      }))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
