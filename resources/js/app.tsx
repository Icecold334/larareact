import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    // resolve: (name) => {
    //     const pages = import.meta.glob('./pages/**/*.{jsx,tsx}');
    //     const match = pages[`./pages/${name}.jsx`] || pages[`./pages/${name}.tsx`];
    //     const matchString = match.toString();
    //     console.log(matchString.match(/\/pages\/.*?\.(jsx|tsx)/)[0]);

    //     // Ekstrak path dari '/pages' sampai '.jsx' atau '.tsx'
    //     const extractedPath = '.' + matchString.match(/\/pages\/.*?\.(jsx|tsx)/)[0];
    //     //
    //     return resolvePageComponent(extractedPath, pages);
    // },
    resolve: async (name) => {
        const pages = import.meta.glob('./pages/**/*.{tsx,jsx}');

        const extensions = ['tsx', 'jsx'];

        for (const ext of extensions) {
            const path = `./pages/${name}.${ext}`;
            if (pages[path]) {
                const module = await pages[path]();
                return module.default;
            }
        }

        throw new Error(`Page not found: ${name}`);
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#ffff',
    },
});

// This will set light / dark mode on load...
initializeTheme();
