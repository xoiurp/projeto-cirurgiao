import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Login | Projeto Cirurgião',
  description: 'Faça login na plataforma Projeto Cirurgião',
};

/**
 * Página de login
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
