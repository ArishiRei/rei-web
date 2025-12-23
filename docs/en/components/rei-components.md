# Rei Component Library Guide

This project provides a set of base components prefixed with `Rei`, encapsulated based on Material Web. All business pages **must** use these components; direct use of `md-*` is prohibited.

> **Note**: Components are configured for auto-import with path prefixes disabled. You can use the component names directly (e.g., `<ReiButton>`).

## Base Component List

### ReiButton
Button component supporting multiple variants.
- **Props**:
  - `variant`: `'filled'` (default) | `'outlined'` | `'elevated'` | `'text'`
- **Usage**:
  ```vue
  <ReiButton>Submit</ReiButton>
  <ReiButton variant="outlined">Cancel</ReiButton>
  ```

### ReiTextField
Text field component.
- **Props**:
  - `variant`: `'outlined'` (default) | `'filled'`
  - `label`: Label text
  - `type`: Input type (e.g., `'email'`, `'password'`)
- **Usage**:
  ```vue
  <ReiTextField label="Username" />
  <ReiTextField label="Password" type="password" variant="filled" />
  ```

### ReiCheckbox
Checkbox component.
- **Usage**:
  ```vue
  <ReiCheckbox />
  ```

### ReiRadio
Radio button component.
- **Usage**:
  ```vue
  <ReiRadio name="group1" value="a" />
  ```

### ReiIcon
Icon component used to display Material Symbols.
- **Usage**:
  ```vue
  <ReiIcon>settings</ReiIcon>
  ```

### ReiIconButton
Icon button component.
- **Props**:
  - `variant`: `'standard'` (default) | `'filled'` | `'filled-tonal'` | `'outlined'`
- **Usage**:
  ```vue
  <ReiIconButton>
    <ReiIcon>favorite</ReiIcon>
  </ReiIconButton>
  ```

### ReiFab
Floating Action Button (FAB).
- **Props**:
  - `variant`: `'surface'` (default) | `'primary'` | `'secondary'` | `'tertiary'`
  - `size`: `'medium'` (default) | `'small'` | `'large'`
  - `label`: Text label for extended FAB
- **Slots**:
  - `icon`: Icon slot
- **Usage**:
  ```vue
  <ReiFab label="Add">
    <ReiIcon slot="icon">add</ReiIcon>
  </ReiFab>
  ```
