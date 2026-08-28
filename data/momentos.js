/* =========================================================================
   MOMENTOS HISTÓRICOS (linha do tempo)
   Aqui entram os causos: aquilo que aconteceu e o time nunca mais esqueceu.

   Campos:
     titulo      -> nome do evento histórico. Capriche, é a manchete.
     data        -> 'AAAA-MM-DD'
     relato      -> a história em 2 a 5 linhas
     envolvidos  -> lista de ids das pessoas (veja data/time.js)
     tipo        -> 'lenda' | 'tragedia' | 'vitoria' | 'misterio' | 'caos'
     gravidade   -> 1 a 5 (aparece como pimentas na linha do tempo)
     foto        -> (opcional) imagem. Ex: 'assets/img/momentos/x.jpg'

   ⚠️ O bloco abaixo é um MODELO, não um causo real. Apague quando o time
   registrar o primeiro acontecimento de verdade.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.momentos = [
  {
    titulo: 'EXEMPLO — a manchete do causo vem aqui',
    data: '2026-08-28',
    relato: 'O relato em duas ou três linhas: o que aconteceu, quem estava ' +
            'na sala e por que até hoje alguém lembra disso. Troque o campo ' +
            '"tipo" para mudar a cor do marcador na linha do tempo.',
    envolvidos: ['beatriz', 'armando'],
    tipo: 'lenda',
    gravidade: 3,
    foto: ''
  }
];
