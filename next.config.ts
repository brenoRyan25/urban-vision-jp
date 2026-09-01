import type { NextConfig } from "next";

/**
 * GitHub Pages não roda servidor: prefixo só entra no build de CI
 * (a Actions define GITHUB_ACTIONS sozinha). Local, `npm run dev` e
 * `npm run build` continuam servindo em "/", sem precisar lembrar de
 * tirar o prefixo pra testar.
 */
const basePath = process.env.GITHUB_ACTIONS ? "/urban-vision-jp" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  // Deixa o basePath legível em runtime (server e client) para
  // lib/utils.ts#withBasePath — next/image com unoptimized:true não
  // prefixa o `src` sozinho, diferente de <Link> e dos chunks do Next.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    // Sem servidor, não existe otimização de imagem sob demanda — as
    // fotos são servidas como estão em /public (já .webp).
    unoptimized: true,
  },
};

export default nextConfig;
