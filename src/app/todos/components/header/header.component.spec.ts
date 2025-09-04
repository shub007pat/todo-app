import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { HeaderComponent } from './header.component';
import { ComponentMockHelper } from '../../../testing/component-mock-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodosService } from '../../services/todos.service';

describe('HeaderComponent - Component Testing', () => {
  const user = userEvent.setup();

  it('should render header with input field', async () => {
    await render(HeaderComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    expect(screen.getByText('To do List')).toBeInTheDocument();
    expect(screen.getByTestId('newTodoInput')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('should add new todo when Enter is pressed', async () => {
    const { fixture } = await render(HeaderComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const input = screen.getByTestId('newTodoInput') as HTMLInputElement;
    
    // Type text and press Enter
    await user.type(input, 'New Todo from Input');
    await user.keyboard('[Enter]');

    // Verify service was called
    ComponentMockHelper.verifyServiceCall(spies.addTodo, 1, ['New Todo from Input']);

    // Verify input is cleared
    expect(input.value).toBe('');

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should not add empty todo', async () => {
    const { fixture } = await render(HeaderComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    const input = screen.getByTestId('newTodoInput') as HTMLInputElement;
    
    // Press Enter without typing
    await user.keyboard('[Enter]');

    // Verify service was not called
    expect(spies.addTodo).not.toHaveBeenCalled();

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should update input value as user types', async () => {
    await render(HeaderComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const input = screen.getByTestId('newTodoInput') as HTMLInputElement;
    
    await user.type(input, 'Test typing');
    
    expect(input.value).toBe('Test typing');
  });
});
