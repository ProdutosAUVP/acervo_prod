/* =========================================================================
   HALL DA FAMA — troféus e prêmios do time
   Prêmios honoríficos, entregues por mérito duvidoso.

   Campos:
     titulo     -> nome do prêmio
     emoji      -> o troféu em si
     descricao  -> por que esse prêmio existe
     ganhador   -> id da pessoa (veja data/time.js)
     edicao     -> ex: '2025' ou 'Q4/2025' ou 'Vitalício'
     motivo     -> o feito específico que garantiu a vitória
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.premios = [
  // ⬇️ EXEMPLOS — apague e crie os prêmios do time ⬇️
  {
    titulo: 'Troféu Na Minha Máquina Funciona',
    emoji: '🖥️',
    descricao: 'Para quem defende o indefensável com convicção absoluta.',
    ganhador: 'exemplo-3',
    edicao: '2025',
    motivo: 'Sustentou a tese por 4 dias. No quinto, era a máquina dele mesmo.'
  },
  {
    titulo: 'Medalha de Ouro em Alinhamento',
    emoji: '📐',
    descricao: 'Concedida a quem enxerga 1px de diferença a 3 metros de distância.',
    ganhador: 'exemplo-2',
    edicao: 'Vitalício',
    motivo: 'Detectou um desalinhamento por uma foto tremida do monitor alheio.'
  },
  {
    titulo: 'Prêmio Isso É Rapidinho',
    emoji: '⏱️',
    descricao: 'Para a maior discrepância entre estimativa e realidade.',
    ganhador: 'exemplo-1',
    edicao: 'Q4/2025',
    motivo: 'Estimou 2 horas. Foram 3 sprints e uma mudança de arquitetura.'
  }
];
