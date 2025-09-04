# Angular Todo Application

A modern, feature-rich Todo application built with Angular 20, featuring comprehensive unit testing with Jest and Angular Testing Library. This project demonstrates advanced testing techniques and showcases a complete testing ecosystem with multiple service implementations, comprehensive HTTP testing, component interaction validation, and advanced mocking techniques using Jest spies and Angular Testing Library.

## 🚀 Features

- **Modern Angular Architecture**: Built with Angular 20 using standalone components
- **Reactive State Management**: Utilizes Angular signals for reactive state management
- **Full CRUD Operations**: Create, read, update, and delete todos
- **Filtering System**: Filter todos by All, Active, and Completed states
- **Persistent Storage**: Uses JSON Server as a mock backend API
- **Comprehensive Testing**: Extensive unit tests with Jest and Angular Testing Library
- **Multiple Service Implementations**: HTTP-based, mock-based, and RxJS stream-based services
- **Advanced Mocking**: Jest spying and fake response simulation
- **Type Safety**: Full TypeScript implementation with strict mode
- **Responsive Design**: Clean, responsive UI with custom CSS

## 🛠️ Technology Stack

- **Frontend**: Angular 20.1.0
- **Testing**: Jest 29.7.0 with Angular Testing Library
- **Backend**: JSON Server (mock API)
- **Language**: TypeScript 5.8.2
- **Styling**: Custom CSS
- **Build Tool**: Angular CLI 20.1.4

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Angular CLI**: Version 20.x (optional, but recommended)

```bash
# Check your versions
node --version
npm --version
ng version
```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Installation

```bash
# Check if all dependencies are installed correctly
npm list --depth=0
```

## 🚀 Running the Application

### Development Mode (Recommended)

The application requires both the Angular development server and JSON Server to run simultaneously:

```bash
# Start both servers concurrently
npm run dev
```

This command will:
- Start JSON Server on `http://localhost:3000`
- Start Angular development server on `http://localhost:4200`
- Open your default browser automatically

### Manual Setup (Alternative)

If you prefer to run servers separately:

```bash
# Terminal 1: Start JSON Server
npm run server

# Terminal 2: Start Angular development server
npm start
```

### Production Build

```bash
# Build for production
npm run build

# Build and watch for changes
npm run watch
```

## 🧪 Testing

This project includes comprehensive testing setup with Jest and Angular Testing Library, demonstrating various testing approaches and techniques.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci

# Debug tests
npm run test:debug
```

### Test Coverage

The project maintains excellent test coverage, exceeding the configured thresholds:

#### Current Coverage Report
```
=============================== Coverage summary ===============================
Statements   : 93.56% ( 247/264 )
Branches     : 80% ( 24/30 )
Functions    : 91.81% ( 101/110 )
Lines        : 93.92% ( 201/214 )
```

#### Detailed Coverage by Module
```
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |   93.56 |       80 |   91.81 |   93.92 |
 app                         |     100 |      100 |     100 |     100 |
  app.component.ts           |     100 |      100 |     100 |     100 |
  app.ts                     |     100 |      100 |     100 |     100 |
 app/todos                   |     100 |      100 |     100 |     100 |
  todos.component.ts         |     100 |      100 |     100 |     100 |
 app/todos/components/footer |     100 |      100 |     100 |     100 |
  footer.component.ts        |     100 |      100 |     100 |     100 |
 app/todos/components/header |     100 |      100 |     100 |     100 |
  header.component.ts        |     100 |      100 |     100 |     100 |
 app/todos/components/main   |   96.55 |      100 |   88.88 |   95.65 |
  main.component.ts          |   96.55 |      100 |   88.88 |   95.65 | 38
 app/todos/components/todo   |     100 |      100 |     100 |     100 |
  todo.component.ts          |     100 |      100 |     100 |     100 |
 app/todos/services          |   90.24 |    72.72 |   90.58 |   90.97 |
  todos.mock-spy.service.ts  |     100 |      100 |     100 |     100 |
  todos.rxjs.service.rxjs.ts |   77.46 |       40 |   76.47 |   80.64 | 37-39,65-83,93
  todos.service.ts           |     100 |      100 |     100 |     100 |
 app/todos/types             |     100 |      100 |     100 |     100 |
  filter.enum.ts             |     100 |      100 |     100 |     100 |
