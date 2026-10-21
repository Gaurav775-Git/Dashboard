import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Register from '../pages/Register'

const { signUp } = vi.hoisted(() => ({ signUp: vi.fn() }))
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ register: signUp }) }))

describe('Register form', () => {
  beforeEach(() => {
    signUp.mockReset()
    signUp.mockResolvedValue({ user: { name: 'Alex Carter' } })
  })

  it('submits the password and reports mismatched confirmation', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Alex Carter' } })
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'alex@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'A-secure-pass1' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'different-pass1' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'A-secure-pass1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    await waitFor(() => expect(signUp).toHaveBeenCalledWith({
      name: 'Alex Carter',
      email: 'alex@example.com',
      company: '',
      password: 'A-secure-pass1',
    }))
  })
})
