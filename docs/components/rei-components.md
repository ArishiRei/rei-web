# Rei 组件库指南

本项目基于 Material Web 封装了一套 `Rei` 前缀的基础组件。所有业务页面**必须**使用这些组件，禁止直接使用 `md-*`。

> **注意**: 组件已配置自动导入，且禁用了路径前缀，直接使用组件名即可 (e.g. `<ReiButton>`)。

## 基础组件列表

### ReiButton
按钮组件，支持多种变体。
- **Props**:
  - `variant`: `'filled'` (默认) | `'outlined'` | `'elevated'` | `'text'`
- **用法**:
  ```vue
  <ReiButton>Submit</ReiButton>
  <ReiButton variant="outlined">Cancel</ReiButton>
  ```

### ReiTextField
输入框组件。
- **Props**:
  - `variant`: `'outlined'` (默认) | `'filled'`
  - `label`: 标签文本
  - `type`: 输入类型 (e.g. `'email'`, `'password'`)
- **用法**:
  ```vue
  <ReiTextField label="Username" />
  <ReiTextField label="Password" type="password" variant="filled" />
  ```

### ReiCheckbox
复选框组件。
- **用法**:
  ```vue
  <ReiCheckbox />
  ```

### ReiRadio
单选框组件。
- **用法**:
  ```vue
  <ReiRadio name="group1" value="a" />
  ```

### ReiIcon
图标组件，用于显示 Material Symbols。
- **用法**:
  ```vue
  <ReiIcon>settings</ReiIcon>
  ```

### ReiIconButton
图标按钮组件。
- **Props**:
  - `variant`: `'standard'` (默认) | `'filled'` | `'filled-tonal'` | `'outlined'`
- **用法**:
  ```vue
  <ReiIconButton>
    <ReiIcon>favorite</ReiIcon>
  </ReiIconButton>
  ```

### ReiFab
悬浮操作按钮 (Floating Action Button)。
- **Props**:
  - `variant`: `'surface'` (默认) | `'primary'` | `'secondary'` | `'tertiary'`
  - `size`: `'medium'` (默认) | `'small'` | `'large'`
  - `label`: 扩展 FAB 的文本标签
- **Slots**:
  - `icon`: 图标插槽
- **用法**:
  ```vue
  <ReiFab label="Add">
    <ReiIcon slot="icon">add</ReiIcon>
  </ReiFab>
  ```
