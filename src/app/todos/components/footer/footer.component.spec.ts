import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { FooterComponent } from './footer.component';
import { ComponentMockHelper } from '../../../testing/component-mock-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterEnum } from '../../types/filter.enum';

describe('FooterComponent - Component Testing', () => {
  const user = userEvent.setup();

  it('should render filter buttons correctly', async () => {
    const testTodos = ComponentMockHelper.createTestTodos(3);
    
    const { fixture } = await render(FooterComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should show correct todo count', async () => {
    const testTodos = [
      { id: '1', text: 'Active Todo 1', isCompleted: false },
      { id: '2', text: 'Completed Todo', isCompleted: true },
      { id: '3', text: 'Active Todo 2', isCompleted: false }
    ];
    
    const { fixture } = await render(FooterComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);

    // Should show 2 items left (2 active todos)
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('items left')).toBeInTheDocument();
  });

  it('should show singular "item left" for one active todo', async () => {
    const testTodos = [
      { id: '1', text: 'Active Todo', isCompleted: false },
      { id: '2', text: 'Completed Todo', isCompleted: true }
    ];
    
    const { fixture } = await render(FooterComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('item left')).toBeInTheDocument();
  });

  it('should hide footer when no todos exist', async () => {
    const { fixture } = await render(FooterComponent, {
        imports: [HttpClientTestingModule],
        providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, []); // Empty todos
    
    // Force change detection after setting empty todos
    fixture.detectChanges();

    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('hidden');
  });


  it('should filter todos when filter buttons are clicked', async () => {
    const testTodos = ComponentMockHelper.createTestTodos(3);
    
    const { fixture } = await render(FooterComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);
    const spies = ComponentMockHelper.createServiceSpies(mockService);

    // Click Active filter
    const activeButton = screen.getByText('Active');
    await user.click(activeButton);

    ComponentMockHelper.verifyServiceCall(spies.changeFilter, 1, [FilterEnum.active]);

    // Click Completed filter
    const completedButton = screen.getByText('Completed');
    await user.click(completedButton);

    ComponentMockHelper.verifyServiceCall(spies.changeFilter, 2, [FilterEnum.completed]);

    // Click All filter
    const allButton = screen.getByText('All');
    await user.click(allButton);

    ComponentMockHelper.verifyServiceCall(spies.changeFilter, 3, [FilterEnum.all]);

    // Cleanup
    Object.values(spies).forEach(spy => spy.mockRestore());
  });

  it('should highlight selected filter', async () => {
    const testTodos = ComponentMockHelper.createTestTodos(2);
    
    const { fixture } = await render(FooterComponent, {
      imports: [HttpClientTestingModule],
      providers: [ComponentMockHelper.createMockServiceProvider()]
    });

    const mockService = ComponentMockHelper.setupComponentWithMocks(fixture, testTodos);

    // Initially "All" should be selected
    const allButton = screen.getByText('All');
    expect(allButton).toHaveClass('selected');

    // Change filter to Active
    mockService.changeFilter(FilterEnum.active);
    fixture.detectChanges();

    const activeButton = screen.getByText('Active');
    expect(activeButton).toHaveClass('selected');
    expect(allButton).not.toHaveClass('selected');
  });
});
