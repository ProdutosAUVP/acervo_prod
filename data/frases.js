/* =========================================================================
   FRASES ICÔNICAS
   O coração do acervo. Toda pérola dita no time entra aqui.

   Campos:
     texto     -> a frase, do jeitinho que foi dita (sem editar pra ficar bonita)
     autor     -> o "id" da pessoa (veja data/time.js)
     contexto  -> (opcional) o que estava acontecendo. É o que faz graça.
     data      -> formato 'AAAA-MM-DD' (usado pra ordenar)
     tags      -> (opcional) palavras-chave pra busca. Ex: ['daily', 'sprint']
     nota      -> (opcional) 1 a 5 tacos de pimenta 🌶️ de o quão absurda é

   Dica: copie um bloco inteiro, cole no topo da lista e edite.
   Não esqueça da vírgula entre os blocos.

   ⚠️ Os dois blocos abaixo são MODELOS, não frases reais — ninguém disse
   isso. Estão aqui só para o time ver o formato preenchido. Apague os dois
   assim que registrar as primeiras pérolas de verdade.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.frases = [
  {
    texto: 'EXEMPLO — troque por uma frase que alguém realmente disse.',
    autor: 'daniel',
    contexto: 'O contexto é metade da piada: conte o que estava acontecendo na hora.',
    data: '2026-08-28',
    tags: ['exemplo'],
    nota: 3
  },
  {
    texto: 'EXEMPLO — o campo "nota" são as pimentas de absurdo, de 1 a 5.',
    autor: 'ariadne',
    contexto: 'Este bloco existe só para mostrar o formato. Pode apagar.',
    data: '2026-08-27',
    tags: ['exemplo'],
    nota: 5
  }
];
