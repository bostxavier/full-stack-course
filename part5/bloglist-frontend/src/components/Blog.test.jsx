import { render, screen } from '@testing-library/react'
import Blog from './Blog'

let container

describe('<Blog />', () => {
  test('renders blog\'s title and author by default, but not url and likes', () => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    container = render(<Blog blog={blog} />).container
    const content = container.querySelector('.blogContent')

    expect(content).toHaveTextContent(blog.author)
    expect(content).toHaveTextContent(blog.title)
    expect(content).not.toHaveTextContent(blog.url)
    expect(content).not.toHaveTextContent('likes')
  })
})