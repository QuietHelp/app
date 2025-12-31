'use client';

import { Suspense } from 'react';
import MatchingContent from './MatchingContent';

export default function MatchingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <MatchingContent />
    </Suspense>
  );
}
