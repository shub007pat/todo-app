import { ComponentFixture } from '@angular/core/testing';
import { TodosMockSpyService } from '../todos/services/todos.mock-spy.service';
import { TodosService } from '../todos/services/todos.service';
import { TodoInterface } from '../todos/types/todo.interface';
import { FilterEnum } from '../todos/types/filter.enum';
import { expect, jest } from '@jest/globals';

export class ComponentMockHelper {
  static createMockServiceProvider() {
    return {
      provide: TodosService,
      useClass: TodosMockSpyService
    };
  }

  static setupComponentWithMocks<T>(
    fixture: ComponentFixture<T>,
    testTodos: TodoInterface[] = []
  ): TodosMockSpyService {
    const mockService = fixture.debugElement.injector.get(TodosService) as unknown as TodosMockSpyService;
    
    mockService.clearAllTodos();
    mockService.setMockTodos(testTodos);
    
    fixture.detectChanges();
    return mockService;
  }

  static createServiceSpies(service: TodosService | TodosMockSpyService) {
    return {
      getTodos: jest.spyOn(service, 'getTodos'),
      addTodo: jest.spyOn(service, 'addTodo'),
      changeTodo: jest.spyOn(service, 'changeTodo'),
      removeTodo: jest.spyOn(service, 'removeTodo'),
      toggleTodo: jest.spyOn(service, 'toggleTodo'),
      toggleAll: jest.spyOn(service, 'toggleAll'),
      changeFilter: jest.spyOn(service, 'changeFilter')
    };
  }

  static createTestTodos(count: number = 3): TodoInterface[] {
    return Array.from({ length: count }, (_, index) => ({
      id: (index + 1).toString(),
      text: `Test Todo ${index + 1}`,
      isCompleted: index % 2 === 0
    }));
  }

  static verifyServiceCall(
    spy: jest.SpiedFunction<(...args: any[]) => any> | jest.SpiedClass<any>,
    expectedCalls: number,
    expectedArgs?: any[]
  ) {
    expect(spy).toHaveBeenCalledTimes(expectedCalls);
    if (expectedArgs) {
      expect(spy).toHaveBeenCalledWith(...expectedArgs);
    }
  }
}
