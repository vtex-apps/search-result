/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import FilterNavigator from '../FilterNavigator'

describe('<FilterNavigator />', () => {
  beforeEach(() => {
    global.__RUNTIME__ = {
      hints: { mobile: false },
    }
  })

  it('should match snapshot', () => {
    const wrapper = shallow(
      <FilterNavigator
        getLinkProps={jest.fn()}
        map="c"
        rest=""
        query="Eletronicos"
        runtime={{ hints: { mobile: false } }}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should display unrelated categories', () => {
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
      <FilterNavigator
        getLinkProps={jest.fn()}
        map="c"
        rest=""
        tree={categoriesTree}
        query="Livros"
        runtime={{ hints: { mobile: false } }}
      />
    )

    const availableCategories = [
      {
        Name: 'Livros',
        Link: '/Livros',
      },
      {
        Name: 'HQs e Mangas',
        Link: '/Livros/HQs e Mangas',
      }
    ]

    expect(wrapper.instance().getAvailableCategories()).toMatchObject(availableCategories)
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
      <FilterNavigator
        getLinkProps={jest.fn()}
        map="c"
        rest=""
        tree={categoriesTree}
        query="livros"
        runtime={{ hints: { mobile: false } }}
      />
    )

    const availableCategories = [
      {
        Name: 'Livros',
        Link: '/Livros',
      },
      {
        Name: 'HQS E MANGAS',
        Link: '/Livros/HQs e Mangas',
      }
    ]

    expect(wrapper.instance().getAvailableCategories()).toMatchObject(availableCategories)
  })
})
