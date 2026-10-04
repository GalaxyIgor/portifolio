"use client";

import { useSyncExternalStore } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const noop = () => () => {};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // O next-themes injeta um <script> inline que aplica o tema antes da pintura.
  // Ele só precisa rodar no HTML do servidor. Quando o layout é montado pelo
  // cliente (ex.: ao trocar de idioma, que troca o layout raiz [locale]), o
  // React avisa sobre <script> criado no cliente — a menos que seja um bloco
  // de dados. Na hidratação o valor do servidor é usado, então não há mismatch.
  const mountedOnClient = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={mountedOnClient ? { type: "application/json" } : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}
