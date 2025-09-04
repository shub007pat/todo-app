import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { TodoComponent } from './todo.component';
import { ComponentMockHelper } from '../../../testing/component-mock-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TodoComponent - Component Testing', () => {
  const user = userEvent.setup();
  const mockTodo = { id: '1', text: 'Test Todo', isCompleted: false };

  it('should render todo with correct content', async () => {
    await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: false 
      }
    });

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    expect(screen.getByTestId('destroy')).toBeInTheDocument();
  });

  // FIXED: Setup mock service with test todo data first
  it('should toggle todo completion when checkbox is clicked', async () => {
    const { fixture } = await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: false 
      }
    });

    // CRITICAL: Setup mock service with test todo BEFORE calling toggle
    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, [mockTodo]);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const toggle = screen.getByTestId('toggle');
    await user.click(toggle);

    ComponentMockHelper.verifyServiceCall(spies.toggleTodo, 1, ['1']);

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should remove todo when delete button is clicked', async () => {
    const { fixture } = await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: false 
      }
    });

    // Setup mock service with test todo data
    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, [mockTodo]);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const destroyButton = screen.getByTestId('destroy');
    await user.click(destroyButton);

    ComponentMockHelper.verifyServiceCall(spies.removeTodo, 1, ['1']);

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should enter edit mode when label is double-clicked', async () => {
    const setEditingIdSpy = jest.fn();
    
    await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: false 
      },
      on: {
        setEditingId: setEditingIdSpy
      }
    });

    const label = screen.getByTestId('label');
    await user.dblClick(label);

    expect(setEditingIdSpy).toHaveBeenCalledWith('1');
  });

  it('should save todo changes when Enter is pressed in edit mode', async () => {
    const { fixture } = await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: true 
      }
    });

    // Setup mock service with test todo data
    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, [mockTodo]);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const editInput = screen.getByTestId('edit') as HTMLInputElement;
    
    // Clear and type new text
    await user.clear(editInput);
    await user.type(editInput, 'Updated Todo Text');
    await user.keyboard('[Enter]');

    ComponentMockHelper.verifyServiceCall(spies.changeTodo, 1, ['1', 'Updated Todo Text']);

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should show completed styling for completed todos', async () => {
    const completedTodo = { ...mockTodo, isCompleted: true };
    
    await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: completedTodo,
        isEditing: false 
      }
    });

    const todoItem = screen.getByTestId('todo');
    expect(todoItem).toHaveClass('completed');
  });

  it('should emit setEditingId when entering edit mode (alternative approach)', async () => {
    const { fixture } = await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: false 
      }
    });

    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.setEditingId, 'emit');

    const label = screen.getByTestId('label');
    await user.dblClick(label);

    expect(emitSpy).toHaveBeenCalledWith('1');
    
    emitSpy.mockRestore();
  });

  it('should handle text changes during editing', async () => {
    await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: true 
      }
    });

    const editInput = screen.getByTestId('edit') as HTMLInputElement;
    
    // Test initial value
    expect(editInput.value).toBe('Test Todo');
    
    // Test text change
    await user.clear(editInput);
    await user.type(editInput, 'Changed Text');
    
    expect(editInput.value).toBe('Changed Text');
  });

  it('should exit edit mode when todo is changed', async () => {
    const setEditingIdSpy = jest.fn();

    const { fixture } = await render(TodoComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()],
      inputs: { 
        todo: mockTodo,
        isEditing: true 
      },
      on: {
        setEditingId: setEditingIdSpy
      }
    });

    // Setup mock service with test todo data
    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, [mockTodo]);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const editInput = screen.getByTestId('edit');
    await user.type(editInput, ' - Updated');
    await user.keyboard('[Enter]');

    // Should call service to change todo
    expect(spies.changeTodo).toHaveBeenCalled();
    
    // Should emit null to exit edit mode
    expect(setEditingIdSpy).toHaveBeenCalledWith(null);

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });
});
