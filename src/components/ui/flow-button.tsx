import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * De flow-knop: bij hover schuift een pijl van links naar binnen, glijdt de
 * tekst mee en zwelt een cirkel op die de knop vult, terwijl de rechterpijl er
 * aan de andere kant uit loopt.
 *
 * Afwijking van het origineel: de hoeken blijven op onze `rounded-btn` van 2px
 * in plaats van te morphen van een pil naar 12px. Alles op deze site — kaarten,
 * tegels, chips, invoervelden — staat op 2 tot 3px, en één ronde pil ertussen
 * leest als een los onderdeel. De rest van de beweging is ongewijzigd.
 *
 * Zet `rounded-btn` op `rounded-[100px] group-hover:rounded-[12px]` in `basis`
 * hieronder om de originele pil terug te halen.
 */

type FlowVariant = "primary" | "outline" | "invert";

interface Laag {
  /** Rand, vulling en tekstkleur van de knop zelf. */
  knop: string;
  /** De cirkel die bij hover opzwelt. */
  cirkel: string;
  /** Beide pijlen; de kleur wisselt zodra de cirkel eronder ligt. */
  pijl: string;
}

const LAGEN: Record<FlowVariant, Laag> = {
  primary: {
    knop: "border-brand-accent bg-brand-accent text-brand-ink hover:border-brand-ink hover:text-white",
    cirkel: "bg-brand-ink",
    pijl: "stroke-brand-ink group-hover:stroke-white",
  },
  outline: {
    knop: "border-brand-ink/40 bg-transparent text-brand-ink hover:border-transparent hover:text-white",
    cirkel: "bg-brand-ink",
    pijl: "stroke-brand-ink group-hover:stroke-white",
  },
  /** Voor gebruik op een donkere band. */
  invert: {
    knop: "border-white/35 bg-transparent text-white hover:border-transparent hover:text-brand-ink",
    cirkel: "bg-white",
    pijl: "stroke-white group-hover:stroke-brand-ink",
  },
};

const basis =
  "group relative inline-flex cursor-pointer items-center gap-1 overflow-hidden rounded-btn border-[1.5px] px-8 py-3 font-display text-[13.5px] font-bold tracking-[-0.01em] transition-[color,background-color,border-color,transform] duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent motion-reduce:transition-none";

export interface FlowButtonProps {
  /** De tekst op de knop. `children` heeft voorrang als beide gegeven zijn. */
  text?: string;
  children?: React.ReactNode;
  variant?: FlowVariant;
  /** Interne route, anker of externe URL. Zonder `href` wordt het een knop. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export function FlowButton({
  text = "Modern Button",
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
}: FlowButtonProps) {
  const laag = LAGEN[variant];
  const cls = `${basis} ${laag.knop} ${className}`;

  const inhoud = (
    <>
      {/* Pijl die van buiten het kader naar binnen schuift. */}
      <ArrowRight
        aria-hidden
        className={`absolute left-[-25%] z-[9] size-4 fill-none ${laag.pijl} transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 motion-reduce:transition-none`}
      />

      <span className="relative z-[1] -translate-x-3 transition-transform duration-[800ms] ease-out group-hover:translate-x-3 motion-reduce:transition-none">
        {children ?? text}
      </span>

      {/* De cirkel die de knop vult. */}
      <span
        aria-hidden
        className={`absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 ${laag.cirkel} transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:size-[220px] group-hover:opacity-100 motion-reduce:transition-none`}
      />

      {/* Pijl die er aan de andere kant uit loopt. */}
      <ArrowRight
        aria-hidden
        className={`absolute right-4 z-[9] size-4 fill-none ${laag.pijl} transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] motion-reduce:transition-none`}
      />
    </>
  );

  const extern = !!href && /^(https?:|mailto:|tel:)/.test(href);
  const anker = !!href && href.startsWith("#");

  if (!href) {
    return (
      <button type={type} onClick={onClick} className={cls}>
        {inhoud}
      </button>
    );
  }
  if (extern || anker) {
    return (
      <a
        href={href}
        className={cls}
        {...(extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inhoud}
      </a>
    );
  }
  return (
    <Link to={href} className={cls}>
      {inhoud}
    </Link>
  );
}

export default FlowButton;
