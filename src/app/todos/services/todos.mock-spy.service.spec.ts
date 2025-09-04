import { TestBed } from '@angular/core/testing';
import { TodosMockSpyService } from './todos.mock-spy.service';
import { FilterEnum } from '../types/filter.enum';
import { TodoInterface } from '../types/todo.interface';

describe('TodosMockSpyService - Complete Mock & Spy Testing', () => {
  let service: TodosMockSpyService;

  const mockTodos: TodoInterface[] = [
    { id: '1', text: 'Test Todo 1', isCompleted: false },
    { id: '2', text: 'Test Todo 2', isCompleted: true },
    { id: '3', text: 'Test Todo 3', isCompleted: false }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosMockSpyService]
    });
    service = TestBed.inject(TodosMockSpyService);
  });

  describe('Service Creation & Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default mock data', () => {
      expect(service.todosSig()).toHaveLength(3);
      expect(service.filterSig()).toBe(FilterEnum.all);
      expect(service.apiBaseUrl).toBe('http://localhost:3000/todos');
    });

    it('should have initial todos with correct structure', () => {
      const todos = service.todosSig();
      expect(todos[0]).toMatchObject({
        id: expect.any(String),
        text: expect.any(String),
        isCompleted: expect.any(Boolean)
      });
    });
  });

  describe('Mock Data Management', () => {
    beforeEach(() => {
      service.clearAllTodos();
      service.setMockTodos(mockTodos);
    });

    it('should set mock todos correctly', () => {
      expect(service.todosSig()).toEqual(mockTodos);
      expect(service.getMockTodos()).toEqual(mockTodos);
    });

    it('should clear all todos', () => {
      service.clearAllTodos();
      expect(service.todosSig()).toEqual([]);
      expect(service.getMockTodos()).toEqual([]);
    });
  });

  describe('CRUD Operations - Mock Implementation', () => {
    beforeEach(() => {
      service.clearAllTodos();
      service.setMockTodos(mockTodos);
    });

    describe('getTodos()', () => {
      it('should load todos from mock data', (done) => {
        service.clearAllTodos();
        service.setMockTodos(mockTodos);
        
        service.getTodos();
        
        // Wait for async operation
        setTimeout(() => {
          expect(service.todosSig()).toEqual(mockTodos);
          done();
        }, 20);
      });
    });

    describe('addTodo()', () => {
      it('should add a new todo', () => {
        const initialCount = service.todosSig().length;
        const newTodoText = 'New Test Todo';

        service.addTodo(newTodoText);

        expect(service.todosSig()).toHaveLength(initialCount + 1);
        const addedTodo = service.todosSig().find(todo => todo.text === newTodoText);
        expect(addedTodo).toBeDefined();
        expect(addedTodo?.isCompleted).toBe(false);
      });

      it('should not add empty todo', () => {
        const initialCount = service.todosSig().length;
        
        service.addTodo('');
        service.addTodo('   ');
        
        expect(service.todosSig()).toHaveLength(initialCount);
      });

      it('should generate unique IDs for new todos', (done) => {
        service.addTodo('Todo 1');
        
        setTimeout(() => {
            service.addTodo('Todo 2');
            
            const todos = service.todosSig();
            const lastTwoTodos = todos.slice(-2);
            expect(lastTwoTodos[0].id).not.toBe(lastTwoTodos[1].id);
            done();
        }, 5);
      });
    });

    describe('changeTodo()', () => {
      it('should update existing todo text', () => {
        const todoId = '1';
        const newText = 'Updated Todo Text';

        service.changeTodo(todoId, newText);

        const updatedTodo = service.todosSig().find(todo => todo.id === todoId);
        expect(updatedTodo?.text).toBe(newText);
      });

      it('should not affect other todos when updating one', () => {
        const todoId = '1';
        const originalTodos = [...service.todosSig()];
        
        service.changeTodo(todoId, 'Updated Text');
        
        const updatedTodos = service.todosSig();
        expect(updatedTodos[1]).toEqual(originalTodos[1]);
        expect(updatedTodos[2]).toEqual(originalTodos[2]);
      });

      it('should handle non-existent todo gracefully', () => {
        const originalTodos = [...service.todosSig()];
        
        service.changeTodo('999', 'Non-existent');
        
        expect(service.todosSig()).toEqual(originalTodos);
      });
    });

    describe('removeTodo()', () => {
      it('should remove existing todo', () => {
        const todoId = '2';
        const initialCount = service.todosSig().length;

        service.removeTodo(todoId);

        expect(service.todosSig()).toHaveLength(initialCount - 1);
        expect(service.todosSig().find(todo => todo.id === todoId)).toBeUndefined();
      });

      it('should handle non-existent todo removal', () => {
        const originalTodos = [...service.todosSig()];
        
        service.removeTodo('999');
        
        expect(service.todosSig()).toEqual(originalTodos);
      });
    });

    describe('toggleTodo()', () => {
      it('should toggle todo completion status', () => {
        const todoId = '1';
        const originalTodo = service.todosSig().find(todo => todo.id === todoId)!;
        const originalStatus = originalTodo.isCompleted;

        service.toggleTodo(todoId);

        const updatedTodo = service.todosSig().find(todo => todo.id === todoId)!;
        expect(updatedTodo.isCompleted).toBe(!originalStatus);
      });

      it('should throw error for non-existent todo', () => {
        expect(() => service.toggleTodo('999')).toThrowError("Didn't find todo to update");
      });
    });

    describe('toggleAll()', () => {
      it('should mark all todos as completed', () => {
        service.toggleAll(true);

        expect(service.todosSig().every(todo => todo.isCompleted === true)).toBe(true);
      });

      it('should mark all todos as not completed', () => {
        service.toggleAll(false);

        expect(service.todosSig().every(todo => todo.isCompleted === false)).toBe(true);
      });
    });

    describe('changeFilter()', () => {
      it('should update filter signal', () => {
        service.changeFilter(FilterEnum.active);
        expect(service.filterSig()).toBe(FilterEnum.active);

        service.changeFilter(FilterEnum.completed);
        expect(service.filterSig()).toBe(FilterEnum.completed);

        service.changeFilter(FilterEnum.all);
        expect(service.filterSig()).toBe(FilterEnum.all);
      });
    });
  });

  describe('Jest Spying & Mocking', () => {
    beforeEach(() => {
      service.clearAllTodos();
      service.setMockTodos(mockTodos);
    });

    it('should spy on addTodo method calls', () => {
      const addTodoSpy = jest.spyOn(service, 'addTodo');
      
      service.addTodo('Spied Todo');
      service.addTodo('Another Todo');
      
      expect(addTodoSpy).toHaveBeenCalledTimes(2);
      expect(addTodoSpy).toHaveBeenCalledWith('Spied Todo');
      expect(addTodoSpy).toHaveBeenCalledWith('Another Todo');
      
      addTodoSpy.mockRestore();
    });

    it('should spy on removeTodo and verify calls', () => {
      const removeTodoSpy = jest.spyOn(service, 'removeTodo');
      
      service.removeTodo('1');
      service.removeTodo('2');
      
      expect(removeTodoSpy).toHaveBeenCalledTimes(2);
      expect(removeTodoSpy).toHaveBeenNthCalledWith(1, '1');
      expect(removeTodoSpy).toHaveBeenNthCalledWith(2, '2');
      
      removeTodoSpy.mockRestore();
    });

    it('should mock addTodo with custom implementation', () => {
      const mockAddTodo = jest.fn().mockImplementation((text: string) => {
        const mockTodo: TodoInterface = {
          id: 'mocked-id',
          text: `Mocked: ${text}`,
          isCompleted: false
        };
        service.todosSig.update(todos => [...todos, mockTodo]);
      });

      service.addTodo = mockAddTodo;
      
      service.addTodo('Test');
      
      expect(mockAddTodo).toHaveBeenCalledWith('Test');
      expect(service.todosSig().some(todo => todo.text === 'Mocked: Test')).toBe(true);
    });

    it('should use jest.fn() to create mock functions', () => {
      const mockCallback = jest.fn();
      const mockFilter = jest.fn().mockReturnValue(FilterEnum.active);
      
      mockCallback('test-call');
      const filterResult = mockFilter();
      
      expect(mockCallback).toHaveBeenCalledWith('test-call');
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(filterResult).toBe(FilterEnum.active);
    });

    it('should track method calls in order', () => {
      const methodCalls: string[] = [];
      
      const addSpy = jest.spyOn(service, 'addTodo').mockImplementation((text) => {
        methodCalls.push('addTodo');
        return service.constructor.prototype.addTodo.call(service, text);
      });
      
      const toggleSpy = jest.spyOn(service, 'toggleTodo').mockImplementation((id) => {
        methodCalls.push('toggleTodo');
        return service.constructor.prototype.toggleTodo.call(service, id);
      });
      
      service.addTodo('Test Todo');
      service.toggleTodo('1');
      
      expect(methodCalls).toEqual(['addTodo', 'toggleTodo']);
      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(toggleSpy).toHaveBeenCalledTimes(1);
      
      addSpy.mockRestore();
      toggleSpy.mockRestore();
    });
  });

  describe('Component Integration with Mocks', () => {
    it('should provide predictable data for component testing', () => {
      const mockServiceForComponent = new TodosMockSpyService();
      mockServiceForComponent.clearAllTodos();
      
      const testTodos: TodoInterface[] = [
        { id: '1', text: 'Component Test Todo', isCompleted: false }
      ];
      mockServiceForComponent.setMockTodos(testTodos);
      
      expect(mockServiceForComponent.todosSig()).toEqual(testTodos);
      expect(mockServiceForComponent.todosSig()[0].text).toBe('Component Test Todo');
    });

    it('should allow component behavior verification through spies', () => {
      const changeFilterSpy = jest.spyOn(service, 'changeFilter');
      
      service.changeFilter(FilterEnum.active);
      
      expect(changeFilterSpy).toHaveBeenCalledWith(FilterEnum.active);
      expect(service.filterSig()).toBe(FilterEnum.active);
      
      changeFilterSpy.mockRestore();
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle empty mock data gracefully', () => {
      service.clearAllTodos();
      
      expect(service.todosSig()).toEqual([]);
      expect(() => service.toggleAll(true)).not.toThrow();
      expect(() => service.removeTodo('1')).not.toThrow();
    });

    it('should maintain signal consistency', () => {
      const initialSignalTodos = service.todosSig();
      const initialMockTodos = service.getMockTodos();
      
      expect(initialSignalTodos).toEqual(initialMockTodos);
      
      service.addTodo('Consistency Test');
      
      const updatedSignalTodos = service.todosSig();
      const updatedMockTodos = service.getMockTodos();
      
      expect(updatedSignalTodos).toEqual(updatedMockTodos);
    });
  });

  describe('Advanced Spying Scenarios', () => {
    it('should spy on multiple service methods simultaneously', () => {
      const spies = {
        getTodos: jest.spyOn(service, 'getTodos'),
        addTodo: jest.spyOn(service, 'addTodo'),
        changeTodo: jest.spyOn(service, 'changeTodo'),
        removeTodo: jest.spyOn(service, 'removeTodo'),
        changeFilter: jest.spyOn(service, 'changeFilter')
      };

      // Execute operations
      service.getTodos();
      service.addTodo('New Todo');
      service.changeTodo('1', 'Updated');
      service.removeTodo('2');
      service.changeFilter(FilterEnum.active);

      // Verify all calls
      expect(spies.getTodos).toHaveBeenCalledTimes(1);
      expect(spies.addTodo).toHaveBeenCalledWith('New Todo');
      expect(spies.changeTodo).toHaveBeenCalledWith('1', 'Updated');
      expect(spies.removeTodo).toHaveBeenCalledWith('2');
      expect(spies.changeFilter).toHaveBeenCalledWith(FilterEnum.active);

      // Cleanup
      Object.values(spies).forEach(spy => spy.mockRestore());
    });

    it('should mock return values for testing different scenarios', () => {
      const mockGetTodos = jest.spyOn(service, 'getTodos').mockImplementation(() => {
        service.todosSig.set([
          { id: 'mock1', text: 'Mocked Todo', isCompleted: false }
        ]);
      });

      service.getTodos();
      
      expect(service.todosSig()).toHaveLength(1);
      expect(service.todosSig()[0].text).toBe('Mocked Todo');
      
      mockGetTodos.mockRestore();
    });
  });
});
