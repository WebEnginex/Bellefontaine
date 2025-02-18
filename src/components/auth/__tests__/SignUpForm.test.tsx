import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpForm from '../SignUpForm';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Mocks
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('SignUpForm', () => {
  const mockOnSuccess = jest.fn();
  const mockSignUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
  });

  it('affiche le formulaire correctement', () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
    expect(screen.getByText(/6 caractères et 1 majuscule minimum/i)).toBeInTheDocument();
  });

  it('vérifie que les champs sont requis', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
      });
    });
  });

  it('valide le format de l\'email', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'Password123' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email valide',
      });
    });
  });

  it('valide les règles du mot de passe - longueur minimale', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'short' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères et une majuscule',
      });
    });
  });

  it('valide les règles du mot de passe - majuscule requise', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères et une majuscule',
      });
    });
  });

  it('inscrit l\'utilisateur avec succès et affiche la boîte de dialogue', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'Password123' } });

    mockSignUp.mockResolvedValueOnce({});

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'john@example.com',
        'Password123',
        'John',
        'Doe'
      );
      expect(screen.getByText(/vérifiez votre boîte mail/i)).toBeInTheDocument();
    });
  });

  it('gère les erreurs de rate limit', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'Password123' } });

    mockSignUp.mockRejectedValueOnce(new Error('rate limit exceeded'));

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Trop de tentatives. Veuillez réessayer plus tard.',
      });
    });
  });

  it('désactive les champs pendant l\'inscription', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    mockSignUp.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'Password123' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(screen.getByLabelText(/prénom/i)).toBeDisabled();
    expect(screen.getByLabelText(/nom/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/mot de passe/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /inscription/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByLabelText(/prénom/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/nom/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/email/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/mot de passe/i)).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /s'inscrire/i })).not.toBeDisabled();
    });
  });

  it('ferme la boîte de dialogue et appelle onSuccess', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    mockSignUp.mockResolvedValueOnce({});

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'Password123' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(/vérifiez votre boîte mail/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /compris/i }));

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('gère les erreurs d\'inscription', async () => {
    render(
      <BrowserRouter>
        <SignUpForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'Password123' } });

    mockSignUp.mockRejectedValueOnce(new Error('Une erreur est survenue'));

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue',
      });
    });
  });
});
