import { notFound } from "next/navigation";

// Qualquer rota desconhecida dentro de um idioma cai no not-found localizado.
export default function CatchAllPage() {
  notFound();
}
