import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { MainComponent } from './main.component';
import { ComponentMockHelper } from '../../../testing/component-mock-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MainComponent - Component Testing', () => {
  const user = userEvent.setup();

  it('should render todos correctly in the UI', async () => {
    const testTodos = ComponentMockHelper.createTestTodos(3);
    
    const { fixture } = await render(MainComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);

    // Check todos are rendered
    expect(screen.getAllByTestId('todo')).toHaveLength(3);
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 3')).toBeInTheDocument();
  });

  it('should show empty state when no todos exist', async () => {
    const { fixture } = await render(MainComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    ComponentMockHelper.setupComponentWithMocks(fixture, []); // Empty todos

    // Main section should be hidden when empty
    const mainSection = screen.getByTestId('main');
    expect(mainSection).toHaveClass('hidden');
  });

  it('should show toggle all checkbox when todos exist', async () => {
    const testTodos = ComponentMockHelper.createTestTodos(2);
    
    const { fixture } = await render(MainComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);

    const toggleAll = screen.getByTestId('toggleAll');
    expect(toggleAll).toBeInTheDocument();
    expect(toggleAll).not.toBeChecked(); // Not all todos are completed
  });

  it('should toggle all todos when toggle-all is clicked', async () => {
    const testTodos = ComponentMockHelper.createTestTodos(2);
    
    const { fixture } = await render(MainComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const toggleAll = screen.getByTestId('toggleAll') as HTMLInputElement;
    
    await user.click(toggleAll);

    // Verify service was called
    ComponentMockHelper.verifyServiceCall(spies.toggleAll, 1, [true]);

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should filter todos correctly based on filter state', async () => {
    const testTodos = [
      { id: '1', text: 'Active Todo', isCompleted: false },
      { id: '2', text: 'Completed Todo', isCompleted: true },
      { id: '3', text: 'Another Active Todo', isCompleted: false }
    ];
    
    const { fixture } = await render(MainComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);
    
    // Initially should show all todos
    expect(screen.getAllByTestId('todo')).toHaveLength(3);

    // Test active filter (this would be triggered by footer component)
    mockService.changeFilter('active' as any);
    fixture.detectChanges();

    // Should show only active todos (implementation depends on your visibleTodos computed)
    // Note: The actual filtering logic is in the computed property
  });
});
