import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog, handleFieldChange, title, author, url, addBlogVisible, app }) => {
  const hideWhenVisible = { display: addBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: addBlogVisible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
          <button onClick={e => app.setState({ addBlogVisible: true })}>add blog</button>
      </div>
      <div style={showWhenVisible}>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
            <div>
              title
              <input
                type="text"
                name="title"
                value={title}
                onChange={handleFieldChange}
              />
            </div>
            <div>
              author
              <input
                type="text"
                name="author"
                value={author}
                onChange={handleFieldChange}
              />
            </div>
            <div>
              url
              <input
                type="text"
                name="url"
                value={url}
                onChange={handleFieldChange}
              />
            </div>
            <button type="submit">create</button>
          </form>
          <button onClick={e => app.setState({ addBlogVisible: false })}>hide</button>
        </div>
      </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  addBlogVisible: PropTypes.string.isRequired,
  app: PropTypes.object.isRequired
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      title: '',
      author: '',
      url: '',
      username: '',
      password: '',
      error: null,
      user: null,
      addBlogVisible: ''
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  }

  addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title: this.state.title,
        author: this.state.author,
        url: this.state.url,
        userId: this.state.user.userId
      })
      this.setState({
        error: `luotiin blogi '${this.state.title}'`
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
      this.setState({ blogs: this.state.blogs.concat(newBlog), title: '', author: '', url: ''})
    } catch (exception) {
      this.setState({
        error: 'virhe blogin luonnissa'
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  login = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username: this.state.username,
      password: this.state.password
    })

    window.localStorage.setItem('loggedUser', JSON.stringify(user))
    this.setState({ username: '', password: '', user })
  } catch (exception) {
    this.setState({
      error: 'käyttäjätunnus tai salasana virheellinen',
    })
    setTimeout(() => {
      this.setState({ error: null })
    }, 5000)
  }
}

  handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    this.setState({user: null})
  }

  render() {
    if (this.state.user === null) {
      return (
      <div>
        <h2>Kirjaudu sovellukseen</h2>
        <p>{this.state.error}</p>
        <form onSubmit={this.login}>
            <div>
              käyttäjätunnus
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleFieldChange}
              />
            </div>
            <div>
              salasana
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleFieldChange}
              />
            </div>
            <button type="submit">kirjaudu</button>
          </form>
        </div>
      )
    }
    return (
      <div>
        <h2>blogs</h2>
        <p>{this.state.error}</p>
        {this.state.user.name} logged in
        <button onClick={this.handleLogout}>logout</button>

        <BlogForm
          addBlog={this.addBlog}
          handleFieldChange={this.handleFieldChange}
          title={this.state.title}
          author={this.state.author}
          url={this.state.url}
          addBlogVisible={this.state.addBlogVisible}
          app={this}
        />

        {this.state.blogs.map(blog =>
          <Blog key={blog._id} blog={blog}/>
        )}
      </div>
    );
  }
}

export default App;
