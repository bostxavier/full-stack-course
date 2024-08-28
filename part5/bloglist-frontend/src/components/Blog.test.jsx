import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'hellas',
      name: 'Arto Hellas',
      id: '66ce02d9789f170a563292fa'
    }
  }

  const user = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inhib3N0IiwiaWQiOiI2NmNlMDJjNDc4OWYxNzBhNTYzMjkyZjgiLCJpYXQiOjE3MjQ4MjkxMDd9.PCpgTvsi69LVTGznhWvxR0OjX60jrojvxPX_2G2MI5g',
    username: 'xbost',
    name: 'Xavier'
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} />).container
  })

  test('renders blog\'s title and author by default, but not url and likes', () => {
    const content = container.querySelector('.blogContent')

    expect(content).toHaveTextContent(blog.author)
    expect(content).toHaveTextContent(blog.title)
    expect(content).not.toHaveTextContent(blog.url)
    expect(content).not.toHaveTextContent('likes')
  })

  test('renders blog\'s url and likes once `view` button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const content = container.querySelector('.blogContent')

    expect(content).toHaveTextContent(blog.url)
    expect(content).toHaveTextContent('likes')
  })
})