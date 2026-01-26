import { Suspense } from 'react';
import SignUpContent from './content';

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
