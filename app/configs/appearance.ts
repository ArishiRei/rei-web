export const appearanceConfig = {
  theme: {
    default: 'auto',
    data: [
      {
        name: 'dark',
        value: 'dark',
        title: 'theme.dark',
      },
      {
        name: 'light',
        value: 'light',
        title: 'theme.light',
      },
      {
        name: 'auto',
        value: 'auto',
        title: 'theme.auto',
      }
    ]
  },
  colors: [
    {
      name: 'pink',
      title: '心爱粉',
      primary: '#f06e8e',
    },
    {
      name: 'blue',
      title: '智慧蓝',
      primary: '#4581e1'
    },
    {
      name: 'purple',
      title: '神秘紫',
      primary: '#b044b0',
    },
    {
      name: 'green',
      title: '自然绿',
      primary: '#46a12f',
    },
    {
      name: 'yellow',
      title: '活力黄',
      primary: '#f98d00',
    },
    {
      name: 'cyan',
      title: '神秘蓝',
      primary: '#199bb6',
    },
    {
      name: 'red',
      title: '活力红',
      primary: '#dd1818',
    },
    {
      name: 'custom',
      title: '自定义',
      primary: '',
    }
  ],
  background: {
    type: 'image', // 'image' or 'color'
    color: '',
    image: '/img/bg.jpg',
  },
  size: {}
}
