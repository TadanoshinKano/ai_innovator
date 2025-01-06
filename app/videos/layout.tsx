// app/videos/layout.tsx
import { Suspense } from 'react';

export default async function VideosLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            {children}
        </Suspense>
    )
} 