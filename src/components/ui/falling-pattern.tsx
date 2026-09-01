'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

type FallingPatternProps = React.ComponentProps<'div'> & {
	/** Primary color of the falling elements (default: 'var(--primary)') */
	color?: string;
	/** Background color (default: 'var(--background)') */
	backgroundColor?: string;
	/** Seconden die een rij over zijn volle val doet (default: 150) */
	duration?: number;
	/** Blur intensity for the overlay effect (default: '1em') */
	blurIntensity?: string;
	/** Pattern density - affects spacing (default: 1) */
	density?: number;
};

/**
 * Twaalf rijen druppels, elk met een eigen valsnelheid.
 *
 * Het origineel legde alle zesendertig druppels als radial-gradients op één
 * element en liet framer-motion daar `background-position` van animeren. Dat
 * is per frame een hertekening van het hele scherm met zesendertig verlopen:
 * op een stilstaande pagina mat dat driehonderd milliseconde per frame, en
 * omdat deze laag `fixed` staat hield hij dat vol zolang de pagina open was.
 *
 * Nu heeft elke rij een eigen laag met een herhalende tegel, en zakt die laag
 * met een transform. Dezelfde beweging, maar de compositor schuift alleen wat
 * er al getekend is — er wordt niets opnieuw geverfd.
 *
 * Per rij: `h` is de tegelhoogte (de streep zit op de naad zodat hij over de
 * herhaling doorloopt, de stip op de helft), `val` is hoe ver de rij zakte in
 * de oorspronkelijke duur en `fase` waar hij begon. Uit `h` en `val` volgt hoe
 * lang één tegel duurt, en dus de snelheid van die rij.
 */
const RIJEN = [
	{ h: 235, val: 6580, fase: 220 },
	{ h: 252, val: 13608, fase: 24 },
	{ h: 150, val: 5400, fase: 16 },
	{ h: 253, val: 16951, fase: 224 },
	{ h: 204, val: 5100, fase: 19 },
	{ h: 134, val: 8308, fase: 120 },
	{ h: 179, val: 9845, fase: 31 },
	{ h: 299, val: 13156, fase: 235 },
	{ h: 215, val: 14620, fase: 121 },
	{ h: 281, val: 18546, fase: 224 },
	{ h: 158, val: 5056, fase: 26 },
	{ h: 210, val: 6300, fase: 75 },
];

/**
 * Eén tegel omlaag en weer opnieuw. Omdat de tegel zich herhaalt is dat naadloos,
 * en omdat de afstand per rij verschilt komt hij uit een custom property.
 */
const KEYFRAMES = `
@keyframes vp-val {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(0, var(--vp-h), 0); }
}
@media (prefers-reduced-motion: reduce) {
  .vp-rij { animation: none !important; }
}
`;

export function FallingPattern({
	color = 'var(--primary)',
	backgroundColor = 'var(--background)',
	duration = 150,
	blurIntensity = '1em',
	density = 1,
	className,
}: FallingPatternProps) {
	return (
		<div className={cn('relative h-full w-full overflow-hidden p-1', className)}>
			<style>{KEYFRAMES}</style>
			<div className="absolute inset-0" style={{ backgroundColor }} />
			{RIJEN.map((rij, i) => {
				// De drie druppels van een rij staan naast elkaar; elke rij schuift
				// vijfentwintig pixel op, net als in het origineel.
				const x = 25 * i;
				return (
					<div
						key={rij.h + '-' + i}
						className="vp-rij absolute left-0 right-0"
						style={{
							// Een tegel extra boven beeld, zodat er tijdens het zakken
							// altijd iets klaarstaat om binnen te vallen.
							top: -rij.h,
							height: `calc(100% + ${rij.h}px)`,
							backgroundImage: [
								`radial-gradient(4px 100px at 0px ${rij.h}px, ${color}, transparent)`,
								`radial-gradient(4px 100px at 300px ${rij.h}px, ${color}, transparent)`,
								`radial-gradient(1.5px 1.5px at 150px ${rij.h / 2}px, ${color} 100%, transparent 150%)`,
							].join(', '),
							backgroundSize: `300px ${rij.h}px`,
							backgroundPosition: [
								`${x}px ${rij.fase}px`,
								`${x + 3}px ${rij.fase}px`,
								`${x + 151.5}px ${rij.fase + rij.h / 2}px`,
							].join(', '),
							['--vp-h' as string]: `${rij.h}px`,
							animation: `vp-val ${((duration * rij.h) / rij.val).toFixed(3)}s linear infinite`,
						}}
					/>
				);
			})}
			<div
				className="absolute inset-0 z-1 dark:brightness-600"
				style={{
					backdropFilter: `blur(${blurIntensity})`,
					backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, ${backgroundColor} 2px)`,
					backgroundSize: `${8 * density}px ${8 * density}px`,
				}}
			/>
		</div>
	);
}
