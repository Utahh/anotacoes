const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'menu', component: () => import('pages/MenuPage.vue') },
      { path: 'lista/:type', component: () => import('pages/ListPage.vue') },
      { path: 'admin', component: () => import('pages/AdminUploadPage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
