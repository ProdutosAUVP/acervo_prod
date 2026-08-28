/* =========================================================================
   HALL DA FAMA — troféus e prêmios do time
   Prêmios honoríficos, entregues por mérito duvidoso.

   Campos:
     titulo     -> nome do prêmio
     emoji      -> o troféu em si
     descricao  -> por que esse prêmio existe
     ganhador   -> id da pessoa (veja data/time.js)
     edicao     -> ex: '2026' ou 'Q3/2026' ou 'Vitalício'
     motivo     -> o feito específico que garantiu a vitória

   ⚠️ O bloco abaixo é um MODELO, não um prêmio entregue. Criem as
   categorias de verdade (de preferência numa votação, para a piada ser
   coletiva) e apaguem este.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.premios = [
  {
    titulo: 'EXEMPLO — nome do troféu',
    emoji: '🏆',
    descricao: 'Para que serve este prêmio e quem costuma concorrer a ele.',
    ganhador: 'elane',
    edicao: '2026',
    motivo: 'O feito específico que garantiu a vitória nesta edição.'
  }
];
