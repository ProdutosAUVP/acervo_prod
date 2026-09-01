/* =========================================================================
   CONFIGURAÇÕES GERAIS DO ACERVO
   Mexa aqui para mudar nome do site, subtítulos e textos gerais.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.config = {
  // Nome que aparece no topo e na aba do navegador
  nome: 'Acervo do Time',
  nomeCurto: 'Acervo',
  time: 'Time de Produtos AUVP',

  // Subtítulos que ficam trocando no topo da home. Adicione quantos quiser.
  subtitulos: [
    'o museu oficial das nossas piores decisões',
    'documentando o caos desde sempre',
    'aqui nada se perde, tudo vira print',
    'patrimônio histórico do time de produtos',
    'a memória que a gente finge não ter',
    'cada frase aqui foi dita por alguém. sério.',
    'não é fofoca, é preservação cultural'
  ],

  // Texto do rodapé
  rodape: 'Feito com carinho, café e um pouco de vergonha alheia.',

  // Frase que aparece quando uma seção está vazia
  vazio: 'Nada por aqui ainda. Suspeito. Alguém está escondendo alguma coisa.',

  /* Imagem grande no topo da home. Para trocar, aponte para outro arquivo
     em assets/img/galeria/ — ou mexa em Ajustes, no modo edição. */
  destaque: {
    src: 'assets/img/galeria/destaque-time.jpg',
    legenda: 'O time inteiro num único frame, e nenhuma das nove pessoas parecendo feliz com isso.'
  },

  /* -----------------------------------------------------------------------
     SENHA DO MODO EDIÇÃO (ícone ✏️ no topo)

     ⚠️ Leia antes de confiar nisto: o site é estático, roda inteiro no
     navegador e o repositório é público. Esta senha é uma TRANCA CONTRA
     DISTRAÇÃO, não segurança — quem abrir o código-fonte acha este arquivo.
     Não use aqui uma senha que você usa em outro lugar, e não trate o
     acervo como se fosse privado: qualquer pessoa com o link vê tudo.

     Guardamos o SHA-256 em vez do texto puro só para a senha não ficar
     escancarada na tela de quem passar os olhos pelo repositório.

     Senha atual: corDaniel*
     Para trocar: entre no modo edição e use "trocar senha" — ele calcula o
     novo hash para você colar aqui.
     ----------------------------------------------------------------------- */
  senhaHash: '7a3cb5e7388fa081383e038926e43461345cb8fbfa2f67c022a52c27aa973e98'
};
