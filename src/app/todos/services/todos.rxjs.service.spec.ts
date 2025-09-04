import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodosRxjsService } from './todos.rxjs.service.rxjs';
import { FilterEnum } from '../types/filter.enum';
import { TodoInterface } from '../types/todo.interface';
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';

describe('TodosRxjsService - RxJS Unit Testing', () => {
  let service: TodosRxjsService;
  let httpMock: HttpTestingController;
  let testScheduler: TestScheduler;
  let consoleErrorSpy: jest.SpyInstance;
  const apiBaseUrl = 'http://localhost:3000/todos';

  const mockTodos: TodoInterface[] = [
    { id: '1', text: 'Learn RxJS', isCompleted: false },
    { id: '2', text: 'Test Observables', isCompleted: false },
    { id: '3', text: 'Master Marble Testing', isCompleted: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosRxjsService]
    });

    service = TestBed.inject(TodosRxjsService);
    httpMock = TestBed.inject(HttpTestingController);

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    // Mock console.error to suppress error logs during testing
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  describe('Service Initialization & Stream Behavior', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have initial empty todos$ stream', (done) => {
      service.todos$.subscribe(todos => {
        expect(todos).toEqual([]);
        done();
      });
    });

    it('should have initial filter$ stream as "all"', (done) => {
      service.filter$.subscribe(filter => {
        expect(filter).toBe(FilterEnum.all);
        done();
      });
    });

    it('should emit correct values from filteredTodos$ stream', (done) => {
      service.getTodos().subscribe();
      const req = httpMock.expectOne(apiBaseUrl);
      req.flush(mockTodos);

      service.changeFilter(FilterEnum.active);
      
      service.filteredTodos$.subscribe(filteredTodos => {
        const activeTodos = mockTodos.filter(todo => !todo.isCompleted);
        expect(filteredTodos).toEqual(activeTodos);
        done();
      });
    });
  });

  describe('RxJS Stream-based CRUD Operations', () => {
    describe('getTodos() - Stream Behavior', () => {
      it('should return observable and update todos$ stream', (done) => {
        service.getTodos().subscribe(todos => {
          expect(todos).toEqual(mockTodos);
          done();
        });

        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockTodos);
      });

      it('should handle stream errors gracefully', (done) => {
        service.getTodos().subscribe({
          next: todos => {
            expect(todos).toEqual([]);
            done();
          },
          error: () => fail('Should handle error gracefully')
        });

        const req = httpMock.expectOne(apiBaseUrl);
        req.error(new ErrorEvent('Network error'));
      });
    });

    describe('addTodo() - Stream Behavior', () => {
      it('should emit new todo and update todos$ stream', (done) => {
        const newTodo: TodoInterface = { id: '4', text: 'New RxJS Todo', isCompleted: false };

        // Listen to the addTodo observable directly
        service.addTodo('New RxJS Todo').subscribe(todo => {
          expect(todo).toEqual(newTodo);
          
          // Check if stream was updated
          service.todos$.subscribe(todos => {
            expect(todos).toContainEqual(newTodo);
            done();
          });
        });

        // Mock the HTTP response
        const req = httpMock.expectOne(apiBaseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ text: 'New RxJS Todo', isCompleted: false });
        req.flush(newTodo);
      });
    });

    describe('changeFilter() - Stream Behavior', () => {
      it('should update filter$ stream without HTTP calls', () => {
        const filters = [FilterEnum.active, FilterEnum.completed, FilterEnum.all];
        let emissionIndex = 0;

        service.filter$.subscribe(filter => {
          if (emissionIndex === 0) {
            expect(filter).toBe(FilterEnum.all); // Initial value
          } else {
            expect(filter).toBe(filters[emissionIndex - 1]);
          }
          emissionIndex++;
        });

        filters.forEach(f => service.changeFilter(f));
        httpMock.expectNone(() => true);
      });
    });
  });

  describe('Simplified Marble Testing', () => {
    it('should test filter stream behavior', () => {
      testScheduler.run(({ expectObservable }) => {
        // Test filter changes within TestBed context
        service.changeFilter(FilterEnum.active);
        
        expectObservable(service.filter$).toBe('a', {
          a: FilterEnum.active
        });
      });
    });

    it('should test search functionality', (done) => {
      // Setup test data first
      service.getTodos().subscribe();
      const req = httpMock.expectOne(apiBaseUrl);
      req.flush(mockTodos);

      // Test search after data is loaded
      service.searchTodos('Master').subscribe(results => {
        expect(results.length).toBe(1);
        expect(results[0].text).toContain('Master');
        done();
      });
    });
  });

  describe('Error Handling in Streams', () => {
    it('should handle HTTP errors in getTodos stream', (done) => {
      service.getTodos().subscribe({
        next: todos => {
          expect(todos).toEqual([]);
          // Verify that error was logged
          expect(consoleErrorSpy).toHaveBeenCalledWith('getTodos failed:', expect.any(Object));
          done();
        },
        error: () => fail('Should handle error gracefully')
      });

      const req = httpMock.expectOne(apiBaseUrl);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle addTodo stream errors', (done) => {
      service.addTodo('Failing Todo').subscribe({
        next: result => {
          expect(result).toBeUndefined();
          // Verify that error was logged
          expect(consoleErrorSpy).toHaveBeenCalledWith('addTodo failed:', expect.any(Object));
          done();
        },
        error: () => fail('Should handle error gracefully')
      });

      const req = httpMock.expectOne(apiBaseUrl);
      req.error(new ErrorEvent('Server Error'));
    });
  });

  describe('Correct Stream Emissions', () => {
    it('should emit correct todo counts stream', (done) => {
      service.getTodos().subscribe();
      const req = httpMock.expectOne(apiBaseUrl);
      req.flush(mockTodos);

      service.getTodoCounts().subscribe(counts => {
        expect(counts).toEqual({
          total: 3,
          active: 2, // 2 todos are not completed
          completed: 1 // 1 todo is completed
        });
        done();
      });
    });

    it('should emit correct values after CRUD operations', (done) => {
      let emissionCount = 0;
      const expectedEmissions = [
        [], // Initial
        mockTodos, // After getTodos
        [...mockTodos, { id: '4', text: 'New Todo', isCompleted: false }] // After addTodo
      ];

      service.todos$.subscribe(todos => {
        expect(todos).toEqual(expectedEmissions[emissionCount]);
        emissionCount++;
        
        if (emissionCount === 3) done();
      });

      // Execute operations
      service.getTodos().subscribe();
      const getReq = httpMock.expectOne(apiBaseUrl);
      getReq.flush(mockTodos);

      service.addTodo('New Todo').subscribe();
      const addReq = httpMock.expectOne(apiBaseUrl);
      addReq.flush({ id: '4', text: 'New Todo', isCompleted: false });
    });
  });

  describe('Memory Management & Subscription Handling', () => {
    it('should complete observables properly', () => {
      const subscription = service.todos$.subscribe();
      expect(subscription.closed).toBeFalsy();

      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
    });

    it('should handle subscription cleanup in error scenarios', (done) => {
      const errorSub = service.getTodos().subscribe({
        next: () => {
          // Verify that error was logged
          expect(consoleErrorSpy).toHaveBeenCalledWith('getTodos failed:', expect.any(Object));
          done();
        },
        error: () => {
          expect(errorSub.closed).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(apiBaseUrl);
      req.error(new ErrorEvent('Test Error'));
    });
  });

  describe('Advanced RxJS Features', () => {
    it('should handle toggleTodo with stream updates', (done) => {
      // Setup initial data
      service.getTodos().subscribe();
      const setupReq = httpMock.expectOne(apiBaseUrl);
      setupReq.flush(mockTodos);

      // Test toggle
      service.toggleTodo('1').subscribe(updatedTodo => {
        expect(updatedTodo.isCompleted).toBe(true);
        done();
      });

      const toggleReq = httpMock.expectOne(`${apiBaseUrl}/1`);
      expect(toggleReq.request.method).toBe('PATCH');
      expect(toggleReq.request.body).toEqual({ isCompleted: true });
      toggleReq.flush({ ...mockTodos[0], isCompleted: true });
    });

    it('should handle toggleAll with forkJoin', (done) => {
      // Setup minimal data for faster test
      const minimalTodos = mockTodos.slice(0, 1);
      service.getTodos().subscribe();
      const setupReq = httpMock.expectOne(apiBaseUrl);
      setupReq.flush(minimalTodos);

      service.toggleAll(true).subscribe(updatedTodos => {
        expect(updatedTodos.every(todo => todo.isCompleted)).toBe(true);
        done();
      });

      const toggleReq = httpMock.expectOne(`${apiBaseUrl}/1`);
      toggleReq.flush({ ...minimalTodos[0], isCompleted: true });
    });

    it('should handle empty toggleAll gracefully', (done) => {
      service['todosSubject'].next([]); // Set empty todos

      service.toggleAll(true).subscribe(result => {
        expect(result).toEqual([]);
        done();
      });

      httpMock.expectNone(() => true);
    });
  });
});
