/* =========================================================================
   GALERIA DE FOTOS, PRINTS E VÍDEOS
   Suba os arquivos em assets/img/galeria/ e referencie aqui.

   Campos:
     src       -> caminho do arquivo. Ex: 'assets/img/galeria/confra.jpg'
                  Aceita imagem (jpg, png, gif, webp) e vídeo (mp4, webm).
                  O vídeo aparece como miniatura no card e toca com som e
                  controles ao abrir no lightbox.
     legenda   -> a legenda é onde mora a piada. Capriche.
     aparecem  -> lista de ids de quem está na foto (veja data/time.js)
     data      -> 'AAAA-MM-DD'. Se não souber, deixe '' e o site escreve
                  "data desconhecida" — melhor que uma data inventada.
     tags      -> (opcional) ex: ['confra', 'print', 'video']
     creditos  -> (opcional) id de quem tirou a foto ou fez o print

   Se o arquivo não carregar, o site mostra um card avisando qual está
   faltando — nada quebra.

   Nomes de arquivo: sem espaço, sem parênteses e sem acento. Espaço e
   parêntese viram %20 e %28 na URL e dão dor de cabeça no GitHub Pages.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.galeria = [
  {
    src: 'assets/img/galeria/daniel-machadoverso.png',
    legenda: 'O machadoverso: Daniel Machado reencaminhando uma mensagem de Daniel Machado.',
    aparecem: ['daniel'],
    data: '2026-07-15',
    tags: ['print', 'machadoverso'],
    creditos: ''
  },
  {
    src: 'assets/img/galeria/daniel-limao-headset.jpg',
    legenda: 'De headset, camisa branca e um limão de pelúcia no colo, encarando a câmera sem nenhuma explicação.',
    aparecem: ['daniel'],
    data: '',
    tags: ['foto', 'limão'],
    creditos: ''
  },
  {
    src: 'assets/img/galeria/daniel-video.mp4',
    legenda: 'Vídeo do acervo — 8 segundos que alguém achou que precisavam ser guardados.',
    aparecem: ['daniel'],
    data: '',
    tags: ['video'],
    creditos: ''
  },
  {
    src: 'assets/img/galeria/daniel-gato-oculos.png',
    legenda: 'A figurinha oficial do "na verdade…": gato de óculos com o dedo em riste.',
    aparecem: ['daniel'],
    data: '',
    tags: ['figurinha'],
    creditos: ''
  }
];
