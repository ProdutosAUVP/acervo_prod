/* =========================================================================
   INTEGRANTES DO TIME
   Cada pessoa tem um "id" curto (sem espaço, sem acento). Esse id é usado
   nos outros arquivos (frases, momentos, galeria, prêmios) para dizer de
   quem é a frase / quem aparece na foto.

   Campos:
     id        -> apelido técnico, sem espaço e sem acento. Ex: 'joao'
     nome      -> nome que aparece na tela
     cargo     -> cargo real ou inventado, quanto mais engraçado melhor
     bio       -> uma linha cômica sobre a pessoa
     entrouEm  -> mês/ano que entrou no time (aparece no perfil)
     cor       -> cor do card (use: amarelo, rosa, ciano, roxo, verde, laranja)
     emoji     -> vira o avatar quando não tem foto
     foto      -> (opcional) caminho da foto. Ex: 'assets/img/pessoas/joao.jpg'
     bordoes   -> lista de frases que a pessoa fala o tempo todo
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.time = [
  // ⬇️ APAGUE OS EXEMPLOS ABAIXO E COLOQUE O TIME DE VERDADE ⬇️
  {
    id: 'exemplo-1',
    nome: 'Fulano da Silva',
    cargo: 'Product Manager / Gerador de Reuniões',
    bio: 'Marca reunião pra decidir o horário da próxima reunião.',
    entrouEm: 'jan/2024',
    cor: 'amarelo',
    emoji: '🗓️',
    foto: '',
    bordoes: ['isso é rápido, é só um ajuste', 'depois a gente alinha']
  },
  {
    id: 'exemplo-2',
    nome: 'Ciclana Souza',
    cargo: 'Designer / Guardiã do Pixel',
    bio: 'Já chorou por causa de 2px de espaçamento. Duas vezes.',
    entrouEm: 'mar/2024',
    cor: 'rosa',
    emoji: '🎨',
    foto: '',
    bordoes: ['isso tá desalinhado', 'no Figma tava lindo']
  },
  {
    id: 'exemplo-3',
    nome: 'Beltrano Costa',
    cargo: 'Dev / Tradutor de Ideias Impossíveis',
    bio: 'Responde "depende" para 100% das perguntas. Sempre está certo.',
    entrouEm: 'jun/2023',
    cor: 'ciano',
    emoji: '🛠️',
    foto: '',
    bordoes: ['na minha máquina funciona', 'isso é meio point']
  }
];
