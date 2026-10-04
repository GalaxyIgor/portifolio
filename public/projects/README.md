# Mídias dos projetos

Crie uma pasta com o slug do projeto e coloque nela screenshots, vídeos, posters e legendas `.vtt` reais. Os arquivos são servidos como `/projects/<slug>/<arquivo>`.

Cadastre os itens no campo opcional `gallery` do projeto em `src/data/projects.ts`. A ordem dos itens define a ordem das miniaturas e da navegação. Sem `gallery`, ou com uma lista vazia, a seção fica oculta.

Exemplo de estrutura (substitua caminhos e descrições pelos arquivos reais antes de cadastrar):

```ts
gallery: [
  {
    type: "image",
    src: "/projects/<slug>/interface.webp",
    alt: { pt: "Descrição da interface mostrada", en: "Description of the interface shown" },
    caption: { pt: "Tela principal", en: "Main screen" },
  },
  {
    type: "video",
    src: "/projects/<slug>/demonstracao.mp4",
    poster: "/projects/<slug>/poster.webp", // opcional
    caption: { pt: "Demonstração do projeto", en: "Project demonstration" },
    captions: { // opcionais para vídeos sem fala; necessárias quando houver fala
      pt: "/projects/<slug>/legendas.pt.vtt",
      en: "/projects/<slug>/legendas.en.vtt",
    },
  },
],
```

Use imagens WebP, PNG ou JPEG e vídeos MP4/WebM compatíveis com os navegadores dos visitantes. Escreva o texto alternativo para descrever o conteúdo da imagem, e a legenda para contextualizá-la. Vídeos não reproduzem automaticamente; legendas no idioma atual ficam selecionadas por padrão quando disponíveis.

Não cadastre mídias de exemplo ou arquivos inexistentes nos projetos publicados. Os testes usam fixtures próprias, separadas destas pastas.
