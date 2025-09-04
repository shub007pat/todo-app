import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { TodosComponent } from './todos.component';
import { ComponentMockHelper } from '../testing/component-mock-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TodosComponent - Integration Testing', () => {
  const user = userEvent.setup();

  it('should render all child components', async () => {
    await render(TodosComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    // Check all components are rendered
    expect(screen.getByText('To do List')).toBeInTheDocument(); // Header
    expect(screen.getByTestId('main')).toBeInTheDocument(); // Main
    expect(screen.getByTestId('footer')).toBeInTheDocument(); // Footer
  });

  it('should show empty state initially', async () => {
    const { fixture } = await render(TodosComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    ComponentMockHelper.setupComponentWithMocks(fixture, []); // Empty state

    // Main and footer should be hidden
    expect(screen.getByTestId('main')).toHaveClass('hidden');
    expect(screen.getByTestId('footer')).toHaveClass('hidden');
  });

  // FIXED: Simplified workflow test with predictable data
  it('should complete full user workflow: add, toggle, filter, delete', async () => {
    const { fixture } = await render(TodosComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    // Setup with known test data
    const testTodos = [
      { id: '1', text: 'First Todo', isCompleted: false },
      { id: '2', text: 'Second Todo', isCompleted: true }
    ];
    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    // 1. Add a new todo
    const input = screen.getByTestId('newTodoInput');
    await user.type(input, 'Integration Test Todo');
    await user.keyboard('[Enter]');

    expect(spies.addTodo).toHaveBeenCalledWith('Integration Test Todo');

    // 2. Toggle todo completion (use specific todo ID)
    const toggleButtons = screen.getAllByTestId('toggle');
    await user.click(toggleButtons[0]); // This will toggle the first todo

    expect(spies.toggleTodo).toHaveBeenCalledWith('1');

    // 3. Filter todos
    const activeFilter = screen.getByText('Active');
    await user.click(activeFilter);

    expect(spies.changeFilter).toHaveBeenCalledWith('active');

    const deleteButtons = screen.getAllByTestId('destroy');
    await user.click(deleteButtons[0]); // Delete first visible todo

    expect(spies.removeTodo).toHaveBeenCalledTimes(1);

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  // ALTERNATIVE: More precise workflow test
  it('should handle specific todo operations by ID', async () => {
    const { fixture } = await render(TodosComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    // Setup with known test data
    const testTodos = [
      { id: 'todo-1', text: 'First Todo', isCompleted: false },
      { id: 'todo-2', text: 'Second Todo', isCompleted: false }
    ];
    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    // Verify initial state
    expect(screen.getAllByTestId('todo')).toHaveLength(2);

    // Test toggle operation
    const firstToggle = screen.getAllByTestId('toggle')[0];
    await user.click(firstToggle);
    
    expect(spies.toggleTodo).toHaveBeenCalledWith('todo-1');

    // Test delete operation
    const firstDeleteButton = screen.getAllByTestId('destroy')[0];
    await user.click(firstDeleteButton);
    
    expect(spies.removeTodo).toHaveBeenCalledWith('todo-1');

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  // SIMPLIFIED: Individual operation tests
  it('should add todos through header input', async () => {
    const { fixture } = await render(TodosComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, []);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const input = screen.getByTestId('newTodoInput');
    await user.type(input, 'New Todo Item');
    await user.keyboard('[Enter]');

    expect(spies.addTodo).toHaveBeenCalledWith('New Todo Item');

    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should filter todos through footer buttons', async () => {
    const testTodos = ComponentMockHelper.createTestTodos(3);
    
    const { fixture } = await render(TodosComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    // Test all filter buttons
    await user.click(screen.getByText('Active'));
    expect(spies.changeFilter).toHaveBeenCalledWith('active');

    await user.click(screen.getByText('Completed'));
    expect(spies.changeFilter).toHaveBeenCalledWith('completed');

    await user.click(screen.getByText('All'));
    expect(spies.changeFilter).toHaveBeenCalledWith('all');

    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should toggle todos through main section', async () => {
    const testTodos = [
      { id: '1', text: 'Test Todo', isCompleted: false }
    ];
    
    const { fixture } = await render(TodosComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const toggle = screen.getByTestId('toggle');
    await user.click(toggle);

    expect(spies.toggleTodo).toHaveBeenCalledWith('1');

    Object.values(spies).forEach(spy => spy.mockRestore());
  });
});
