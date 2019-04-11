export default [
  {
    Id: 1,
    Name: 'Eletrônicos',
    Link: '/Eletronicos',
    Quantity: 0,
    Children: [
      {
        Id: 2,
        Name: 'Smartphones',
        Link: '/Eletronicos/Smartphones',
        Quantity: 0,
      },
      {
        Id: 3,
        Name: 'Videogames',
        Link: '/Eletronicos/Videogames',
        Quantity: 0,
      },
      {
        Id: 4,
        Name: 'TVs',
        Link: '/Eletronicos/TVs',
        Quantity: 0,
      },
    ],
  },
  {
    Id: 5,
    Name: 'Livros',
    Link: '/Livros',
    Quantity: 0,
    Children: [
      {
        Id: 6,
        Name: 'HQs e Mangas',
        Link: '/Livros/HQs e Mangas',
        Quantity: 0,
      },
    ],
  },
  {
    Id: 7,
    Name: 'Roupas',
    Link: '/Roupas',
    Quantity: 0,
    Children: [
      {
        Id: 8,
        Name: 'Blusas',
        Link: '/Roupas/Blusas',
        Quantity: 0,
      },
      {
        Id: 9,
        Name: 'Calças',
        Link: '/Roupas/Calcas',
        Quantity: 0,
      },
      {
        Id: 10,
        Name: 'Moletom',
        Link: '/Roupas/Moletom',
        Quantity: 0,
      },
    ],
  },
]

export const numberOfFilters = 10
