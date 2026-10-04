# Portfólio — Igor

Portfólio frontend com estética de pôster _dark fantasy_: o hero é uma pintura em parallax 2.5D, com o nome em letra medieval entre o céu e um cavaleiro num campo de rosas, e pétalas caindo.

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

## O hero em parallax

Fica em `src/components/three/`. Uma imagem e o seu mapa de profundidade alimentam um shader WebGL:

- `ParallaxScene.tsx`: desloca cada pixel conforme a profundidade (o que está perto mexe mais) seguindo o mouse e o scroll. O nome é desenhado numa profundidade fixa: o que está mais perto que ele (o cavaleiro, as flores) o encobre, e o que está mais longe (o céu, as ruínas) fica atrás.
- `Petals.tsx`: pétalas caindo, num único `InstancedMesh`.
- `HeroVisual.tsx`: começa com a imagem estática e o `<h1>` em HTML, o que é rápido e funciona sem JS. Só carrega o Three.js se o aparelho aguenta, troca para o canvas quando o primeiro frame fica pronto e pausa o render fora da tela. Sem WebGL, com movimento reduzido ou com economia de dados, fica na imagem estática.
- `heroImage.ts`: caminho da imagem, foco do recorte e profundidade do nome.

### Trocar a imagem do hero

> A imagem atual é provisória e não é de autoria própria. Antes de publicar, troque por uma imagem sua ou com licença de uso.

1. Salve a nova imagem em `public/hero/`.
2. Gere o mapa de profundidade. Na primeira vez, o script baixa o modelo Depth Anything V2 Small (~25 MB):

   ```bash
   node scripts/depth-map.mjs public/hero/sua-imagem.webp public/hero/sua-imagem-depth.webp
   ```

   O mapa sai com dois canais. O R tem borda firme, encaixada na pintura por um _guided filter_, e decide o que encobre o nome. O G é suavizado e serve só para o deslocamento, para não repuxar as bordas.
3. Atualize `heroImage.ts`: caminhos, `width`/`height`, `focus` e `textDepth`. O `textDepth` precisa ficar entre a profundidade do fundo e a do personagem.

## Deploy

Conecte o repositório na Vercel e ajuste `profile.siteUrl` com o domínio final, que é usado no sitemap, nos metadados e no Open Graph.
