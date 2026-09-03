/* =========================================================================
   TELAS DO SITE
   Cada função devolve o HTML de uma página. O roteador (app.js) escolhe qual
   chamar de acordo com o endereço (#/frases, #/galeria, ...).
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.views = (function () {
  'use strict';

  var u = window.ACERVO.utils;

  function dados() {
    return {
      config: window.ACERVO.config || {},
      time: window.ACERVO.time || [],
      frases: window.ACERVO.frases || [],
      galeria: window.ACERVO.galeria || [],
      premios: window.ACERVO.premios || []
    };
  }

  /* ---------------- Blocos reutilizáveis ---------------- */

  function cardFrase(f) {
    var p = u.pessoa(f.autor);
    return '' +
      '<article class="frase ' + u.acento(p) + '">' +
        '<p class="frase__texto">' + u.esc(f.texto) + '</p>' +
        (f.contexto ? '<p class="frase__contexto">' + u.esc(f.contexto) + '</p>' : '') +
        '<div class="frase__rodape">' +
          u.avatar(p) +
          '<a href="#/acervo/' + u.esc(p.id) + '">' +
            '<span class="frase__autor">' + u.esc(p.nome) + '</span><br>' +
            '<span class="frase__data">' + u.esc(u.dataLegivel(f.data)) + '</span>' +
          '</a>' +
          (f.nota ? '<span class="frase__pimenta" title="Nível de absurdo: ' + u.esc(f.nota) + '/5">' +
                    u.pimenta(f.nota) + '</span>' : '') +
        '</div>' +
      '</article>';
  }

  // A galeria guarda foto, print e vídeo. O vídeo entra mudo e sem controles
  // no card (é só a miniatura); o som e os controles ficam para o lightbox.
  function midiaDaGaleria(item) {
    if (!item.src) return '<div class="foto__ausente"><span>📷</span>sem imagem</div>';

    if (u.ehVideo(item.src)) {
      return '<video src="' + u.esc(item.src) + '" preload="metadata" muted playsinline ' +
             'aria-label="' + u.esc(item.legenda || 'Vídeo do acervo') + '" data-fallback="🎬"></video>' +
             '<span class="foto__play" aria-hidden="true">▶</span>';
    }

    return '<img src="' + u.esc(item.src) + '" alt="' + u.esc(item.legenda || 'Foto do acervo') + '" ' +
           'loading="lazy" data-fallback="📷">';
  }

  function cardFoto(item, indice) {
    var midia = midiaDaGaleria(item);

    var quem = (item.aparecem || []).map(function (id) {
      return u.esc(u.pessoa(id).nome);
    }).join(', ');

    return '' +
      '<button class="foto" data-foto="' + indice + '" type="button">' +
        '<div class="foto__midia">' + midia + '</div>' +
        '<div class="foto__legenda">' + u.esc(item.legenda || '') + '</div>' +
        '<div class="foto__meta">' +
          '<span>' + u.esc(u.dataLegivel(item.data)) + '</span>' +
          (quem ? '<span>· ' + quem + '</span>' : '') +
        '</div>' +
      '</button>';
  }

  function cardPremio(pr) {
    var p = u.pessoa(pr.ganhador);
    return '' +
      '<article class="premio ' + u.acento(p) + '">' +
        '<div class="premio__emoji">' + u.esc(pr.emoji || '🏆') + '</div>' +
        '<h3 class="premio__titulo">' + u.esc(pr.titulo) + '</h3>' +
        '<p class="premio__descricao">' + u.esc(pr.descricao || '') + '</p>' +
        '<div class="premio__ganhador">' + u.avatar(p) +
          '<a href="#/acervo/' + u.esc(p.id) + '"><strong>' + u.esc(p.nome) + '</strong></a>' +
          '<span class="selo">' + u.esc(pr.edicao || '') + '</span>' +
        '</div>' +
        (pr.motivo ? '<p class="premio__motivo">' + u.esc(pr.motivo) + '</p>' : '') +
      '</article>';
  }

  function cardPessoa(p) {
    var d = dados();
    var frases = d.frases.filter(function (f) { return f.autor === p.id; }).length;
    var trofeus = d.premios.filter(function (x) { return x.ganhador === p.id; }).length;
    var fotos = d.galeria.filter(function (g) {
      return (g.aparecem || []).indexOf(p.id) !== -1;
    }).length;

    return '' +
      '<a class="pessoa ' + u.acento(p) + '" href="#/acervo/' + u.esc(p.id) + '">' +
        '<div class="pessoa__topo">' + u.avatar(p) +
          '<div><div class="pessoa__nome">' + u.esc(p.nome) + '</div>' +
          '<div class="pessoa__cargo">' + u.esc(p.cargo || '') + '</div></div>' +
        '</div>' +
        (p.titulo ? '<span class="selo selo--acento pessoa__titulo">' + u.esc(p.titulo) + '</span>' : '') +
        '<p class="pessoa__bio">' + u.esc(p.bio || '') + '</p>' +
        '<div class="pessoa__numeros">' +
          '<div class="pessoa__numero"><b>' + frases + '</b><span>frases</span></div>' +
          '<div class="pessoa__numero"><b>' + trofeus + '</b><span>troféus</span></div>' +
          '<div class="pessoa__numero"><b>' + fotos + '</b><span>fotos</span></div>' +
        '</div>' +
      '</a>';
  }

  /* ---------------- Páginas ---------------- */

  /* --- Home ---------------------------------------------------------- */

  // Cabeçalho numerado, no espírito de índice/catálogo: o número ancora a
  // seção e dá ritmo à página conforme se rola.
  function tituloSecao(num, titulo, extra) {
    return '<div class="secao__topo">' +
      '<div class="secao__id">' +
        '<span class="secao__num">' + num + '</span>' +
        '<h2>' + u.esc(titulo) + '</h2>' +
      '</div>' +
      (extra || '') +
    '</div>';
  }

  // Letreiro rolante com as frases. Duplicamos a lista para a volta emendar
  // sem salto; se houver pouca frase, repetimos até encher a tela.
  function letreiro() {
    var d = dados();
    if (!d.frases.length) return '';

    var itens = d.frases.slice();
    while (itens.length < 6) itens = itens.concat(d.frases);

    var conteudo = itens.map(function (f) {
      var p = u.pessoa(f.autor);
      return '<span class="letreiro__item">' +
               '<span class="letreiro__frase">“' + u.esc(f.texto) + '”</span>' +
               '<span class="letreiro__autor">' + u.esc(p.nome.split(' ')[0]) + '</span>' +
             '</span>';
    }).join('');

    return '<div class="letreiro" aria-hidden="true">' +
             '<div class="letreiro__trilho">' + conteudo + conteudo + '</div>' +
           '</div>';
  }

  // Quiz "Quem disse isso?": mostra uma frase sem o autor e três chutes.
  function quiz(indiceFrase) {
    var d = dados();
    if (d.frases.length < 1 || d.time.length < 3) return '';

    var f = d.frases[indiceFrase % d.frases.length];
    var certo = u.pessoa(f.autor);

    var outros = d.time.filter(function (p) { return p.id !== certo.id; });
    for (var i = outros.length - 1; i > 0; i--) {
      var k = Math.floor(Math.random() * (i + 1));
      var t = outros[i]; outros[i] = outros[k]; outros[k] = t;
    }
    var opcoes = [certo].concat(outros.slice(0, 2));
    for (var i2 = opcoes.length - 1; i2 > 0; i2--) {
      var k2 = Math.floor(Math.random() * (i2 + 1));
      var t2 = opcoes[i2]; opcoes[i2] = opcoes[k2]; opcoes[k2] = t2;
    }

    return '' +
      '<section class="secao revelar quiz" id="quiz" data-frase="' + (indiceFrase % d.frases.length) + '">' +
        tituloSecao('03', 'Quem disse isso?',
          '<button class="chip" data-acao="outro-quiz">outra rodada</button>') +
        '<div class="quiz__caixa">' +
          '<p class="quiz__frase">“' + u.esc(f.texto) + '”</p>' +
          '<div class="quiz__opcoes">' +
            opcoes.map(function (p) {
              return '<button class="quiz__opcao ' + u.acento(p) + '" type="button" ' +
                     'data-palpite="' + u.esc(p.id) + '">' +
                     u.avatar(p) + '<span>' + u.esc(p.nome.split(' ')[0]) + '</span></button>';
            }).join('') +
          '</div>' +
          '<p class="quiz__veredito" id="quiz-veredito" hidden></p>' +
        '</div>' +
      '</section>';
  }

  // Os três primeiros do ranking, para o pódio da home. Só devolve quem
  // tem pelo menos uma pérola: pódio com zero não é pódio.
  function liderDoRanking() {
    var d = dados();
    var lista = d.time.map(function (p) {
      return { p: p, frases: d.frases.filter(function (f) { return f.autor === p.id; }).length };
    }).filter(function (r) { return r.frases > 0; })
      .sort(function (a, b) { return b.frases - a.frases; })
      .slice(0, 3);
    return lista.length ? lista : null;
  }

  function home() {
    var d = dados();
    var frasesOrdenadas = u.ordenarPorData(d.frases);
    var destaque = u.doDia(frasesOrdenadas);
    var ultimasFrases = frasesOrdenadas.slice(0, 3);
    var lider = liderDoRanking();
    var fotos = u.ordenarPorData(d.galeria).slice(0, 5);
    var img = d.config.destaque || {};

    var html = '' +
      // Abertura: tipografia grande à esquerda, foto deslocada à direita
      '<section class="abertura' + (img.src ? ' abertura--com-foto' : '') + '">' +
        '<div class="abertura__texto">' +
          '<span class="abertura__etiqueta">Arquivo público · desde 2026</span>' +
          '<h1>Tudo que <em>foi dito</em>,<br>feito e fotografado.</h1>' +
          '<p>O museu não oficial do time de produtos. Não existe apagar. ' +
          'Existe só arquivar melhor.</p>' +
          '<div class="abertura__acoes">' +
            '<a class="botao" href="#/frases">Ver as pérolas</a>' +
            '<button class="botao botao--fantasma" data-acao="sortear">🎲 Me surpreenda</button>' +
          '</div>' +
        '</div>' +
        (img.src
          ? '<figure class="abertura__foto">' +
              '<img src="' + u.esc(img.src) + '" alt="' + u.esc(img.legenda || '') + '" ' +
              'data-fallback="📸">' +
              '<span class="abertura__selo">o time<br>inteiro</span>' +
              (img.legenda ? '<figcaption>' + u.esc(img.legenda) + '</figcaption>' : '') +
            '</figure>'
          : '') +
      '</section>' +

      letreiro() +

      // Placar em bento: o primeiro número domina, o resto se acomoda
      '<section class="secao revelar">' +
        tituloSecao('01', 'O acervo em números') +
        '<div class="bento">' +
          '<a class="bento__item bento__item--grande" href="#/frases">' +
            '<div class="bento__numero">' + d.frases.length + '</div>' +
            '<div class="bento__rotulo">frases arquivadas</div>' +
            '<span class="bento__seta" aria-hidden="true">→</span></a>' +
          '<a class="bento__item" href="#/galeria">' +
            '<div class="bento__numero">' + d.galeria.length + '</div>' +
            '<div class="bento__rotulo">evidências</div></a>' +
          '<a class="bento__item" href="#/acervo">' +
            '<div class="bento__numero">' + d.time.length + '</div>' +
            '<div class="bento__rotulo">pastas</div></a>' +
          '<a class="bento__item" href="#/hall">' +
            '<div class="bento__numero">' + d.premios.length + '</div>' +
            '<div class="bento__rotulo">troféus</div></a>' +
          '<a class="bento__item" href="#/time">' +
            '<div class="bento__numero">' + d.time.length + '</div>' +
            '<div class="bento__rotulo">suspeitos</div></a>' +
        '</div>' +
      '</section>';

    if (destaque) {
      var pd = u.pessoa(destaque.autor);
      html +=
        '<section class="secao revelar">' +
          tituloSecao('02', 'A frase do dia',
            '<button class="chip" data-acao="outra-frase">quero outra</button>') +
          '<div class="frase-dia ' + u.acento(pd) + '" id="frase-dia">' +
            '<blockquote>“' + u.esc(destaque.texto) + '”</blockquote>' +
            '<footer>' + u.avatar(pd) + '<strong>' + u.esc(pd.nome) + '</strong>' +
            '<span>· ' + u.esc(u.dataLegivel(destaque.data)) + '</span></footer>' +
          '</div>' +
        '</section>';
    }

    html += quiz(Math.floor(Math.random() * Math.max(1, d.frases.length)));

    if (fotos.length) {
      window.ACERVO._galeriaAtual = fotos;
      html +=
        '<section class="secao revelar">' +
          tituloSecao('04', 'Provas materiais', '<a href="#/galeria">ver a galeria →</a>') +
          '<div class="mosaico">' +
            fotos.map(function (item, i) {
              return '<button class="mosaico__item" type="button" data-foto="' + i + '">' +
                       midiaDaGaleria(item) +
                       '<span class="mosaico__legenda">' + u.esc(item.legenda || '') + '</span>' +
                     '</button>';
            }).join('') +
          '</div>' +
        '</section>';
    }

    html +=
      '<section class="secao revelar">' +
        tituloSecao('05', 'Últimas pérolas', '<a href="#/frases">ver todas →</a>') +
        (ultimasFrases.length
          ? '<div class="grade-frases">' + ultimasFrases.map(cardFrase).join('') + '</div>'
          : u.vazio('Nenhuma frase ainda.', 'Abra o modo edição (✏️) e registre a primeira.')) +
      '</section>' +

      (lider
        ? '<section class="secao revelar">' +
            tituloSecao('06', 'Quem mais rendeu', '<a href="#/hall">ranking completo →</a>') +
            '<div class="podio">' +
              lider.map(function (r, i) {
                return '<a class="podio__lugar ' + u.acento(r.p) + '" href="#/acervo/' +
                  u.esc(r.p.id) + '">' +
                  '<span class="podio__medalha">' + ['🥇', '🥈', '🥉'][i] + '</span>' +
                  u.avatar(r.p, i === 0) +
                  '<strong>' + u.esc(r.p.nome.split(' ')[0]) + '</strong>' +
                  '<span>' + u.plural(r.frases, 'pérola', 'pérolas') + '</span>' +
                '</a>';
              }).join('') +
            '</div>' +
          '</section>'
        : '');

    return html;
  }

  /* --- Acervo: uma pasta por integrante ------------------------------
     No lugar da lista solta de frases, o conteúdo passa a ser organizado
     por pessoa, como uma gaveta de fichas: o índice lista as pastas e cada
     pasta reúne tudo que existe sobre aquele integrante. */

  function fichaDe(id) {
    var d = dados();
    return {
      frases: u.ordenarPorData(d.frases.filter(function (f) { return f.autor === id; })),
      imagens: u.ordenarPorData(d.galeria.filter(function (g) {
        return (g.aparecem || []).indexOf(id) !== -1;
      })),
      premios: d.premios.filter(function (x) { return x.ganhador === id; })
    };
  }

  function acervo(estado) {
    var d = dados();
    var busca = u.normalizar(estado.busca || '');

    var pastas = d.time.map(function (p, i) {
      var f = fichaDe(p.id);
      return {
        p: p,
        numero: ('0' + (i + 1)).slice(-2),
        total: f.frases.length + f.imagens.length + f.premios.length,
        f: f
      };
    }).filter(function (x) {
      if (!busca) return true;
      var alvo = u.normalizar([
        x.p.nome, x.p.cargo, x.p.titulo, x.p.bio,
        x.f.frases.map(function (i) { return i.texto; }).join(' '),
        x.f.imagens.map(function (i) { return i.legenda; }).join(' ')
      ].join(' '));
      return alvo.indexOf(busca) !== -1;
    });

    return '' +
      '<header class="cabecalho-pagina">' +
        '<span class="etiqueta">Índice de pastas</span>' +
        '<h1>Acervo</h1>' +
        '<p>Uma pasta por integrante. Cada uma reúne tudo que o time conseguiu ' +
        'registrar sobre a pessoa: falas, imagens e o que mais aparecer.</p>' +
      '</header>' +

      '<div class="barra-filtros">' +
        '<input class="busca" id="busca-acervo" type="search" ' +
        'placeholder="Buscar por pessoa, frase ou legenda…" value="' + u.esc(estado.busca || '') + '">' +
      '</div>' +

      (pastas.length
        ? '<ol class="pastas">' + pastas.map(function (x) {
            return '<li><a class="pasta ' + u.acento(x.p) + '" href="#/acervo/' + u.esc(x.p.id) + '">' +
              '<span class="pasta__num">' + x.numero + '</span>' +
              u.avatar(x.p) +
              '<span class="pasta__nome">' +
                '<strong>' + u.esc(x.p.nome) + '</strong>' +
                '<small>' + u.esc(x.p.titulo || x.p.cargo || '') + '</small>' +
              '</span>' +
              '<span class="pasta__contas">' +
                '<span>' + x.f.frases.length + ' <em>falas</em></span>' +
                '<span>' + x.f.imagens.length + ' <em>imagens</em></span>' +
              '</span>' +
              '<span class="pasta__seta" aria-hidden="true">→</span>' +
            '</a></li>';
          }).join('') + '</ol>'
        : u.vazio('Nenhuma pasta com esse filtro.', 'Tente outro nome ou trecho de frase.'));
  }

  // A pasta aberta: cabeçalho de ficha, dados em linhas rotuladas e o
  // material reunido embaixo.
  function pasta(id) {
    var d = dados();
    var p = null, indice = -1;
    for (var i = 0; i < d.time.length; i++) {
      if (d.time[i].id === id) { p = d.time[i]; indice = i; }
    }
    if (!p) {
      return '<a class="voltar" href="#/acervo">← voltar ao índice</a>' +
             u.vazio('Não existe pasta com esse nome.', 'Confira o índice do acervo.');
    }

    var f = fichaDe(id);
    var vizinho = d.time[(indice + 1) % d.time.length];
    window.ACERVO._galeriaAtual = f.imagens;

    var linha = function (rotulo, valor) {
      if (!valor) return '';
      return '<div class="ficha__linha"><dt>' + u.esc(rotulo) + '</dt><dd>' + valor + '</dd></div>';
    };

    var html = '' +
      '<a class="voltar" href="#/acervo">← índice do acervo</a>' +

      '<header class="ficha ' + u.acento(p) + '">' +
        '<div class="ficha__id">' +
          '<span class="etiqueta">Pasta ' + ('0' + (indice + 1)).slice(-2) + '</span>' +
          '<h1>' + u.esc(p.nome) + '</h1>' +
          (p.titulo ? '<p class="ficha__titulo">' + u.esc(p.titulo) + '</p>' : '') +
        '</div>' +
        u.avatar(p, true) +
      '</header>' +

      '<dl class="ficha__dados">' +
        linha('Cargo', u.esc(p.cargo || '—')) +
        linha('No time desde', u.esc(p.entrouEm || '—')) +
        linha('Falas registradas', f.frases.length) +
        linha('Imagens', f.imagens.length) +
        linha('Troféus', f.premios.length) +
        linha('Sobre', u.esc(p.bio || '—')) +
        ((p.bordoes || []).length
          ? linha('Bordões', p.bordoes.map(function (b) {
              return '<span class="selo">“' + u.esc(b) + '”</span>';
            }).join(' '))
          : '') +
      '</dl>';

    if (f.frases.length) {
      html += '<section class="secao">' +
        tituloSecao('A', 'Falas registradas') +
        '<div class="grade-frases">' + f.frases.map(cardFrase).join('') + '</div>' +
      '</section>';
    }

    if (f.imagens.length) {
      html += '<section class="secao">' +
        tituloSecao('B', 'Imagens') +
        '<div class="grade-galeria">' +
          f.imagens.map(function (item, i) { return cardFoto(item, i); }).join('') +
        '</div>' +
      '</section>';
    }

    if (f.premios.length) {
      html += '<section class="secao">' +
        tituloSecao('C', 'Troféus') +
        '<div class="grade-premios">' + f.premios.map(cardPremio).join('') + '</div>' +
      '</section>';
    }

    if (!f.frases.length && !f.imagens.length && !f.premios.length) {
      html += u.vazio('Pasta vazia. Por enquanto.',
                      'Nada registrado sobre ' + p.nome.split(' ')[0] + ' ainda. É questão de tempo.');
    }

    html += '<a class="proxima ' + u.acento(vizinho) + '" href="#/acervo/' + u.esc(vizinho.id) + '">' +
              '<span class="etiqueta">Próxima pasta</span>' +
              '<strong>' + u.esc(vizinho.nome) + ' →</strong>' +
            '</a>';

    return html;
  }

  /* --- Galeria: visão infinita ---------------------------------------
     O plano de fundo é uma malha que se repete nos quatro sentidos; o
     arraste move a malha e ela se reposiciona por módulo, então nunca
     acaba. O botão alterna para a grade normal, que é o caminho de quem
     navega por teclado ou prefere ver tudo de uma vez. */
  function galeria(estado) {
    var d = dados();
    var lista = u.ordenarPorData(d.galeria);
    window.ACERVO._galeriaAtual = lista;

    var cabecalho = '' +
      '<header class="cabecalho-pagina">' +
        '<span class="etiqueta">' + u.plural(lista.length, 'registro visual', 'registros visuais') + '</span>' +
        '<h1>Galeria</h1>' +
        '<p>Arraste para percorrer. Clique em qualquer item para ver a ficha completa.</p>' +
      '</header>' +
      '<div class="barra-filtros">' +
        '<button class="chip" data-acao="modo-galeria" aria-pressed="' +
          (estado.modo === 'grade') + '">' +
          (estado.modo === 'grade' ? '⤢ visão infinita' : '▦ ver em grade') +
        '</button>' +
      '</div>';

    if (!lista.length) {
      return cabecalho + u.vazio('Sem imagens por aqui.',
        'Suba os arquivos em assets/img/galeria/ e cadastre no modo edição (✏️).');
    }

    if (estado.modo === 'grade') {
      return cabecalho +
        '<div class="grade-galeria">' +
          lista.map(function (item, i) { return cardFoto(item, i); }).join('') +
        '</div>';
    }

    // Nove cópias da malha (3x3): o arraste nunca alcança a borda
    var celulas = lista.map(function (item, i) {
      return '<button class="inf__item" type="button" data-foto="' + i + '" ' +
             'tabindex="-1" aria-hidden="true">' + midiaDaGaleria(item) + '</button>';
    }).join('');

    var malha = '<div class="inf__malha">' + celulas + '</div>';
    var copias = '';
    for (var linha = 0; linha < 3; linha++) {
      for (var col = 0; col < 3; col++) copias += malha;
    }

    return cabecalho +
      '<div class="inf" id="inf">' +
        '<div class="inf__plano" id="inf-plano">' + copias + '</div>' +
        '<p class="inf__dica" aria-hidden="true">arraste para explorar · clique para abrir</p>' +
      '</div>' +
      '<p class="contagem">A visão infinita é feita para o mouse e o toque. ' +
      'Para navegar pelo teclado, use <button class="ligacao" data-acao="modo-galeria">ver em grade</button>.</p>';
  }

  /* --- Hall da Fama: ranking por pérolas registradas ------------------ */
  function hall() {
    var d = dados();

    var ranking = d.time.map(function (p) {
      var f = fichaDe(p.id);
      return { p: p, frases: f.frases.length, imagens: f.imagens.length };
    }).sort(function (a, b) {
      if (b.frases !== a.frases) return b.frases - a.frases;
      return b.imagens - a.imagens;
    });

    var maior = ranking.length ? ranking[0].frases : 0;
    var totalFrases = d.frases.length;

    // Posição com empate: quem tem o mesmo número divide o lugar
    var posicao = 0, anterior = null;
    ranking.forEach(function (r, i) {
      if (r.frases !== anterior) { posicao = i + 1; anterior = r.frases; }
      r.pos = posicao;
    });

    var medalha = function (pos, frases) {
      if (!frases) return '·';
      return pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
    };

    var html = '' +
      '<header class="cabecalho-pagina">' +
        '<span class="etiqueta">Classificação ao vivo</span>' +
        '<h1>Hall da Fama</h1>' +
        '<p>Quem mais rendeu pérola para o acervo. A tabela se refaz sozinha a cada ' +
        'frase registrada — ninguém escolhe, ninguém vota. ' +
        (totalFrases ? 'Hoje são ' + u.plural(totalFrases, 'fala arquivada', 'falas arquivadas') + '.' : '') +
        '</p>' +
      '</header>';

    if (!totalFrases) {
      return html + u.vazio('O ranking está zerado.',
        'Registre a primeira frase e a classificação começa a se mexer.');
    }

    html += '<ol class="ranking">' + ranking.map(function (r) {
      var largura = maior ? Math.round(r.frases / maior * 100) : 0;
      return '<li class="ranking__linha ' + u.acento(r.p) + (r.frases ? '' : ' ranking__linha--zero') + '">' +
        '<span class="ranking__pos">' + medalha(r.pos, r.frases) + '</span>' +
        u.avatar(r.p) +
        '<a class="ranking__nome" href="#/acervo/' + u.esc(r.p.id) + '">' +
          '<strong>' + u.esc(r.p.nome) + '</strong>' +
          '<small>' + u.esc(r.p.titulo || r.p.cargo || '') + '</small>' +
        '</a>' +
        '<span class="ranking__barra"><span style="width:' + largura + '%"></span></span>' +
        '<span class="ranking__conta">' + r.frases + '</span>' +
      '</li>';
    }).join('') + '</ol>';

    if (d.premios.length) {
      html += '<section class="secao" style="margin-top:44px">' +
        tituloSecao('★', 'Troféus entregues') +
        '<div class="grade-premios">' + d.premios.map(cardPremio).join('') + '</div>' +
      '</section>';
    } else {
      html += '<p class="contagem" style="margin-top:32px">' +
        'Os troféus pontuais entram aqui quando o time criar as categorias. ' +
        'Por ora, o ranking fala sozinho.</p>';
    }

    return html;
  }

  function time() {
    var d = dados();
    return '' +
      '<header class="cabecalho-pagina">' +
        '<span class="etiqueta">' + d.time.length + ' pessoas</span>' +
        '<h1>Os suspeitos</h1>' +
        '<p>Nove pessoas, nove cargos oficiais e nove cargos de verdade. ' +
        'Todo o conteúdo deste acervo é responsabilidade de alguém aqui embaixo — ' +
        'nenhuma delas assume qual.</p>' +
      '</header>' +
      (d.time.length
        ? '<div class="grade-time">' + d.time.map(cardPessoa).join('') + '</div>'
        : u.vazio('Time vazio.', 'Cadastre as pessoas em data/time.js.'));
  }

  function comoContribuir() {
    return '' +
      '<header class="cabecalho-pagina">' +
        '<h1>Como adicionar conteúdo</h1>' +
        '<p>Não precisa saber programar. Todo o conteúdo do site fica em arquivos ' +
        'de texto dentro da pasta <code>data/</code>.</p>' +
      '</header>' +
      '<div class="guia">' +
        '<h3>1. Escolha o arquivo certo</h3>' +
        '<ul>' +
          '<li><code>data/time.js</code> — as pessoas do time</li>' +
          '<li><code>data/frases.js</code> — as pérolas ditas</li>' +
          '<li><code>data/galeria.js</code> — fotos e prints</li>' +
          '<li><code>data/premios.js</code> — troféus do Hall da Fama</li>' +
        '</ul>' +

        '<h3>2. Copie um bloco existente e edite</h3>' +
        '<p>Cada item é um bloco entre chaves. Duplique um, cole logo abaixo e troque o conteúdo. ' +
        'A única regra: <strong>vírgula entre um bloco e outro</strong>.</p>' +
        '<pre><code>{\n' +
        '  texto: \'Se ninguém reclamar, é porque funcionou.\',\n' +
        '  autor: \'joao\',            // o id da pessoa em data/time.js\n' +
        '  contexto: \'Sexta-feira, 17h50.\',\n' +
        '  data: \'2026-03-14\',       // sempre AAAA-MM-DD\n' +
        '  tags: [\'deploy\'],\n' +
        '  nota: 5                    // 1 a 5 pimentas de absurdo\n' +
        '},</code></pre>' +

        '<h3>3. Fotos, prints e vídeos</h3>' +
        '<p>Suba os arquivos em <code>assets/img/galeria/</code> e referencie o caminho no campo ' +
        '<code>src</code>. Vale imagem e vídeo (<code>.mp4</code>, <code>.webm</code>): o vídeo vira ' +
        'miniatura no mural e toca com som ao abrir. Se o arquivo não existir ainda, o site mostra ' +
        'um card avisando — nada quebra.</p>' +
        '<p>Nome de arquivo sem espaço, sem parêntese e sem acento — esses viram <code>%20</code> e ' +
        '<code>%28</code> na URL e dão dor de cabeça.</p>' +

        '<h3>4. Veja antes de publicar</h3>' +
        '<p>Abra o <code>index.html</code> direto no navegador. Não precisa instalar nada, ' +
        'não tem build, não tem servidor.</p>' +

        '<h3>5. Sobre o visual</h3>' +
        '<p>As cores, fontes e cantos vêm do Design System do time. Cada pessoa ganha ' +
        'automaticamente uma cor da paleta pela posição em <code>data/time.js</code> — ' +
        'não precisa escolher cor na mão.</p>' +

        '<h3>6. Publique</h3>' +
        '<p>Commit e push na branch principal. O site atualiza sozinho pelo GitHub Pages.</p>' +

        '<h3>Regras não escritas do acervo</h3>' +
        '<ul>' +
          '<li>Frase editada para ficar melhor perde a graça. Registre como foi dita.</li>' +
          '<li>O contexto é metade da piada. Sempre preencha.</li>' +
          '<li>Rimos com, não de. Se a pessoa não achar graça, sai do ar.</li>' +
          '<li>Print sem data é boato.</li>' +
        '</ul>' +
      '</div>';
  }

  function naoEncontrada() {
    return '<header class="cabecalho-pagina"><h1>404</h1></header>' +
           u.vazio('Essa página não existe.',
                   'Assim como aquela feature que a gente jurou que ia entregar no Q2.') +
           '<p style="text-align:center;margin-top:24px"><a class="botao" href="#/">Voltar pro começo</a></p>';
  }

  return {
    home: home,
    acervo: acervo,
    pasta: pasta,
    galeria: galeria,
    hall: hall,
    time: time,
    comoContribuir: comoContribuir,
    naoEncontrada: naoEncontrada,
    cardFrase: cardFrase,
    midiaDaGaleria: midiaDaGaleria,
    quiz: quiz,
    tituloSecao: tituloSecao
  };
})();
