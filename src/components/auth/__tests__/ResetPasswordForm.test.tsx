import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../ResetPasswordForm';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/supabase-client';

// Mocks
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/lib/supabase/supabase-client', () => ({
  supabase: {
    auth: {
      updateUser: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

describe('ResetPasswordForm', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    // Simuler un hash valide dans l'URL
    Object.defineProperty(window, 'location', {
      value: { hash: '#access_token=valid-token' },
      writable: true,
    });
    // Mock getUser par défaut pour simuler un token valide
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ error: null });
  });

  it('affiche le formulaire correctement', () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText(/nouveau mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mettre à jour le mot de passe/i })).toBeInTheDocument();
    expect(screen.getByText(/6 caractères et 1 majuscule minimum/i)).toBeInTheDocument();
  });

  it('vérifie que les champs sont requis', async () => {
    render(<ResetPasswordForm />);

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
      });
    });
  });

  it('vérifie que les mots de passe correspondent', async () => {
    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'DifferentPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
      });
    });
  });

  it('valide les règles du mot de passe - longueur minimale', async () => {
    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'short' },
    });

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères et une majuscule',
      });
    });
  });

  it('valide les règles du mot de passe - majuscule requise', async () => {
    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères et une majuscule',
      });
    });
  });

  it('met à jour le mot de passe avec succès', async () => {
    render(<ResetPasswordForm />);

    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({ error: null });

    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'NewPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'NewPassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NewPassword123',
      });
      expect(toast).toHaveBeenCalledWith({
        title: 'Succès',
        description: 'Votre mot de passe a été mis à jour. Vous allez être redirigé vers la page de connexion.',
      });
    });

    // Vérifie que le bouton est désactivé pendant le chargement
    expect(screen.getByRole('button', { name: /mise à jour/i })).toBeDisabled();

    // Vérifie la redirection après 2 secondes
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth');
    }, { timeout: 2500 });
  });

  it('gère les erreurs de l\'API', async () => {
    render(<ResetPasswordForm />);

    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      error: { message: 'Une erreur est survenue' },
    });

    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'NewPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'NewPassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue',
      });
    });
  });

  it('gère les erreurs de rate limit', async () => {
    render(<ResetPasswordForm />);

    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
      error: { message: 'rate limit exceeded' },
    });

    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'NewPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'NewPassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Trop de tentatives. Veuillez réessayer plus tard.',
      });
    });
  });

  it('affiche le message de lien expiré', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      error: { message: 'Token expired' },
    });

    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByText(/ce lien de réinitialisation n'est plus valide/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /demander un nouveau lien/i })).toBeInTheDocument();
    });
  });

  it('redirige vers la page de mot de passe oublié quand le lien est expiré', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      error: { message: 'Token expired' },
    });

    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /demander un nouveau lien/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /demander un nouveau lien/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/auth', { state: { showForgotPassword: true } });
  });

  it('gère le cas où il n\'y a pas de hash dans l\'URL', async () => {
    Object.defineProperty(window, 'location', {
      value: { hash: '' },
      writable: true,
    });

    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByText(/ce lien de réinitialisation n'est plus valide/i)).toBeInTheDocument();
    });
  });

  it('gère les erreurs lors de la vérification du token', async () => {
    (supabase.auth.getUser as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByText(/ce lien de réinitialisation n'est plus valide/i)).toBeInTheDocument();
    });
  });

  it('désactive les champs pendant la mise à jour', async () => {
    render(<ResetPasswordForm />);

    (supabase.auth.updateUser as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const newPasswordInput = screen.getByLabelText(/nouveau mot de passe/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /mettre à jour le mot de passe/i });

    fireEvent.change(newPasswordInput, { target: { value: 'NewPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword123' } });

    fireEvent.click(submitButton);

    expect(newPasswordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Mise à jour...');

    await waitFor(() => {
      expect(newPasswordInput).not.toBeDisabled();
      expect(confirmPasswordInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Mettre à jour le mot de passe');
    });
  });

  it('gère les erreurs de token invalide', async () => {
    (supabase.auth.getUser as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le lien de réinitialisation est invalide ou a expiré',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/auth', { state: { showForgotPassword: true } });
    });
  });

  it('redirige après une mise à jour réussie', async () => {
    jest.useFakeTimers();
    (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'NewPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'NewPassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /mettre à jour le mot de passe/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Succès',
        description: 'Votre mot de passe a été mis à jour. Vous allez être redirigé vers la page de connexion.',
      });
    });

    jest.advanceTimersByTime(2000);
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
    jest.useRealTimers();
  });
});
