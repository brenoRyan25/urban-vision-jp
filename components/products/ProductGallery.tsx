"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, withBasePath } from "@/lib/utils";

/**
 * Client só por causa da troca de foto. Com uma imagem só, nem renderiza
 * as miniaturas — e o componente pesa nada.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/5 overflow-hidden rounded-surface bg-graphite">
        {current && (
          <Image
            src={withBasePath(current)}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <ul className="flex gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver foto ${i + 1} de ${images.length}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "relative size-20 overflow-hidden rounded-surface border-2 transition-colors",
                  i === active
                    ? "border-titanium"
                    : "border-steel hover:border-titanium/50",
                )}
              >
                <Image src={withBasePath(src)} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
