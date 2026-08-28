/* =========================================================================
   INTEGRANTES DO TIME
   Base: a lista oficial do time de produtos (produtosauvp.github.io/central/time).

   Cada pessoa tem um "id" curto (sem espaço, sem acento). Esse id é usado
   nos outros arquivos (frases, momentos, galeria, prêmios) para dizer de
   quem é a frase / quem aparece na foto.

   Campos:
     id        -> apelido técnico, sem espaço e sem acento. Ex: 'daniel'
     nome      -> nome que aparece na tela
     cargo     -> cargo real ou inventado, quanto mais engraçado melhor
     bio       -> uma linha cômica sobre a pessoa (as atuais vieram da
                  central e são sérias de propósito: troquem à vontade)
     entrouEm  -> (opcional) mês/ano de entrada no time
     emoji     -> avatar de reserva, usado se a foto não carregar
     foto      -> caminho da foto em assets/img/pessoas/
     bordoes   -> lista de frases que a pessoa fala o tempo todo

   A cor de cada pessoa sai automaticamente da paleta do Design System,
   pela posição nesta lista. Para fixar uma cor, use `acento: 1..8`.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.time = [
  {
    id: 'beatriz',
    nome: 'Beatriz Henriques',
    cargo: 'Diretora de Produto',
    bio: 'Lidera a estratégia de produto e a visão de longo prazo da plataforma.',
    emoji: '🧭',
    foto: 'assets/img/pessoas/beatriz.jpg',
    bordoes: []
  },
  {
    id: 'daniel',
    nome: 'Daniel Machado',
    cargo: 'Coordenador de Produto',
    bio: 'Coordena sprints e a entrega contínua de valor ao usuário final.',
    emoji: '📋',
    foto: 'assets/img/pessoas/daniel.jpg',
    bordoes: []
  },
  {
    id: 'ariadne',
    nome: 'Ariadne Carneiro',
    cargo: 'Gerente de Produto',
    bio: 'Conduz discovery, roadmap e priorização das iniciativas do produto.',
    emoji: '🗺️',
    foto: 'assets/img/pessoas/ariadne.png',
    bordoes: []
  },
  {
    id: 'armando',
    nome: 'Armando Neto',
    cargo: 'Designer de Produto',
    bio: 'Cria interfaces funcionais e refinadas para a plataforma.',
    emoji: '🎨',
    foto: 'assets/img/pessoas/armando.png',
    bordoes: []
  },
  {
    id: 'eria',
    nome: 'Éria Alencar',
    cargo: 'Designer de Produto',
    bio: 'Cuida de identidade visual, marca e componentes do design system.',
    emoji: '🖌️',
    foto: 'assets/img/pessoas/eria.png',
    bordoes: []
  },
  {
    id: 'mateus',
    nome: 'Mateus Graff',
    cargo: 'Redator',
    bio: 'Define o tom e a voz da AUVP em todos os canais e produtos.',
    emoji: '✍️',
    foto: 'assets/img/pessoas/mateus.jpg',
    bordoes: []
  },
  {
    id: 'jeniffer',
    nome: 'Jeniffer Nascimento',
    cargo: 'Analista de Produto',
    bio: 'Analisa dados e métricas para embasar decisões de produto.',
    emoji: '📊',
    foto: 'assets/img/pessoas/jeniffer.jpeg',
    bordoes: []
  },
  {
    id: 'elane',
    nome: 'Elane Rodrigues',
    cargo: 'Analista de Produto',
    bio: 'Conduz pesquisas com usuários e validação de hipóteses.',
    emoji: '🔎',
    foto: 'assets/img/pessoas/elane.jpg',
    bordoes: []
  },
  {
    id: 'ana',
    nome: 'Ana Beatriz Melo',
    cargo: 'Assistente de Produto',
    bio: 'Apoia as iniciativas de produto e os processos internos do time.',
    emoji: '🧩',
    foto: 'assets/img/pessoas/ana.jpg',
    bordoes: []
  }
];