-----------------------------|---------|----------|---------|---------|-------------------
```

#### Test Results Summary
- **Total Test Suites**: 10 passed, 10 total
- **Total Tests**: 117 passed, 117 total
- **Test Execution Time**: ~31 seconds

#### Coverage Highlights
- **Perfect Coverage (100%)**: App component, todos component, footer, header, todo components, main service, mock service, and type definitions
- **Excellent Coverage (90%+)**: Main component (96.55% statements) and overall services (90.24% statements)
- **Good Coverage**: RxJS service (77.46% statements) - some advanced error handling paths not covered

#### Configured Thresholds (All Met ✅)
- **Branches**: 80% (Achieved: 80%)
- **Functions**: 80% (Achieved: 91.81%)
- **Lines**: 80% (Achieved: 93.92%)
- **Statements**: 80% (Achieved: 93.56%)

### Testing Architecture

The application features a multi-layered testing approach:

#### 1. HTTP Service Testing
**File**: `src/app/todos/services/todos.service.spec.ts`

Comprehensive tests covering:
- **getTodos()**: HTTP GET request validation, response handling, error scenarios
- **addTodo()**: HTTP POST with payload validation, success/error handling  
- **changeTodo()**: HTTP PATCH for updates, URL construction, response processing
- **removeTodo()**: HTTP DELETE operations, proper cleanup
- **changeFilter()**: Local state management without HTTP calls

Features tested:
- Correct HTTP request types (GET, POST, PATCH, DELETE)
- Proper response handling and state updates
- Base URL configuration (`http://localhost:3000/todos`)
- Comprehensive error handling for network failures, 404s, 500s
- JSON Server integration as API backend

#### 2. Mocking & Spying
**Files**: 
- `src/app/todos/services/todos.mock-spy.service.ts`
- `src/app/todos/services/todos.mock-spy.service.spec.ts`

Implementation features:
- Local array-based data storage (no HTTP calls)
- All service methods implemented: `getTodos`, `addTodo`, `changeTodo`, `removeTodo`, `changeFilter`
- Jest spying with `jest.fn()` and `jest.spyOn()`
- Fake response simulation
- Component behavior verification without real HTTP calls
- Isolated unit testing environment

#### 3. Component Testing
**Files**: Component spec files in `src/app/todos/components/`

Angular Testing Library implementation covering:
- **UI Rendering**: Todos display correctly with proper data binding
- **User Interactions**: Input + Enter adds new todos
- **Delete Functionality**: Remove todos via UI interactions
- **Status Updates**: Toggle completion status through UI
- **Empty State**: No todos message display validation
- **Filter System**: All, Active, Completed filter button functionality
- **User-Centric Testing**: Focus on user interactions rather than implementation details

#### 4. RxJS Stream Testing
**Files**: 
- `src/app/todos/services/todos.rxjs.service.rxjs.ts`
- `src/app/todos/services/todos.rxjs.service.spec.ts`

RxJS stream testing includes:
- Stream-based implementation of all CRUD operations
- Observable behavior validation
- Emission testing and sequence verification
- Error handling in reactive streams
- Subscription management and cleanup

### Testing Structure

```
src/app/testing/
├── test-utils.ts              # Common testing utilities
├── http-test-utils.ts         # HTTP testing helpers
└── component-mock-helpers.ts  # Component testing helpers

src/app/todos/services/
├── todos.service.spec.ts           # HTTP service unit tests
├── todos.mock-spy.service.ts       # Mock service for testing
├── todos.mock-spy.service.spec.ts  # Mock service tests
├── todos.rxjs.service.rxjs.ts      # RxJS service implementation
└── todos.rxjs.service.spec.ts      # RxJS service tests

src/app/todos/components/
├── header/header.component.spec.ts
├── main/main.component.spec.ts
├── todo/todo.component.spec.ts
└── footer/footer.component.spec.ts
```

## 📁 Project Structure

```
todo-app2/
├── src/
│   ├── app/
│   │   ├── todos/
│   │   │   ├── components/
│   │   │   │   ├── header/          # Add new todo input
│   │   │   │   ├── main/            # Todo list and toggle all
│   │   │   │   ├── todo/            # Individual todo item
│   │   │   │   └── footer/          # Filter controls and count
│   │   │   ├── services/
│   │   │   │   ├── todos.service.ts           # Main HTTP-based service
│   │   │   │   ├── todos.mock-spy.service.ts  # Mock service for testing
│   │   │   │   └── todos.rxjs.service.rxjs.ts # RxJS stream service
│   │   │   ├── types/
│   │   │   │   ├── todo.interface.ts    # Todo data interface
│   │   │   │   └── filter.enum.ts       # Filter enumeration
│   │   │   ├── todos.component.ts       # Main todos container
│   │   │   └── todos.component.html
│   │   ├── testing/                     # Testing utilities
│   │   ├── app.component.ts             # Root component
│   │   ├── app.config.ts                # App configuration
│   │   └── app.routes.ts                # Routing configuration
│   ├── styles.css                       # Global styles
│   ├── index.html                       # Main HTML file
│   └── main.ts                          # Application bootstrap
├── db.json                              # JSON Server database
├── jest.config.js                       # Jest configuration
├── setup-jest.ts                        # Jest setup file
├── angular.json                         # Angular CLI configuration
├── package.json                         # Dependencies and scripts
└── tsconfig.json                        # TypeScript configuration
```

