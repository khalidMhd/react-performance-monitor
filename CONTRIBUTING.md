# Contributing to React Performance Monitor

Thank you for your interest in contributing to React Performance Monitor! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-performance-monitor.git
   cd react-performance-monitor
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
4. Set up the upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/react-performance-monitor.git
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

2. Make your changes and commit them with a descriptive commit message:
   ```bash
   git add .
   git commit -m "feat: add new feature" # or "fix: resolve issue with X"
   ```

3. Keep your branch updated with the upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. Run tests to ensure your changes don't break existing functionality:
   ```bash
   npm test
   # or
   yarn test
   ```

5. Build the library to ensure it compiles correctly:
   ```bash
   npm run build
   # or
   yarn build
   ```

6. Test your changes in the example project:
   ```bash
   cd example
   npm install
   npm start
   ```

## Pull Request Process

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a pull request against the `main` branch of the original repository.

3. Ensure your PR includes:
   - A clear description of the changes
   - Any relevant issue numbers (e.g., "Fixes #123")
   - Updates to documentation if necessary
   - Test coverage for new features or bug fixes

4. Address any feedback from code reviews.

5. Once approved, your PR will be merged by a maintainer.

## Coding Standards

This project uses ESLint and Prettier to enforce coding standards. Please ensure your code follows these standards:

- Run linting before submitting a PR:
  ```bash
  npm run lint
  # or
  yarn lint
  ```

- Fix linting issues:
  ```bash
  npm run lint:fix
  # or
  yarn lint:fix
  ```

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type definitions for all functions, components, and hooks
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object types
- Export types that might be useful for consumers of the library

### React Guidelines

- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Use proper React patterns (e.g., controlled components, lifting state up)
- Avoid direct DOM manipulation

## Testing

This project uses Jest and React Testing Library for testing. Please follow these guidelines:

- Write tests for all new features and bug fixes
- Maintain or improve test coverage
- Run tests before submitting a PR:
  ```bash
  npm test
  # or
  yarn test
  ```

### Types of Tests

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test how components work together
- **Performance Tests**: Test the performance monitoring functionality

## Documentation

Good documentation is crucial for this project. Please follow these guidelines:

- Update the README.md if you add or change functionality
- Document all public APIs, hooks, and components
- Include examples for new features
- Update the API_REFERENCE.md file for any API changes
- Update the INTEGRATION_GUIDE.md for any changes to integration steps
- Update the TROUBLESHOOTING.md if you discover new issues or solutions

## Release Process

The release process is handled by the maintainers. Here's an overview:

1. Maintainers will periodically create release branches from `main`
2. Version numbers follow [Semantic Versioning](https://semver.org/)
3. Release notes will be generated based on commit messages
4. After testing, the release will be published to npm

## Working with the Example Project

The example project is a great way to test your changes:

1. Build the library:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Pack the library:
   ```bash
   npm pack
   # or
   yarn pack
   ```

3. Install the packed library in the example project:
   ```bash
   cd example
   npm install ../react-perf-mon-x.y.z.tgz
   # or
   yarn add ../react-perf-mon-x.y.z.tgz
   ```

4. Start the example project:
   ```bash
   npm start
   # or
   yarn start
   ```

## Adding New Features

When adding new features, please consider:

1. **Backward Compatibility**: Ensure your changes don't break existing functionality
2. **Performance**: The library should have minimal impact on application performance
3. **Bundle Size**: Keep the library lightweight
4. **API Design**: Follow consistent patterns with the rest of the library
5. **Documentation**: Document your feature thoroughly

## Reporting Bugs

If you find a bug, please report it by creating an issue on GitHub with:

1. A clear description of the bug
2. Steps to reproduce
3. Expected vs. actual behavior
4. Environment details (React version, browser, etc.)
5. A minimal code example if possible

## Feature Requests

Feature requests are welcome! Please create an issue on GitHub with:

1. A clear description of the feature
2. The problem it solves
3. How it fits with the library's purpose
4. Any implementation ideas you have

## Questions?

If you have any questions about contributing, please open an issue with the label "question".

Thank you for contributing to React Performance Monitor! 