/**
 * @file server/api/blog/posts.get.ts
 * @description 获取博客文章列表 (Mock Data)
 */

export default defineEventHandler(() => {
  // 模拟网络延迟
  // await new Promise(resolve => setTimeout(resolve, 500));

  return {
    code: 200,
    message: 'success',
    data: [
      {
        id: 1,
        title: 'Nuxt 4 Architecture Guide',
        excerpt: 'Exploring the split context architecture in Nuxt 4.',
        date: '2025-12-20',
        author: 'ArishiRei'
      },
      {
        id: 2,
        title: 'Material Web Components with Vue',
        excerpt: 'How to integrate Google Material Web components in Vue 3.',
        date: '2025-12-21',
        author: 'ArishiRei'
      },
      {
        id: 3,
        title: 'API Mocking Strategies',
        excerpt: 'Best practices for mocking APIs in Nuxt development.',
        date: '2025-12-22',
        author: 'ArishiRei'
      }
    ]
  };
});
