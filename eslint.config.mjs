import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'next-env.d.ts',
            'playwright-report/**',
            'test-results/**',
        ],
    },
    ...Object.values(nextCoreWebVitals),
    ...Object.values(nextTypescript),
];

export default eslintConfig;
