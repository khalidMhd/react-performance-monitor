# Fixing React Version Issues

The example project is experiencing React hook errors due to version mismatches. Follow these steps to fix the issue:

## The Problem

The error message indicates an invalid hook call, which is typically caused by:
1. Mismatching versions of React and React DOM
2. Multiple copies of React in the same app

In our case, the example project is using React 19.0.0, while the library was developed with React 18.2.0.

## Solution

### 1. Update package.json

Edit your `package.json` file to use compatible React versions:

```json
{
  "dependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    // ... other dependencies
  }
}
```

### 2. Clear node_modules and reinstall

```bash
# Navigate to the example directory
cd example

# Remove node_modules
rm -rf node_modules

# Remove package-lock.json
rm package-lock.json

# Reinstall dependencies
npm install
```

### 3. Start the development server

```bash
npm start
```

## Alternative Solution

If you still encounter issues, you can try installing the library with the `--legacy-peer-deps` flag:

```bash
npm install ../react-performance-monitor-1.0.0.tgz --legacy-peer-deps
```

This tells npm to ignore peer dependency conflicts.

## Explanation

React hooks require the same version of React to be used throughout the application. When you have different versions (like React 19 in the app and React 18 in the library), the hooks system breaks because it relies on a shared React context.

By aligning the versions, we ensure that all components use the same React instance. 