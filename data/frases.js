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
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.frases = [
  // ⬇️ EXEMPLOS — apague quando começar a preencher de verdade ⬇️
  {
    texto: 'Se ninguém reclamar em produção, é porque funcionou.',
    autor: 'exemplo-3',
    contexto: 'Estratégia oficial de QA apresentada numa sexta-feira, 17h50.',
    data: '2025-11-14',
    tags: ['deploy', 'sexta-feira'],
    nota: 5
  },
  {
    texto: 'Isso aqui é MVP, depois a gente arruma.',
    autor: 'exemplo-1',
    contexto: 'Dito pela 47ª vez sobre a mesma tela, que está no ar há 2 anos.',
    data: '2025-10-02',
    tags: ['mvp', 'clássico'],
    nota: 4
  },
  {
    texto: 'Eu não vou brigar por causa disso... mas tá errado.',
    autor: 'exemplo-2',
    contexto: 'Sobre um botão 3px fora do grid. A briga durou 40 minutos.',
    data: '2025-09-19',
    tags: ['design', 'pixel'],
    nota: 5
  }
];
