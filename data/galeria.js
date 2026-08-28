/* =========================================================================
   GALERIA DE FOTOS E PRINTS
   Suba as imagens em assets/img/galeria/ e referencie aqui.

   Campos:
     src       -> caminho do arquivo. Ex: 'assets/img/galeria/confra.jpg'
     legenda   -> a legenda é onde mora a piada. Capriche.
     aparecem  -> lista de ids de quem está na foto (veja data/time.js)
     data      -> 'AAAA-MM-DD'
     tags      -> (opcional) ex: ['confra', 'print', 'slack']
     creditos  -> (opcional) quem tirou / quem printou

   Se a imagem não carregar, o site mostra um card divertido no lugar.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.galeria = [
  // ⬇️ EXEMPLOS — apague quando começar a subir as fotos de verdade ⬇️
  {
    src: 'assets/img/galeria/exemplo-1.jpg',
    legenda: 'O exato milissegundo em que a pessoa percebeu que subiu na branch errada.',
    aparecem: ['exemplo-3'],
    data: '2025-11-14',
    tags: ['print', 'clássico'],
    creditos: 'exemplo-1'
  },
  {
    src: 'assets/img/galeria/exemplo-2.jpg',
    legenda: 'Confraternização. Três pessoas piscaram. A quarta não estava olhando. A foto foi aprovada mesmo assim.',
    aparecem: ['exemplo-1', 'exemplo-2', 'exemplo-3'],
    data: '2025-12-19',
    tags: ['confra'],
    creditos: ''
  },
  {
    src: 'assets/img/galeria/exemplo-3.jpg',
    legenda: 'Print do Slack às 23h47 que começou com "rapidinho" e terminou em um épico de 62 mensagens.',
    aparecem: ['exemplo-1'],
    data: '2025-09-30',
    tags: ['slack', 'print'],
    creditos: 'exemplo-2'
  }
];
