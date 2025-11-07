import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AppLogo } from '@/components/shared/AppLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';

export default async function SignupPage() {
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
                <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
                <CardDescription>Enter your details to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm />

                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/" className="underline text-primary">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    </main>
  );
}
