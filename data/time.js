/* =========================================================================
   INTEGRANTES DO TIME
   Base: a lista oficial do time de produtos (produtosauvp.github.io/central/time).

   Cada pessoa tem um "id" curto (sem espaço, sem acento). Esse id é usado
   nos outros arquivos (frases, momentos, galeria, prêmios) para dizer de
   quem é a frase / quem aparece na foto.

   Campos:
     id        -> apelido técnico, sem espaço e sem acento. Ex: 'daniel'
     nome      -> nome que aparece na tela
     cargo     -> o cargo de verdade, para quem chegou agora se situar
     titulo    -> o cargo honorífico, que é o que o time realmente usa
     bio       -> a descrição cômica da pessoa
     entrouEm  -> (opcional) mês/ano de entrada no time
     emoji     -> avatar de reserva, usado se a foto não carregar
     foto      -> caminho da foto em assets/img/pessoas/
     bordoes   -> frases que a pessoa fala o tempo todo (só as reais!)

   A cor de cada pessoa sai automaticamente da paleta do Design System,
   pela posição nesta lista. Para fixar uma cor, use `acento: 1..8`.

   Regra da casa: rimos COM, não DE. Se alguém não achar graça da própria
   descrição, troque na hora — inclusive pelo modo edição (✏️ no topo).
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.time = [
  {
    id: 'beatriz',
    nome: 'Beatriz Henriques',
    cargo: 'Diretora de Produto',
    titulo: 'Chefa Suprema do Roadmap',
    bio: 'Decide o que o time vai fazer nos próximos seis meses e, principalmente, ' +
         'o que não vai. Um "não" dela economiza três reuniões.',
    emoji: '🧭',
    foto: 'assets/img/pessoas/beatriz.jpg',
    bordoes: []
  },
  {
    id: 'daniel',
    nome: 'Daniel Machado',
    cargo: 'Coordenador de Produto',
    titulo: 'Sua Figura Paterna',
    bio: 'Coordena sprints, entregas e a saúde mental alheia. Declarou-se figura ' +
         'paterna do time e, no mesmo ano, não-alfabetizado. As duas constam no acervo.',
    emoji: '🧔',
    foto: 'assets/img/pessoas/daniel.jpg',
    bordoes: []
  },
  {
    id: 'ariadne',
    nome: 'Ariadne Carneiro',
    cargo: 'Gerente de Produto',
    titulo: 'Guardiã do Discovery',
    bio: 'Faz a pergunta que ninguém queria ouvir três minutos antes de a reunião ' +
         'acabar. Sempre a pergunta certa. Sempre no pior momento possível.',
    emoji: '🗺️',
    foto: 'assets/img/pessoas/ariadne.png',
    bordoes: []
  },
  {
    id: 'armando',
    nome: 'Armando Neto',
    cargo: 'Designer de Produto',
    titulo: 'O Sósia do Fiuk',
    bio: 'Faz interface bonita e que funciona, o que já seria bastante. Ainda por ' +
         'cima carrega a semelhança que rendeu meia dúzia de prints neste acervo.',
    emoji: '🦁',
    foto: 'assets/img/pessoas/armando.png',
    bordoes: []
  },
  {
    id: 'eria',
    nome: 'Éria Alencar',
    cargo: 'Designer de Produto',
    titulo: 'Xerife do Design System',
    bio: 'Se o espaçamento está errado, ela já viu. Você ainda vai receber a ' +
         'mensagem, mas saiba desde já: ela já viu.',
    emoji: '📐',
    foto: 'assets/img/pessoas/eria.png',
    bordoes: []
  },
  {
    id: 'mateus',
    nome: 'Mateus Graff',
    cargo: 'Redator',
    titulo: 'Dono das Palavras',
    bio: 'Escreve, reescreve, e reescreve de novo. O texto que você leu no produto ' +
         'está na sétima versão. Esta bio, na oitava.',
    emoji: '✍️',
    foto: 'assets/img/pessoas/mateus.jpg',
    bordoes: []
  },
  {
    id: 'jeniffer',
    nome: 'Jeniffer Nascimento',
    cargo: 'Analista de Produto',
    titulo: 'Tribunal dos Dados',
    bio: 'Chega com um gráfico e encerra a discussão. Já derrubou opinião de gente ' +
         'muito mais graduada usando só uma planilha bem feita.',
    emoji: '📊',
    foto: 'assets/img/pessoas/jeniffer.jpeg',
    bordoes: []
  },
  {
    id: 'elane',
    nome: 'Elane Rodrigues',
    cargo: 'Analista de Produto',
    titulo: 'Ouvidora dos Usuários',
    bio: 'Conversa com usuário de verdade e volta com a verdade de verdade. ' +
         'Quase nunca é a verdade que o time queria ouvir.',
    emoji: '🔎',
    foto: 'assets/img/pessoas/elane.jpg',
    bordoes: []
  },
  {
    id: 'ana',
    nome: 'Ana Beatriz Melo',
    cargo: 'Assistente de Produto',
    titulo: 'Quem Segura o Time',
    bio: 'Cuida das vinte coisas pequenas sem as quais nada acontece. Ninguém sabe ' +
         'direito como ela dá conta, e todo mundo pergunta pra ela mesmo assim.',
    emoji: '🧩',
    foto: 'assets/img/pessoas/ana.jpg',
    bordoes: []
  }
];
