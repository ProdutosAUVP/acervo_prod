/* =========================================================================
   MOMENTOS HISTÓRICOS (linha do tempo)
   Aqui entram os causos: aquilo que aconteceu e o time nunca mais esqueceu.

   Campos:
     titulo      -> nome do evento histórico. Capriche, é a manchete.
     data        -> 'AAAA-MM-DD'
     relato      -> a história em 2 a 5 linhas
     envolvidos  -> lista de ids das pessoas (veja data/time.js)
     tipo        -> 'lenda' | 'tragedia' | 'vitoria' | 'misterio' | 'caos'
     gravidade   -> 1 a 5 (aparece como selo na linha do tempo)
     foto        -> (opcional) caminho de uma imagem. Ex: 'assets/img/momentos/x.jpg'
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.momentos = [
  // ⬇️ EXEMPLOS — apague quando começar a preencher de verdade ⬇️
  {
    titulo: 'O Deploy de Sexta-feira',
    data: '2025-11-14',
    relato: 'Alguém disse "é uma mudança pequena". Dezoito minutos depois, ' +
            'o time inteiro estava no call. O bug era uma vírgula. A vírgula venceu.',
    envolvidos: ['exemplo-3', 'exemplo-1'],
    tipo: 'tragedia',
    gravidade: 5,
    foto: ''
  },
  {
    titulo: 'A Reunião Que Podia Ser Um E-mail',
    data: '2025-10-02',
    relato: 'Uma hora e meia de call para decidir a cor de um botão. ' +
            'No final ficou a cor original. Existe gravação. Ninguém assistiu.',
    envolvidos: ['exemplo-1', 'exemplo-2'],
    tipo: 'caos',
    gravidade: 4,
    foto: ''
  },
  {
    titulo: 'O Café Que Ninguém Assumiu',
    data: '2025-08-07',
    relato: 'A garrafa estava vazia. Estava quente. Alguém acabou de sair. ' +
            'Até hoje o caso segue aberto.',
    envolvidos: [],
    tipo: 'misterio',
    gravidade: 2,
    foto: ''
  }
];
