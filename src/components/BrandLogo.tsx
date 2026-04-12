import type { ImgHTMLAttributes } from 'react';
import { cn } from 'utils/styleUtils';

const base = `${process.env.PUBLIC_URL ?? ''}`.replace(/\/$/, '');

function asset(file: string) {
  const path = base ? `${base}/${file}` : `/${file}`;
  return path.replace(/([^:]\/)\/+/g, '$1');
}

type ImgProps = ImgHTMLAttributes<HTMLImageElement>;

/** Qisqa belgi — yon panel yig‘ilganda, favicon atrofida */
export function LogoMark({ className, ...props }: ImgProps) {
  return (
    <img
      src={asset('logo_only.svg')}
      alt="Qizlar Akademiyasi"
      width={54}
      height={62}
      className={cn('h-9 w-auto object-contain', className)}
      {...props}
    />
  );
}

/** Logo + yozuv — to‘liq brend satri */
export function LogoWithName({ className, ...props }: ImgProps) {
  return (
    <img
      src={asset('logo_with_name.svg')}
      alt="Qizlar Akademiyasi"
      width={202}
      height={62}
      className={cn('h-8 w-auto max-w-full object-contain object-left', className)}
      {...props}
    />
  );
}
