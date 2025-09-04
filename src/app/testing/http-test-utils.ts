import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TodoInterface } from '../todos/types/todo.interface';
import { expect } from '@jest/globals';

export class TodoHttpTestHelper {
  static setupHttpTesting() {
    return {
      imports: [HttpClientTestingModule],
      providers: []
    };
  }

  static getHttpTestingController(): HttpTestingController {
    return TestBed.inject(HttpTestingController);
  }

  static expectGetTodos(httpMock: HttpTestingController, baseUrl: string): TestRequest {
    return httpMock.expectOne(baseUrl);
  }

  static expectAddTodo(
    httpMock: HttpTestingController, 
    baseUrl: string, 
    payload: { text: string; isCompleted: boolean }
  ): TestRequest {
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    return req;
  }

  static expectUpdateTodo(
    httpMock: HttpTestingController,
    baseUrl: string, 
    todoId: string,
    payload: any
  ): TestRequest {
    const req = httpMock.expectOne(`${baseUrl}/${todoId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    return req;
  }

  static expectDeleteTodo(
    httpMock: HttpTestingController,
    baseUrl: string,
    todoId: string
  ): TestRequest {
    const req = httpMock.expectOne(`${baseUrl}/${todoId}`);
    expect(req.request.method).toBe('DELETE');
    return req;
  }

  static flushSuccess(req: TestRequest, data: any): void {
    req.flush(data, { status: 200, statusText: 'OK' });
  }

  static flushError(req: TestRequest, status: number, statusText: string): void {
    req.error(new ErrorEvent('HTTP Error'), { status, statusText });
  }

  static verifyNoOutstandingRequests(httpMock: HttpTestingController): void {
    httpMock.verify();
  }
}

export const TodoMockData = {
  createMockTodo: (overrides: Partial<TodoInterface> = {}): TodoInterface => ({
    id: Math.random().toString(),
    text: 'Test Todo',
    isCompleted: false,
    ...overrides,
  }),

  createMockTodos: (count: number = 3): TodoInterface[] => {
    return Array.from({ length: count }, (_, index) => 
      TodoMockData.createMockTodo({ 
        id: (index + 1).toString(), 
        text: `Todo ${index + 1}`,
        isCompleted: index % 2 === 0 
      })
    );
  }
};
