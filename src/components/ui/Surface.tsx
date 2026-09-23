import React from 'react';

interface SurfaceProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    onDoubleClick?: () => void;
    onTouchStart?: () => void;
    dataAida?: 'attention' | 'interest' | 'desire' | 'action';
    dataCta?: 'primary' | 'secondary';
    active?: boolean;
    elevation?: boolean;
    ariaLabel?: string;
    /** Estado pulsado (p. ej. like activo): se expone como aria-pressed + doble-Enter lo alterna. */
    pressed?: boolean;
}

export const Surface: React.FC<SurfaceProps> = ({
    children,
    className = "",
    onClick,
    onDoubleClick,
    onTouchStart,
    dataAida,
    dataCta,
    active,
    elevation = true,
    ariaLabel,
    pressed
}) => {
    const isPrimary = dataCta === 'primary';
    const interactive = !!(onClick || onDoubleClick || onTouchStart);
    // Si el llamador trae su propia sombra (p. ej. offset 4px de las burbujas), no inyectamos
    // la nuestra: dos shadow-[...] en el mismo elemento compiten en cascada y degradan el borde.
    const hasOwnShadow = className.includes('shadow-');

    return (
        <div
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onTouchStart={onTouchStart}
            onKeyDown={interactive ? (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onClick) {
                    e.preventDefault();
                    onClick();
                }
            } : undefined}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-pressed={pressed}
            data-aida={dataAida}
            data-cta={dataCta}
            aria-label={ariaLabel}
            className={`
                rounded-none border-2 border-[#141413] dark:border-white/20
                transition-all duration-150 ease-out
                ${isPrimary ? 'bg-[#FFD600]' : active ? 'bg-[#EFE9DE] dark:bg-[#252320]' : className.includes('bg-') ? '' : 'bg-[#FAF9F5] dark:bg-[#1F1E1B] dark:text-[#EDE9E1]'}
                ${interactive ? `cursor-pointer ${elevation ? `hover:-translate-y-0.5 ${hasOwnShadow ? '' : 'shadow-[3px_3px_0_#141413] dark:shadow-[3px_3px_0_#000]'}` : 'hover:bg-[#F5F0E8] dark:hover:bg-[#252320]'} active:translate-y-0 ${hasOwnShadow ? '' : 'active:shadow-none'} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-[#FFD600]` : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export const Avatar: React.FC<{ letter: string; color?: string; size?: 'sm' | 'md' | 'lg'; borderColor?: string }> = ({
    letter,
    color = "bg-[#FFD600]",
    size = "md",
    borderColor = "border-[#141413] dark:border-[#EDE9E1]"
}) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-base",
        lg: "w-20 h-20 text-2xl"
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-2 ${borderColor} shadow-[2px_2px_0_#141413] dark:shadow-[2px_2px_0_#000] ${color} flex items-center justify-center font-black shrink-0`}>
            {letter}
        </div>
    );
};
