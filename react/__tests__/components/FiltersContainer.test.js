/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import FiltersContainer from '../../components/FiltersContainer'

describe('<FiltersContainer />', () => {
  beforeEach(() => {
    global.__RUNTIME__ = {
      hints: { mobile: false },
    }
  })

  it('should match snapshot', () => {
    const wrapper = shallow(
      <FiltersContainer
        getLinkProps={jest.fn()}
        map="c"
        rest=""
        params={{
          department: 'Eletronicos',
        }}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('shouldn\'t display unrelated categories', () => {
    const categoriesTree = [
      {
        Name: 'Eletrônicos',
        Link: '/Eletronicos',
        Quantity: 0,
        Children: [
          {
            Name: 'Smartphones',
            Link: '/Eletronicos/Smartphones',
            Quantity: 0,
          },
          {
            Name: 'Videogames',
            Link: '/Eletronicos/Videogames',
            Quantity: 0,
          },
          {
            Name: 'TVs',
            Link: '/Eletronicos/TVs',
            Quantity: 0,
          },
        ],
      },
      {
        Name: 'Livros',
        Link: '/Livros',
        Quantity: 0,
        Children: [
          {
            Name: 'HQs e Mangas',
            Link: '/Livros/HQs e Mangas',
            Quantity: 0,
          },
        ],
      },
    ]

    const wrapper = shallow(
      <FiltersContainer
        getLinkProps={jest.fn()}
        map="c"
        rest=""
        tree={categoriesTree}
        params={{
          department: 'Livros',
        }}
      />
    )

    const availableCategories = [
      {
        Name: 'HQs e Mangas',
        Link: '/Livros/HQs e Mangas',
      },
    ]

    expect(wrapper.instance().availableCategories).toMatchObject(availableCategories)
  })

  it('should be case insensitive when matching the available categories', () => {
    const categoriesTree = [
      {
        Name: 'Eletrônicos',
        Link: '/Eletronicos',
        Quantity: 0,
        Children: [
          {
            Name: 'Smartphones',
            Link: '/Eletronicos/Smartphones',
            Quantity: 0,
          },
          {
            Name: 'Videogames',
            Link: '/Eletronicos/Videogames',
            Quantity: 0,
          },
          {
            Name: 'TVs',
            Link: '/Eletronicos/TVs',
            Quantity: 0,
          },
        ],
      },
      {
        Name: 'Livros',
        Link: '/Livros',
        Quantity: 0,
        Children: [
          {
            Name: 'HQS E MANGAS',
            Link: '/Livros/HQs e Mangas',
            Quantity: 0,
          },
        ],
      },
    ]

    const wrapper = shallow(
      <FiltersContainer
        getLinkProps={jest.fn()}
        map="c"
        rest=""
        tree={categoriesTree}
        params={{
          department: 'livros',
        }}
      />
    )

    const availableCategories = [
      {
        Name: 'HQS E MANGAS',
        Link: '/Livros/HQs e Mangas',
      },
    ]

    expect(wrapper.instance().availableCategories).toMatchObject(availableCategories)
  })
})
