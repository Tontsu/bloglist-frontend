import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'


describe.only('<SimpleBlog />', () => {
  const mockHandler = jest.fn()
  const blog = {
    title: 'Masan blogi',
    author: 'Masa',
    url: 'masanurli',
    likes: 1
  }

  let blogComponent

  beforeEach(() => {
      blogComponent = shallow(<SimpleBlog blog={blog} onClick={mockHandler} />)
  })

  it('renders title, author and likes', () => {
    const contentDiv = blogComponent.find('.content')

    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)
    expect(contentDiv.text()).toContain(blog.likes, ' likes')
  })

  it('when like button is pressed twice, button handler is called twice', () => {
    const button = blogComponent.find('button')
    button.simulate('click')
    button.simulate('click')
    expect(mockHandler.mock.calls.length).toBe(2)
  })
})
