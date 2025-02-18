import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignInForm from '../SignInForm';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('SignInForm', () => {
  const mockOnForgotPasswordClick = jest.fn();
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
    });
  });

  it('affiche le formulaire correctement', () => {
    render(
      <BrowserRouter>
        <SignInForm onForgotPasswordClick={mockOnForgotPasswordClick} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mot de passe oublié/i })).toBeInTheDocument();
  });

  it('valide le mot de passe vide', async () => {
    render(
      <BrowserRouter>
        <SignInForm onForgotPasswordClick={mockOnForgotPasswordClick} />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez entrer votre mot de passe',
      });
    });
  });

  it('valide le format de l\'email', async () => {
    render(
      <BrowserRouter>
        <SignInForm onForgotPasswordClick={mockOnForgotPasswordClick} />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email valide',
      });
    });
  });

  it('connecte l\'utilisateur avec succès', async () => {
    render(
      <BrowserRouter>
        <SignInForm onForgotPasswordClick={mockOnForgotPasswordClick} />
      </BrowserRouter>
    );

    mockSignIn.mockResolvedValueOnce({ error: null });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'Password123');
    });
  });

  it('désactive les champs pendant la connexion', async () => {
    render(
      <BrowserRouter>
        <SignInForm onForgotPasswordClick={mockOnForgotPasswordClick} />
      </BrowserRouter>
    );

    mockSignIn.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    const forgotPasswordButton = screen.getByRole('button', { name: /mot de passe oublié/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(forgotPasswordButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Connexion...');

    await waitFor(() => {
      expect(emailInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
      expect(forgotPasswordButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Se connecter');
    });
  });

  it('appelle onForgotPasswordClick quand on clique sur le lien', () => {
    render(
      <BrowserRouter>
        <SignInForm onForgotPasswordClick={mockOnForgotPasswordClick} />
      </BrowserRouter>
    );

    const forgotPasswordButton = screen.getByRole('button', { name: /mot de passe oublié/i });
    fireEvent.click(forgotPasswordButton);

    expect(mockOnForgotPasswordClick).toHaveBeenCalled();
  });
});
