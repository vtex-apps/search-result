export default [
  {
    id: 'eletronicos',
    name: 'Eletrônicos',
    value: 'eletronicos',
    link: '/Eletronicos',
    quantity: 0,
    map: 'c',
    key: 'c',
    children: [
      {
        id: 'smartphones',
        name: 'Smartphones',
        value: 'smartphones',
        link: '/Eletronicos/Smartphones',
        quantity: 0,
        map: 'c',
        key: 'c',
        href: 'http:://example.com',
        children: [
          {
            id: 'android',
            name: 'Android',
            value: 'android',
            link: '/eletronicos/smartphones/android',
            quantity: 0,
            map: 'c',
            key: 'c',
          },
        ],
      },
      {
        id: 'videogames',
        name: 'Videogames',
        value: 'videogames',
        link: '/Eletronicos/Videogames',
        quantity: 0,
        map: 'c',
        key: 'c',
      },
      {
        id: 'tvs',
        name: 'TVs',
        value: 'tvs',
        link: '/Eletronicos/TVs',
        quantity: 0,
        map: 'c',
        key: 'c',
      },
    ],
  },
  {
    id: 'livros',
    name: 'Livros',
    link: '/Livros',
    quantity: 0,
    children: [
      {
        id: 'qs',
        name: 'HQs e Mangas',
        link: '/Livros/HQs e Mangas',
        quantity: 0,
      },
    ],
  },
  {
    id: 'roupas',
    name: 'Roupas',
    link: '/Roupas',
    quantity: 0,
    children: [
      {
        id: 'blusas',
        name: 'Blusas',
        link: '/Roupas/Blusas',
        quantity: 0,
      },
      {
        id: 'calca',
        name: 'Calças',
        link: '/Roupas/Calcas',
        quantity: 0,
      },
      {
        id: 'moletom',
        name: 'Moletom',
        link: '/Roupas/Moletom',
        quantity: 0,
      },
    ],
  },
]

export const numberOfFilters = 10
