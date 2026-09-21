/** Skip-link "Saltar al contenido": solo visible con foco de teclado. */
export function SkipLink() {
    return (
        <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300] focus:bg-[#FFD600] focus:text-black focus:border-2 focus:border-black focus:px-4 focus:py-2 focus:font-black focus:uppercase focus:text-xs focus:tracking-widest"
        >
            Saltar al contenido
        </a>
    );
}
