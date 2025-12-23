<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { BoldIcon, ItalicIcon, ListBulletIcon, QueueListIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Update content if modelValue changes externally
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="rei-editor">
    <div v-if="editor" class="editor-toolbar">
      <ReiIconButton
        variant="standard"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <BoldIcon class="icon-size" />
      </ReiIconButton>
      
      <ReiIconButton
        variant="standard"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <ItalicIcon class="icon-size" />
      </ReiIconButton>

      <div class="divider" />

      <ReiIconButton
        variant="standard"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <ListBulletIcon class="icon-size" />
      </ReiIconButton>

      <ReiIconButton
        variant="standard"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <QueueListIcon class="icon-size" />
      </ReiIconButton>
    </div>
    
    <div class="editor-content-wrapper">
      <EditorContent :editor="editor" class="editor-content" />
    </div>
  </div>
</template>

<style scoped>
.rei-editor {
  border: 1px solid var(--md-sys-color-outline);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--md-sys-color-surface);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-low);
}

.divider {
  width: 1px;
  height: 24px;
  background-color: var(--md-sys-color-outline-variant);
  margin: 0 4px;
}

.is-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.editor-content-wrapper {
  padding: 16px;
  min-height: 200px;
}

/* TipTap ProseMirror Styles */
:deep(.ProseMirror) {
  outline: none;
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  color: var(--md-sys-color-on-surface);
}

:deep(.ProseMirror p) {
  margin-bottom: 1em;
}

:deep(.ProseMirror ul), :deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.icon-size {
  width: 20px;
  height: 20px;
}
</style>
