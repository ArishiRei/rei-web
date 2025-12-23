# 全局 Hooks 指南

本项目封装了一系列全局 Composition API Hooks，用于处理通用的 UI 交互逻辑。

## 1. 消息提示 (Toast)

使用 `useToast` 显示全局消息提示。

### 用法
```typescript
const toast = useToast()

// 显示不同类型的消息
toast.info('这是一条普通消息')
toast.success('操作成功')
toast.warning('警告信息')
toast.error('发生错误')

// 自定义持续时间 (毫秒)
toast.success('这条消息显示 5 秒', 5000)
```

## 2. 模态框 (Dialog)

使用 `useDialog` 显示确认框或提示框。该 Hook 基于 Promise，便于异步流程控制。

### 用法
```typescript
const dialog = useDialog()

// 确认框
const confirmed = await dialog.confirm({
  title: '确认删除',
  content: '确定要删除这条记录吗？此操作不可恢复。',
  confirmText: '删除',
  cancelText: '取消'
})

if (confirmed) {
  // 执行删除逻辑
}

// 简单提示框
await dialog.alert('操作成功', '提示')
```
