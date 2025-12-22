export const headerConfig = {
  navbar: [
    {
      path: '/',
      title: 'header.nav.home'
    },
    {
      path: '/blog',
      title: 'header.nav.blog'
    },
    {
      path: '/about',
      title: 'header.nav.about'
    },
    {
      path: '/settings',
      title: 'header.nav.settings.title',
      children: [
        {
          path: '/settings/appearance',
          title: 'header.nav.settings.appearance'
        },
        {
          path: '/settings/language',
          title: 'header.nav.settings.language'
        },
      ]
    }
  ]
}
