import { Injectable, signal } from "@angular/core";
import { FilterEnum } from "../types/filter.enum";
import { TodoInterface } from "../types/todo.interface";

@Injectable({
  providedIn: "root",
})
export class TodosMockSpyService {
  private mockTodos: TodoInterface[] = [];
  
  todosSig = signal<TodoInterface[]>([]);
  filterSig = signal<FilterEnum>(FilterEnum.all);
  
  apiBaseUrl = "http://localhost:3000/todos";

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.mockTodos = [
      { id: '1', text: 'Learn Angular Testing', isCompleted: false },
      { id: '2', text: 'Master Jest & Spying', isCompleted: true },
      { id: '3', text: 'Build Todo App', isCompleted: false }
    ];
    this.todosSig.set([...this.mockTodos]);
  }

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  getTodos(): void {
    setTimeout(() => {
      this.todosSig.set([...this.mockTodos]);
    }, 10);
  }

  addTodo(text: string): void {
    if (!text.trim()) return;
    
    const newTodo: TodoInterface = {
      id: Date.now().toString(),
      text: text.trim(),
      isCompleted: false
    };

    this.mockTodos.push(newTodo);
    this.todosSig.update(todos => [...todos, newTodo]);
  }

  changeTodo(id: string, text: string): void {
    const index = this.mockTodos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.mockTodos[index] = { ...this.mockTodos[index], text };
      this.todosSig.update(todos => 
        todos.map(todo => todo.id === id ? { ...todo, text } : todo)
      );
    }
  }

  removeTodo(id: string): void {
    this.mockTodos = this.mockTodos.filter(todo => todo.id !== id);
    this.todosSig.update(todos => todos.filter(todo => todo.id !== id));
  }

  toggleTodo(id: string): void {
    const todo = this.mockTodos.find(todo => todo.id === id);
    if (!todo) {
      throw new Error("Didn't find todo to update");
    }

    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    const index = this.mockTodos.findIndex(t => t.id === id);
    this.mockTodos[index] = updatedTodo;

    this.todosSig.update(todos =>
      todos.map(t => t.id === id ? updatedTodo : t)
    );
  }

  toggleAll(isCompleted: boolean): void {
    this.mockTodos = this.mockTodos.map(todo => ({ ...todo, isCompleted }));
    this.todosSig.update(todos => 
      todos.map(todo => ({ ...todo, isCompleted }))
    );
  }

  clearAllTodos(): void {
    this.mockTodos = [];
    this.todosSig.set([]);
  }

  setMockTodos(todos: TodoInterface[]): void {
    this.mockTodos = [...todos];
    this.todosSig.set([...todos]);
  }

  getMockTodos(): TodoInterface[] {
    return [...this.mockTodos];
  }
}
