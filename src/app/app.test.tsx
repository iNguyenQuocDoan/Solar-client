import { render, screen } from '@testing-library/react'
import { App } from '@/app/app'

describe('App', () => {
  it('renders the home page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Solar Client' })).toBeInTheDocument()
  })
})
