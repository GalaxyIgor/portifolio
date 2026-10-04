import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Ignora API, arquivos internos do Next e qualquer caminho com extensão (ex.: /cv.pdf)
  matcher: "/((?!api|_next|_vercel|.*\..*).*)",
};
