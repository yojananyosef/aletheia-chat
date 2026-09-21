/**
 * Warmup del dev-server: precompila las rutas pesadas antes de los tests para
 * que la primera navegación de cada worker no compita compilando en frío
 * (con `fullyParallel` los timeouts de 5s caían viendo solo `loading.tsx`).
 */
async function warm(path: string) {
    const res = await fetch(`http://localhost:3000${path}`);
    if (!res.ok) throw new Error(`warmup ${path}: ${res.status}`);
    await res.text();
}

export default async function globalSetup() {
    await warm('/');
    await warm('/genesis/1');
    await warm('/hechos/1');
}
