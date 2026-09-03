/* =========================================================================
   TROFÉUS PONTUAIS

   O Hall da Fama é, hoje, um ranking automático por número de pérolas
   registradas — ele não depende deste arquivo. Aqui ficam os troféus dados
   à mão, quando o time decidir criar algum. Enquanto a lista estiver
   vazia, a seção de troféus simplesmente não aparece no site.

   Campos:
     titulo     -> nome do prêmio
     emoji      -> o troféu em si
     descricao  -> por que esse prêmio existe
     ganhador   -> id da pessoa (veja data/time.js)
     edicao     -> ex: '2026' ou 'Q3/2026' ou 'Vitalício'
     motivo     -> o feito específico que garantiu a vitória
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.premios = [];
