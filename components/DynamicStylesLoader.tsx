"use client";

import { useEffect } from 'react';

/**
 * Loads non-critical CSS after the initial page load to improve performance.
 */
export default function DynamicStylesLoader() {
    useEffect(() => {
        const loadNonCriticalCSS = () => {
            // Check if non-critical.css exists before attempting to load
            // For now, we assume it exists or we will create an empty one to avoid errors
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/non-critical.css';
            link.media = 'print';
            link.onload = function () {
                (this as HTMLLinkElement).media = 'all';
            };
            document.head.appendChild(link);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadNonCriticalCSS);
        } else {
            setTimeout(loadNonCriticalCSS, 0);
        }

        return () => {
            document.removeEventListener('DOMContentLoaded', loadNonCriticalCSS);
        };
    }, []);

    return null;
}



