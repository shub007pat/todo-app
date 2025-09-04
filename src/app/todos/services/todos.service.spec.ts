import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodosService } from './todos.service';
import { FilterEnum } from '../types/filter.enum';
import { TodoInterface } from '../types/todo.interface';

describe('TodosService', () => {
  let service: TodosService;
  let httpMock: HttpTestingController;
  const apiBaseUrl = 'http://localhost:3000/todos';

  const mockTodos: TodoInterface[] = [
    { id: '1', text: 'Test Todo 1', isCompleted: false },
    { id: '2', text: 'Test Todo 2', isCompleted: true },
    { id: '3', text: 'Test Todo 3', isCompleted: false }
  ];

  const mockTodo: TodoInterface = {
    id: '1', 
    text: 'Test Todo', 
    isCompleted: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService]
    });

    service = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have correct initial values', () => {
      expect(service.todosSig()).toEqual([]);
      expect(service.filterSig()).toBe(FilterEnum.all);
      expect(service.apiBaseUrl).toBe(apiBaseUrl);
    });
  });

  describe('HTTP Operations', () => {
    describe('getTodos()', () => {
      it('should make GET request to correct URL', () => {
        service.getTodos();

        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.method).toBe('GET');
        expect(req.request.url).toBe(apiBaseUrl);

        req.flush(mockTodos);
      });

      it('should update todosSig with fetched todos', () => {
        service.getTodos();

        const req = httpMock.expectOne(apiBaseUrl);
        req.flush(mockTodos);

        expect(service.todosSig()).toEqual(mockTodos);
      });

      it('should handle empty todos response', () => {
        service.getTodos();

        const req = httpMock.expectOne(apiBaseUrl);
        req.flush([]);

        expect(service.todosSig()).toEqual([]);
      });

      it('should handle HTTP error gracefully', () => {
        service.getTodos();

        const req = httpMock.expectOne(apiBaseUrl);
        req.error(new ErrorEvent('Network error'), { 
          status: 500, 
          statusText: 'Server Error' 
        });

        expect(service.todosSig()).toEqual([]);
      });
    });

    describe('addTodo()', () => {
      const newTodoText = 'New Todo';
      const newTodoPayload = { text: newTodoText, isCompleted: false };
      const createdTodo: TodoInterface = { 
        id: '4', 
        text: newTodoText, 
        isCompleted: false 
      };

      beforeEach(() => {
        service.todosSig.set(mockTodos);
      });

      it('should make POST request with correct data', () => {
        service.addTodo(newTodoText);

        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.url).toBe(apiBaseUrl);
        expect(req.request.body).toEqual(newTodoPayload);

        req.flush(createdTodo);
      });

      it('should add new todo to todosSig', () => {
        service.addTodo(newTodoText);

        const req = httpMock.expectOne(apiBaseUrl);
        req.flush(createdTodo);

        const expectedTodos = [...mockTodos, createdTodo];
        expect(service.todosSig()).toEqual(expectedTodos);
      });

      it('should handle empty text', () => {
        service.addTodo('');

        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.body).toEqual({ text: '', isCompleted: false });

        req.flush({ id: '5', text: '', isCompleted: false });
      });

      it('should handle HTTP error during add', () => {
        const initialTodos = [...service.todosSig()];

        service.addTodo(newTodoText);

        const req = httpMock.expectOne(apiBaseUrl);
        req.error(new ErrorEvent('Network error'), { 
          status: 400, 
          statusText: 'Bad Request' 
        });

        expect(service.todosSig()).toEqual(initialTodos);
      });
    });

    describe('changeTodo()', () => {
      const todoId = '1';
      const newText = 'Updated Todo Text';
      const updatedTodo: TodoInterface = { 
        id: todoId, 
        text: newText, 
        isCompleted: false 
      };

      beforeEach(() => {
        service.todosSig.set(mockTodos);
      });

      it('should make PATCH request to correct URL with text', () => {
        service.changeTodo(todoId, newText);

        const req = httpMock.expectOne(`${apiBaseUrl}/${todoId}`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.url).toBe(`${apiBaseUrl}/${todoId}`);
        expect(req.request.body).toEqual({ text: newText });

        req.flush(updatedTodo);
      });

      it('should update specific todo in todosSig', () => {
        service.changeTodo(todoId, newText);

        const req = httpMock.expectOne(`${apiBaseUrl}/${todoId}`);
        req.flush(updatedTodo);

        const updatedTodos = service.todosSig();
        expect(updatedTodos[0]).toEqual(updatedTodo);
        expect(updatedTodos[1]).toEqual(mockTodos[1]);
        expect(updatedTodos[2]).toEqual(mockTodos[2]);
      });

      it('should handle non-existent todo ID', () => {
        service.changeTodo('999', newText);

        const req = httpMock.expectOne(`${apiBaseUrl}/999`);
        req.flush({ id: '999', text: newText, isCompleted: false });

        expect(service.todosSig().length).toBe(3);
      });
    });

    describe('removeTodo()', () => {
      const todoId = '2';

      beforeEach(() => {
        service.todosSig.set(mockTodos);
      });

      it('should make DELETE request to correct URL', () => {
        service.removeTodo(todoId);

        const req = httpMock.expectOne(`${apiBaseUrl}/${todoId}`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.url).toBe(`${apiBaseUrl}/${todoId}`);

        req.flush({});
      });

      it('should remove todo from todosSig', () => {
        service.removeTodo(todoId);

        const req = httpMock.expectOne(`${apiBaseUrl}/${todoId}`);
        req.flush({});

        const remainingTodos = service.todosSig();
        expect(remainingTodos).toHaveLength(2);
        expect(remainingTodos.find(todo => todo.id === todoId)).toBeUndefined();
        expect(remainingTodos[0].id).toBe('1');
        expect(remainingTodos[1].id).toBe('3');
      });

      it('should handle non-existent todo removal', () => {
        const initialLength = service.todosSig().length;

        service.removeTodo('999');

        const req = httpMock.expectOne(`${apiBaseUrl}/999`);
        req.flush({});

        expect(service.todosSig()).toHaveLength(initialLength);
      });
    });

    describe('toggleTodo()', () => {
      const todoId = '1';
      
      beforeEach(() => {
        service.todosSig.set(mockTodos);
      });

      it('should make PATCH request to toggle completion status', () => {
        const originalTodo = mockTodos.find(t => t.id === todoId)!;
        const toggledTodo = { ...originalTodo, isCompleted: !originalTodo.isCompleted };

        service.toggleTodo(todoId);

        const req = httpMock.expectOne(`${apiBaseUrl}/${todoId}`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ 
          isCompleted: !originalTodo.isCompleted 
        });

        req.flush(toggledTodo);
      });

      it('should update todo completion status in todosSig', () => {
        const originalTodo = mockTodos.find(t => t.id === todoId)!;
        const toggledTodo = { ...originalTodo, isCompleted: !originalTodo.isCompleted };

        service.toggleTodo(todoId);

        const req = httpMock.expectOne(`${apiBaseUrl}/${todoId}`);
        req.flush(toggledTodo);

        const updatedTodos = service.todosSig();
        expect(updatedTodos[0].isCompleted).toBe(true);
      });

      it('should throw error for non-existent todo', () => {
        expect(() => service.toggleTodo('999')).toThrowError("Didn't find todo to update");
      });
    });

    describe('toggleAll()', () => {
      beforeEach(() => {
        service.todosSig.set(mockTodos);
      });

      it('should make multiple PATCH requests using forkJoin', () => {
        service.toggleAll(true);

        const requests = [
          httpMock.expectOne(`${apiBaseUrl}/1`),
          httpMock.expectOne(`${apiBaseUrl}/2`),
          httpMock.expectOne(`${apiBaseUrl}/3`)
        ];

        requests.forEach((req, index) => {
          expect(req.request.method).toBe('PATCH');
          expect(req.request.body).toEqual({ isCompleted: true });
          
          req.flush({ ...mockTodos[index], isCompleted: true });
        });
      });

      it('should update all todos with new completion status', () => {
        service.toggleAll(true);

        const requests = [
          httpMock.expectOne(`${apiBaseUrl}/1`),
          httpMock.expectOne(`${apiBaseUrl}/2`),
          httpMock.expectOne(`${apiBaseUrl}/3`)
        ];

        requests.forEach((req, index) => {
          req.flush({ ...mockTodos[index], isCompleted: true });
        });

        const updatedTodos = service.todosSig();
        expect(updatedTodos.every(todo => todo.isCompleted === true)).toBe(true);
      });

      it('should handle empty todos array', () => {
        service.todosSig.set([]);

        service.toggleAll(true);

        httpMock.expectNone(() => true);
        expect(service.todosSig()).toEqual([]);
      });
    });
  });

  describe('Local State Management', () => {
    describe('changeFilter()', () => {
      it('should update filterSig with new filter value', () => {
        service.changeFilter(FilterEnum.active);
        expect(service.filterSig()).toBe(FilterEnum.active);

        service.changeFilter(FilterEnum.completed);
        expect(service.filterSig()).toBe(FilterEnum.completed);

        service.changeFilter(FilterEnum.all);
        expect(service.filterSig()).toBe(FilterEnum.all);
      });

      it('should not make any HTTP requests', () => {
        service.changeFilter(FilterEnum.active);

        httpMock.expectNone(() => true);
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      service.todosSig.set(mockTodos);
    });

    it('should handle 404 errors', () => {
      service.getTodos();

      const req = httpMock.expectOne(apiBaseUrl);
      req.error(new ErrorEvent('Not Found'), { 
        status: 404, 
        statusText: 'Not Found' 
      });

      expect(service).toBeTruthy();
    });

    it('should handle 500 server errors', () => {
      service.addTodo('Test');

      const req = httpMock.expectOne(apiBaseUrl);
      req.error(new ErrorEvent('Server Error'), { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });

      expect(service).toBeTruthy();
    });

    it('should handle network connection errors', () => {
      service.removeTodo('1');

      const req = httpMock.expectOne(`${apiBaseUrl}/1`);
      req.error(new ErrorEvent('Network Error'), { 
        status: 0, 
        statusText: 'Unknown Error' 
      });

      expect(service).toBeTruthy();
    });
  });

  describe('Base URL Configuration', () => {
    it('should have correct base URL configuration', () => {
      expect(service.apiBaseUrl).toBe('http://localhost:3000/todos');
    });

    it('should construct correct URLs for different operations', () => {
      service.changeTodo('123', 'test');
      const patchReq = httpMock.expectOne(`${apiBaseUrl}/123`);
      expect(patchReq.request.url).toBe('http://localhost:3000/todos/123');
      patchReq.flush(mockTodo);

      service.removeTodo('456');  
      const deleteReq = httpMock.expectOne(`${apiBaseUrl}/456`);
      expect(deleteReq.request.url).toBe('http://localhost:3000/todos/456');
      deleteReq.flush({});
    });
  });

  describe('Signal State Management', () => {
    it('should properly manage todosSig state', () => {
      expect(service.todosSig()).toEqual([]);
      
      service.todosSig.set(mockTodos);
      expect(service.todosSig()).toEqual(mockTodos);
      
      service.todosSig.update(todos => [...todos, mockTodo]);
      expect(service.todosSig()).toHaveLength(4);
    });

    it('should properly manage filterSig state', () => {
      expect(service.filterSig()).toBe(FilterEnum.all);
      
      service.filterSig.set(FilterEnum.active);
      expect(service.filterSig()).toBe(FilterEnum.active);
    });
  });
});
