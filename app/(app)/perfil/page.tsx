import type { Metadata } from 'next';
import { PerfilView } from '../../../src/views/PerfilView';

export const metadata: Metadata = {
    title: 'Perfil',
    robots: { index: false, follow: false },
};

export default function PerfilPage() {
    return <PerfilView />;
}
