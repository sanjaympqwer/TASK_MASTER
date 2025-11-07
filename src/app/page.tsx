import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AppLogo } from '@/components/shared/AppLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex h-full min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
        <div className="mb-8">
            <AppLogo />
        </div>
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
                <CardDescription>Sign in to continue to TaskMaster Pro</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="underline text-primary">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    </main>
  );
}
