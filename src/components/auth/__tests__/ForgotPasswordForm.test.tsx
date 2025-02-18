import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordForm from '../ForgotPasswordForm';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/supabase-client';

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/lib/supabase/supabase-client', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

const mockResetPasswordForEmail = supabase.auth.resetPasswordForEmail as jest.Mock;

describe('ForgotPasswordForm', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire correctement', () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retour/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer le lien/i })).toBeInTheDocument();
  });

  it('valide l\'email vide', async () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez entrer votre adresse email',
      });
    });
  });

  it('valide le format de l\'email', async () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

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

  it('envoie la demande de réinitialisation avec succès', async () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />);

    mockResetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null,
    });

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: expect.any(String) }
      );
      expect(toast).toHaveBeenCalledWith({
        title: 'Email envoyé',
        description: 'Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.',
      });
    });
  });

  it('désactive les champs pendant l\'envoi', async () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />);

    mockResetPasswordForEmail.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /envoyer le lien/i });
    const backButton = screen.getByRole('button', { name: /retour/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(backButton).not.toBeDisabled();

    await waitFor(() => {
      expect(emailInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
      expect(backButton).not.toBeDisabled();
    });
  });

  it('retourne à la page précédente lors du clic sur retour', () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /retour/i });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('empêche les tentatives trop fréquentes', async () => {
    render(<ForgotPasswordForm onBack={mockOnBack} />);

    // Première tentative
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

    // Deuxième tentative immédiate
    fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez patienter une minute avant de réessayer',
      });
    });
  });

  it('gère les erreurs de rate limit', async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({
      error: { message: 'rate limit exceeded' },
    });

    render(<ForgotPasswordForm onBack={mockOnBack} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Trop de tentatives. Veuillez réessayer plus tard.',
      });
    });
  });

  it('redirige après un envoi réussi', async () => {
    jest.useFakeTimers();
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });

    render(<ForgotPasswordForm onBack={mockOnBack} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Email envoyé',
        description: 'Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.',
      });
    });

    jest.advanceTimersByTime(2000);
    expect(mockOnBack).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
