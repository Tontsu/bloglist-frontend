import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/Blog'
jest.mock('./services/blogs')
import blogService from './services/blogs'

describe('<App />', () => {
  let app
  describe('when user is not logged', () => {
    beforeEach(() => {
      app = mount(<App />)
    })

    it('does not render blogs', () => {
      app.update()
      const blogComponents = app.find(Blog)
      expect(blogComponents.length).toEqual(0)
    })
  }),

  describe('when user is logged', () => {
    beforeEach(() => {
      const user = {
        username: 'tester',
        token: '1231231214',
        name: 'Teuvo Testaaja'
      }
      localStorage.setItem('loggedUser', JSON.stringify(user))
      app = mount(<App />)
    })

    it('all blogs are rendered', () => {
      app.update()
      console.log(localStorage.getItem('loggedUser'))
      console.log(app.find(Blog))
      const blogComponents = app.find(Blog)
      expect(blogComponents.length).toEqual(3)
    })
  })
})