## 🔌 API Endpoints

The application uses JSON Server running on `http://localhost:3000` with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Fetch all todos |
| POST | `/todos` | Create a new todo |
| PATCH | `/todos/:id` | Update a specific todo |
| DELETE | `/todos/:id` | Delete a specific todo |

### Sample API Data

```json
{
  "todos": [
    {
      "id": "1",
      "text": "Learn Angular",
      "isCompleted": false
    },
    {
      "id": "2",
      "text": "Set up json-server",
      "isCompleted": true
    }
  ]
}
```

## 🎯 Key Features Explained

### 1. Angular Signals

The application uses Angular's new signals feature for reactive state management:

```typescript
// In TodosService
todosSig = signal<TodoInterface[]>([]);
filterSig = signal<FilterEnum>(FilterEnum.all);

// In components
visibleTodos = computed(() => {
  const todos = this.todosService.todosSig();
  const filter = this.todosService.filterSig();
  // ... filtering logic
});
```

### 2. Standalone Components

All components are standalone, eliminating the need for NgModules:

```typescript
@Component({
  selector: 'app-todos-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent { }
```

### 3. HTTP Client Integration

The service uses Angular's HttpClient for API communication:

```typescript
addTodo(text: string): void {
  const newTodo = { text, isCompleted: false };
  this.httpClient
    .post<TodoInterface>(this.apiBaseUrl, newTodo)
    .subscribe((createdTodo) => {
      this.todosSig.update((todos) => [...todos, createdTodo]);
    });
}
```

### 4. Multiple Service Implementations

The project demonstrates different service approaches:

- **HTTP Service**: Real API communication with error handling
- **Mock Service**: Local array storage for isolated testing
- **RxJS Service**: Stream-based reactive implementation

### 5. Comprehensive Testing Strategies

The project includes multiple testing approaches:

- **Unit Tests**: For services and components
- **Integration Tests**: For component-service interactions
- **HTTP Tests**: Using HttpClientTestingModule
- **Mock Services**: For isolated component testing
- **RxJS Testing**: For reactive stream validation

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Navigation**: Full keyboard support
- **Visual Feedback**: Hover effects and state indicators
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Clean Interface**: Minimalist design focused on usability

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Angular development server |
| `npm run server` | Start JSON Server only |
| `npm run dev` | Start both servers concurrently |
| `npm run build` | Build for production |
| `npm run watch` | Build and watch for changes |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:ci` | Run tests for CI/CD |
| `npm run test:debug` | Debug tests |

## 🔧 Configuration Files

### Jest Configuration (`jest.config.js`)

- Uses `jest-preset-angular` for Angular-specific testing
- Configured with coverage thresholds (80% for all metrics)
- Includes path mapping for imports
- Excludes test files from coverage calculation

### TypeScript Configuration

- Strict mode enabled for better type safety
- Experimental decorators enabled
- Isolated modules for better performance

### Angular Configuration

- Uses new Angular build system
- Configured for both development and production
- Jest integration for testing

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Configuration

For different environments, you can modify the API base URL in the service:

```typescript
// In todos.service.ts
apiBaseUrl = environment.production 
  ? 'https://your-api.com/todos' 
  : 'http://localhost:3000/todos';
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

### Development Guidelines

- Follow Angular style guide
- Maintain test coverage above 80%
- Use TypeScript strict mode
- Write meaningful commit messages
- Update documentation for new features

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 4200
   npx kill-port 3000 4200
   ```

2. **Dependencies Issues**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Test Failures**
   ```bash
   # Clear Jest cache
   npm test -- --clearCache
   ```

4. **Build Errors**
   ```bash
   # Check TypeScript errors
   npx tsc --noEmit
   ```

## 📚 Learning Resources

- [Angular Documentation](https://angular.dev)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)
- [JSON Server Documentation](https://github.com/typicode/json-server)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Jest team for the testing framework
- Testing Library team for testing utilities
- JSON Server for the mock API solution

---

**Happy Coding! 🎉**

For questions or support, please open an issue in the repository.
