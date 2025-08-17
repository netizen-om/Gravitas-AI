    'use client';

    import React, { useEffect } from 'react';
    import { Toaster } from 'sonner';
    import { SessionProvider } from 'next-auth/react';
    import { usePathname, useSearchParams } from 'next/navigation';
    import posthog from 'posthog-js';
    import { PostHogProvider } from 'posthog-js/react';

    // Initialize PostHog on the client side
    if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        //@ts-ignore
        disable: process.env.NODE_ENV === 'development',
        loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
        },
        person_profiles: 'always',
    });
    }

    /**
     * This component is essential for tracking page views in a Next.js App Router application.
     * It captures the '$pageview' event whenever the URL pathname or search parameters change.
     */
    function PostHogPageview(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
        let url = window.origin + pathname;
        if (searchParams && searchParams.toString()) {
            url = url + `?${searchParams.toString()}`;
        }
        posthog.capture('$pageview', {
            '$current_url': url,
        });
        }
    }, [pathname, searchParams]);

    return null;
    }

    export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
        {/* PostHogProvider wraps your app, making PostHog available everywhere */}
        <PostHogProvider client={posthog}>
            <PostHogPageview />
            {children}
            <Toaster richColors theme="dark" />
        </PostHogProvider>
        </SessionProvider>
    );
    };
