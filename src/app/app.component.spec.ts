import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodosService } from './todos/services/todos.service';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  it('should create the app', async () => {
    await render(AppComponent, {
      imports: [HttpClientTestingModule],
      providers: [
        TodosService,
        provideHttpClient()
      ]
    });
    
    // Fixed: Use data-testid instead of role="main" (which doesn't exist in your app)
    expect(screen.getByTestId('main')).toBeInTheDocument();
  });

  it('should render todos component', async () => {
    await render(AppComponent, {
      imports: [HttpClientTestingModule], 
      providers: [
        TodosService,
        provideHttpClient()
      ]
    });
    
    // Test for actual content that exists in your app
    expect(screen.getByText('To do List')).toBeInTheDocument();
  });

  it('should render todo input', async () => {
    await render(AppComponent, {
      imports: [HttpClientTestingModule],
      providers: [
        TodosService,
        provideHttpClient()
      ]
    });
    
    expect(screen.getByTestId('newTodoInput')).toBeInTheDocument();
  });

  it('should render footer with filters', async () => {
    await render(AppComponent, {
      imports: [HttpClientTestingModule],
      providers: [
        TodosService,
        provideHttpClient()
      ]
    });
    
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument(); 
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
