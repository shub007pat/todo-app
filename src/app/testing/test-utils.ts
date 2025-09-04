import { ComponentFixture } from '@angular/core/testing';
import { render, RenderComponentOptions } from '@testing-library/angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export async function renderComponent<T>(
  component: any,
  options?: RenderComponentOptions<T>
): Promise<{
  fixture: ComponentFixture<T>;
  container: HTMLElement;
  debug: DebugElement;
}> {
  const result = await render(component, {
    ...options,
  });

  return {
    fixture: result.fixture,
    container: result.container as HTMLElement,
    debug: result.fixture.debugElement,
  };
}

export function getByTestId(fixture: ComponentFixture<any>, testId: string): HTMLElement {
  return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`))?.nativeElement;
}

export function waitForAsync(fn: () => void): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, 0);
  });
}

export const createMockTodo = (overrides: any = {}) => ({
  id: Math.random().toString(),
  title: 'Test Todo',
  completed: false,
  ...overrides,
});

export const createMockTodos = (count: number = 3) => {
  return Array.from({ length: count }, (_, index) => 
    createMockTodo({ 
      id: (index + 1).toString(), 
      title: `Todo ${index + 1}`,
      completed: index % 2 === 0 
    })
  );
};
