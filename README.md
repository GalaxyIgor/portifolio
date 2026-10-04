# Portfólio — Igor

Portfólio frontend com estética de pôster _dark fantasy_: o nome em letra medieval, um elmo de cavaleiro cromado em 3D na frente das letras, rosas e pétalas caindo.

**Stack:** Next.js 16 (App Router, SSG) · React 19 · TypeScript · Tailwind CSS v4 · React Three Fiber · Motion · next-intl (PT/EN) · MDX · Vitest · Playwright

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (todas as páginas estáticas)
npm run typecheck
npm run lint
npm test           # Vitest
npm run test:e2e   # Playwright (sobe o dev server sozinho)
```

## Onde editar o conteúdo

Todo o conteúdo de exemplo está marcado com `TODO(Igor)`.

| O quê                                         | Arquivo                                   |
| --------------------------------------------- | ----------------------------------------- |
| Nome, e-mail, domínio, redes, foto, currículo | `src/data/profile.ts`                     |
| Skills                                        | `src/data/skills.ts`                      |
| Experiência                                   | `src/data/experience.ts`                  |
| Projetos (metadados)                          | `src/data/projects.ts`                    |
| Estudos de caso                               | `src/content/projects/{pt,en}/<slug>.mdx` |
| Textos da interface                           | `src/messages/{pt,en}.json`               |

- **Foto:** coloque em `public/images/` e aponte `profile.photo`.
- **Currículo:** coloque os PDFs em `public/` e preencha `profile.cv`. Sem arquivo, o botão fica escondido.
- **Capa de projeto:** opcional (`cover` em `projects.ts`). Sem capa, o card mostra um ícone de linha.

## A cena 3D

Fica em `src/components/three/` e é toda procedural, sem baixar nenhum modelo:

- `KnightHelm.tsx`: elmo feito com `LatheGeometry`.
- `roseGeometry.ts` + `Roses.tsx`: rosas com pétalas em espiral pelo ângulo áureo, uma geometria por rosa.
- `Thorns.tsx`: ramo de espinhos em espiral.
- `Petals.tsx`: pétalas caindo, num único `InstancedMesh`.
- `HeroVisual.tsx`: só carrega o Three.js se o aparelho aguenta, pausa o render fora da tela e mostra `KnightFallback.tsx` (SVG estático) quando não há WebGL, quando o usuário prefere menos movimento ou com economia de dados.

Para usar um modelo `.glb` de cavaleiro no lugar do elmo, troque `<KnightHelm />` em `KnightScene.tsx` por um componente com `useGLTF`.

## Deploy

Conecte o repositório na Vercel e ajuste `profile.siteUrl` com o domínio final, que é usado no sitemap, nos metadados e no Open Graph.
