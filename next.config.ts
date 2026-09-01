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
  images: {
    // Sem servidor, não existe otimização de imagem sob demanda — as
    // fotos são servidas como estão em /public (já .webp).
    unoptimized: true,
  },
};

export default nextConfig;
