/* =========================================================================
   GALERIA DE FOTOS E PRINTS
   Suba as imagens em assets/img/galeria/ e referencie aqui.

   Campos:
     src       -> caminho do arquivo. Ex: 'assets/img/galeria/confra.jpg'
     legenda   -> a legenda é onde mora a piada. Capriche.
     aparecem  -> lista de ids de quem está na foto (veja data/time.js)
     data      -> 'AAAA-MM-DD'
     tags      -> (opcional) ex: ['confra', 'print', 'slack']
     creditos  -> (opcional) id de quem tirou a foto ou fez o print

   Se a imagem não carregar, o site mostra um card avisando qual arquivo
   está faltando — nada quebra.

   ⚠️ O bloco abaixo é um MODELO e aponta para uma imagem que não existe,
   de propósito: é assim que o aviso de imagem ausente aparece. Apague
   quando subir as primeiras fotos de verdade.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.galeria = [
  {
    src: 'assets/img/galeria/exemplo.jpg',
    legenda: 'EXEMPLO — a legenda é onde mora a piada. Escreva a sua aqui.',
    aparecem: ['eria', 'mateus'],
    data: '2026-08-28',
    tags: ['exemplo'],
    creditos: 'jeniffer'
  }
];
