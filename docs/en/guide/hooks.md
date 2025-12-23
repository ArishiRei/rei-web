# Global Hooks Guide

This project encapsulates a series of global Composition API Hooks for handling common UI interaction logic.

## 1. Toast Messages

Use `useToast` to display global message notifications.

### Basic Usage
```typescript
const toast = useToast()

// Display different types of messages
toast.info('This is a regular message')
toast.success('Operation successful')
toast.warning('Warning message')
toast.error('An error occurred')

// Custom duration (milliseconds)
toast.success('This message displays for 5 seconds', 5000)
```

### Configuration Options
```typescript
// Global Toast style configuration
const toast = useToast({
  position: 'top-right',    // Position: top-left, top-right, bottom-left, bottom-right
  duration: 3000,           // Default duration
  maxToasts: 5             // Maximum simultaneous display count
})
```

### Advanced Usage
```typescript
// Toast with action button
toast.success('File uploaded successfully', {
  action: {
    label: 'View',
    onClick: () => navigateTo('/files')
  }
})

// Persistent Toast (requires manual close)
const persistentToast = toast.info('Processing...', { 
  persistent: true 
})

// Manual close
persistentToast.close()
```

## 2. Dialog Modals

Use `useDialog` to display confirmation or alert dialogs. This Hook is Promise-based for convenient async flow control.

### Basic Usage
```typescript
const dialog = useDialog()

// Confirmation dialog
const confirmed = await dialog.confirm({
  title: 'Confirm Delete',
  content: 'Are you sure you want to delete this record? This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Cancel'
})

if (confirmed) {
  // Execute delete logic
}

// Simple alert dialog
await dialog.alert('Operation successful', 'Notice')
```

### Advanced Configuration
```typescript
// Custom styled confirmation dialog
const result = await dialog.confirm({
  title: 'Important Operation',
  content: 'This is an irreversible operation, please confirm carefully.',
  confirmText: 'Confirm Execute',
  cancelText: 'Cancel',
  type: 'danger',           // Type: info, warning, danger, success
  persistent: true,         // Don't close on backdrop click
  width: '400px'           // Custom width
})
```

### Custom Content
```typescript
// Use Vue component as content
const result = await dialog.custom({
  title: 'Select Option',
  component: MyCustomComponent,
  props: {
    options: ['Option 1', 'Option 2', 'Option 3']
  },
  width: '500px'
})
```

## 3. Loading States

Use `useLoading` to manage global loading states.

### Basic Usage
```typescript
const loading = useLoading()

// Show loading
loading.start('Loading data...')

// Hide loading
loading.stop()

// Auto-managed async operation
await loading.wrap(async () => {
  await fetchData()
}, 'Fetching data...')
```

### Multi-task Management
```typescript
// Set different loading states for different tasks
const userLoading = useLoading('user')
const dataLoading = useLoading('data')

userLoading.start('Loading user info...')
dataLoading.start('Loading data...')

// Independent control
userLoading.stop()
dataLoading.stop()
```

## 4. Form Validation

Use `useFormValidation` for form validation, based on Zod schema.

### Basic Usage
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const { validate, errors, isValid } = useFormValidation(schema)

// Validate form
const formData = {
  email: 'user@example.com',
  password: '123456',
  confirmPassword: '123456'
}

const result = await validate(formData)
if (result.success) {
  // Submit form
  await submitForm(result.data)
}
```

### Real-time Validation
```typescript
const { validateField, errors } = useFormValidation(schema)

// Single field validation
const emailInput = ref('')
watch(emailInput, async (value) => {
  await validateField('email', value)
})
```

## 5. API Requests

Use `useApi` for API requests with automatic error handling and loading states.

### Basic Usage
```typescript
const { data, error, pending, refresh } = await useApi('/api/users')

// Request with parameters
const { data: user } = await useApi('/api/users/123', {
  method: 'GET',
  query: { include: 'profile' }
})

// POST request
const { data: newUser } = await useApi('/api/users', {
  method: 'POST',
  body: {
    name: 'John Doe',
    email: 'john@example.com'
  }
})
```

### Error Handling
```typescript
const { data, error } = await useApi('/api/users', {
  onError: (error) => {
    // Custom error handling
    toast.error(`Request failed: ${error.message}`)
  },
  retry: 3,              // Retry count
  retryDelay: 1000      // Retry delay (milliseconds)
})
```

## 6. Local Storage

Use `useStorage` for local storage management with reactive updates.

### Basic Usage
```typescript
// Simple value storage
const theme = useStorage('theme', 'light')

// Object storage
const userPrefs = useStorage('user-preferences', {
  language: 'en',
  notifications: true
})

// Auto sync
watch(theme, (newTheme) => {
  // Auto save when theme changes
  document.documentElement.setAttribute('data-theme', newTheme)
})
```

### Advanced Configuration
```typescript
// Use sessionStorage
const tempData = useStorage('temp-data', null, {
  storage: sessionStorage
})

// Custom serialization
const complexData = useStorage('complex-data', [], {
  serializer: {
    read: (value) => JSON.parse(value),
    write: (value) => JSON.stringify(value)
  }
})
```

## Best Practices

### 1. Error Boundaries
```typescript
// Wrap with try-catch in components
try {
  const result = await dialog.confirm({...})
  if (result) {
    await performAction()
    toast.success('Operation successful')
  }
} catch (error) {
  toast.error('Operation failed')
  console.error(error)
}
```

### 2. Type Safety
```typescript
// Define types for API responses
interface User {
  id: number
  name: string
  email: string
}

const { data } = await useApi<User[]>('/api/users')
// data now has correct typing
```

### 3. Performance Optimization
```typescript
// Use computed to avoid unnecessary recalculation
const isFormValid = computed(() => {
  return !Object.keys(errors.value).length
})

// Debounce input validation
const debouncedValidate = useDebounceFn(validateField, 300)
```

## Related Documentation

- [Form Validation Guide](./validation.md) - Detailed form validation instructions
- [API Conventions](../api/conventions.md) - API interface design specifications
- [Component Library](../components/rei-components.md) - UI component usage guide