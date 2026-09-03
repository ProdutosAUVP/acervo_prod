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
      momentos: window.ACERVO.momentos || [],
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
          '<a href="#/time/' + u.esc(p.id) + '">' +
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

  function cardMomento(m) {
    var pessoas = (m.envolvidos || []).map(u.linkPessoa).join(' ');
    return '' +
      '<article class="momento tipo-' + u.esc(m.tipo || 'caos') + '">' +
        '<div class="momento__topo">' +
          '<h3>' + u.esc(m.titulo) + '</h3>' +
          '<span class="selo">' + u.esc(m.tipo || 'caos') + '</span>' +
          (m.gravidade ? '<span title="Gravidade ' + u.esc(m.gravidade) + '/5">' +
                         u.pimenta(m.gravidade) + '</span>' : '') +
        '</div>' +
        '<div class="momento__data">' + u.esc(u.dataLegivel(m.data)) + '</div>' +
        '<p class="momento__relato">' + u.esc(m.relato) + '</p>' +
        (pessoas ? '<div class="momento__pessoas">' + pessoas + '</div>' : '') +
      '</article>';
  }

  function cardPremio(pr) {
    var p = u.pessoa(pr.ganhador);
    return '' +
      '<article class="premio ' + u.acento(p) + '">' +
        '<div class="premio__emoji">' + u.esc(pr.emoji || '🏆') + '</div>' +
        '<h3 class="premio__titulo">' + u.esc(pr.titulo) + '</h3>' +
        '<p class="premio__descricao">' + u.esc(pr.descricao || '') + '</p>' +
        '<div class="premio__ganhador">' + u.avatar(p) +
          '<a href="#/time/' + u.esc(p.id) + '"><strong>' + u.esc(p.nome) + '</strong></a>' +
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
      '<a class="pessoa ' + u.acento(p) + '" href="#/time/' + u.esc(p.id) + '">' +
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

  function home() {
    var d = dados();
    var frasesOrdenadas = u.ordenarPorData(d.frases);
    var destaque = u.doDia(frasesOrdenadas);
    var ultimasFrases = frasesOrdenadas.slice(0, 3);
    var ultimosMomentos = u.ordenarPorData(d.momentos).slice(0, 2);
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
          '<a class="bento__item" href="#/momentos">' +
            '<div class="bento__numero">' + d.momentos.length + '</div>' +
            '<div class="bento__rotulo">momentos</div></a>' +
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

      '<section class="secao revelar">' +
        tituloSecao('06', 'Acontecimentos', '<a href="#/momentos">linha do tempo →</a>') +
        (ultimosMomentos.length
          ? '<div class="linha-tempo">' + ultimosMomentos.map(cardMomento).join('') + '</div>'
          : u.vazio('A história ainda não começou.', 'Registre o primeiro causo no modo edição (✏️).')) +
      '</section>';

    return html;
  }

  function frases(estado) {
    var d = dados();
    var lista = u.ordenarPorData(d.frases);
    var busca = u.normalizar(estado.busca || '');
    var autor = estado.autor || '';

    var filtradas = lista.filter(function (f) {
      if (autor && f.autor !== autor) return false;
      if (!busca) return true;
      var alvo = u.normalizar([
        f.texto, f.contexto, (f.tags || []).join(' '), u.pessoa(f.autor).nome
      ].join(' '));
      return alvo.indexOf(busca) !== -1;
    });

    var chips = '<button class="chip" data-filtro-autor="" aria-pressed="' + (!autor) + '">todo mundo</button>' +
      d.time.map(function (p) {
        var icone = p.foto
          ? '<img class="chip__foto" src="' + u.esc(p.foto) + '" alt="" loading="lazy" ' +
            'data-fallback="' + u.esc(p.emoji || '👤') + '">'
          : u.esc(p.emoji || '👤');
        return '<button class="chip" data-filtro-autor="' + u.esc(p.id) + '" aria-pressed="' +
               (autor === p.id) + '">' + icone + ' ' + u.esc(p.nome.split(' ')[0]) + '</button>';
      }).join('');

    return '' +
      '<header class="cabecalho-pagina">' +
        '<h1>Frases</h1>' +
        '<p>Pérolas ditas em voz alta, na frente de testemunhas. ' +
        'Nenhuma foi editada para ficar mais bonita.</p>' +
      '</header>' +
      '<div class="barra-filtros">' +
        '<input class="busca" id="busca-frases" type="search" placeholder="Buscar frase, contexto ou pessoa…" ' +
        'value="' + u.esc(estado.busca || '') + '">' +
        chips +
      '</div>' +
      '<p class="contagem">' + u.plural(filtradas.length, 'frase encontrada', 'frases encontradas') + '</p>' +
      (filtradas.length
        ? '<div class="grade-frases">' + filtradas.map(cardFrase).join('') + '</div>'
        : u.vazio('Nenhuma frase com esse filtro.', 'Ou ninguém falou besteira sobre isso ainda, o que é improvável.'));
  }

  function galeria(estado) {
    var d = dados();
    var lista = u.ordenarPorData(d.galeria);
    var busca = u.normalizar(estado.busca || '');

    // Guarda a lista atual para o lightbox saber o que abrir
    window.ACERVO._galeriaAtual = lista.filter(function (item) {
      if (!busca) return true;
      var alvo = u.normalizar([
        item.legenda, (item.tags || []).join(' '),
        (item.aparecem || []).map(function (id) { return u.pessoa(id).nome; }).join(' ')
      ].join(' '));
      return alvo.indexOf(busca) !== -1;
    });

    var visiveis = window.ACERVO._galeriaAtual;

    return '' +
      '<header class="cabecalho-pagina">' +
        '<h1>Galeria</h1>' +
        '<p>Fotos, prints e provas materiais. Clique para ampliar a vergonha.</p>' +
      '</header>' +
      '<div class="barra-filtros">' +
        '<input class="busca" id="busca-galeria" type="search" placeholder="Buscar por legenda, pessoa ou tag…" ' +
        'value="' + u.esc(estado.busca || '') + '">' +
      '</div>' +
      (visiveis.length
        ? '<div class="grade-galeria">' + visiveis.map(cardFoto).join('') + '</div>'
        : u.vazio('Sem imagens por aqui.', 'Suba os arquivos em assets/img/galeria/ e cadastre em data/galeria.js.'));
  }

  function momentos() {
    var d = dados();
    var lista = u.ordenarPorData(d.momentos);
    return '' +
      '<header class="cabecalho-pagina">' +
        '<h1>Linha do tempo</h1>' +
        '<p>Os acontecimentos que moldaram este time — para o bem e, principalmente, para o mal.</p>' +
      '</header>' +
      (lista.length
        ? '<div class="linha-tempo">' + lista.map(cardMomento).join('') + '</div>'
        : u.vazio('A história ainda não começou.', 'Registre o primeiro causo em data/momentos.js.'));
  }

  function hall() {
    var d = dados();
    return '' +
      '<header class="cabecalho-pagina">' +
        '<h1>Hall da Fama</h1>' +
        '<p>Prêmios honoríficos entregues por mérito absolutamente questionável. ' +
        'Não há recurso.</p>' +
      '</header>' +
      (d.premios.length
        ? '<div class="grade-premios">' + d.premios.map(cardPremio).join('') + '</div>'
        : u.vazio('Nenhum troféu entregue.', 'Crie a primeira categoria em data/premios.js.'));
  }

  function time() {
    var d = dados();
    return '' +
      '<header class="cabecalho-pagina">' +
        '<h1>Os suspeitos</h1>' +
        '<p>Nove pessoas, nove cargos oficiais e nove cargos de verdade. ' +
        'Todo o conteúdo deste acervo é responsabilidade de alguém aqui embaixo — ' +
        'nenhuma delas assume qual.</p>' +
      '</header>' +
      (d.time.length
        ? '<div class="grade-time">' + d.time.map(cardPessoa).join('') + '</div>'
        : u.vazio('Time vazio.', 'Cadastre as pessoas em data/time.js.'));
  }

  function perfil(id) {
    var d = dados();
    var p = null;
    for (var i = 0; i < d.time.length; i++) {
      if (d.time[i].id === id) { p = d.time[i]; break; }
    }
    if (!p) {
      return '<a class="voltar" href="#/time">← voltar para o time</a>' +
             u.vazio('Não achamos essa pessoa.', 'Ou ela nunca existiu, ou apagaram os rastros.');
    }

    var minhasFrases = u.ordenarPorData(d.frases.filter(function (f) { return f.autor === p.id; }));
    var meusPremios = d.premios.filter(function (x) { return x.ganhador === p.id; });
    var meusMomentos = u.ordenarPorData(d.momentos.filter(function (m) {
      return (m.envolvidos || []).indexOf(p.id) !== -1;
    }));
    var minhasFotos = u.ordenarPorData(d.galeria.filter(function (g) {
      return (g.aparecem || []).indexOf(p.id) !== -1;
    }));
    window.ACERVO._galeriaAtual = minhasFotos;

    var bordoes = (p.bordoes || []).map(function (b) {
      return '<span class="selo">“' + u.esc(b) + '”</span>';
    }).join('');

    var html = '' +
      '<a class="voltar" href="#/time">← voltar para o time</a>' +
      '<section class="perfil ' + u.acento(p) + '">' +
        u.avatar(p, true) +
        '<div class="perfil__info">' +
          '<h1>' + u.esc(p.nome) + '</h1>' +
          (p.titulo ? '<span class="selo selo--acento">' + u.esc(p.titulo) + '</span>' : '') +
          '<p class="pessoa__cargo">' + u.esc(p.cargo || '') +
          (p.entrouEm ? ' · no time desde ' + u.esc(p.entrouEm) : '') + '</p>' +
          '<p>' + u.esc(p.bio || '') + '</p>' +
          (bordoes ? '<div class="perfil__bordoes">' + bordoes + '</div>' : '') +
        '</div>' +
      '</section>' +

      '<section class="placar">' +
        '<div class="placar__item"><div class="placar__numero">' + minhasFrases.length + '</div>' +
          '<div class="placar__rotulo">frases</div></div>' +
        '<div class="placar__item"><div class="placar__numero">' + meusPremios.length + '</div>' +
          '<div class="placar__rotulo">troféus</div></div>' +
        '<div class="placar__item"><div class="placar__numero">' + meusMomentos.length + '</div>' +
          '<div class="placar__rotulo">momentos</div></div>' +
        '<div class="placar__item"><div class="placar__numero">' + minhasFotos.length + '</div>' +
          '<div class="placar__rotulo">aparições</div></div>' +
      '</section>';

    if (meusPremios.length) {
      html += '<section class="secao"><h2>Troféus</h2>' +
              '<div class="grade-premios">' + meusPremios.map(cardPremio).join('') + '</div></section>';
    }
    if (minhasFrases.length) {
      html += '<section class="secao"><h2>Pérolas registradas</h2>' +
              '<div class="grade-frases">' + minhasFrases.map(cardFrase).join('') + '</div></section>';
    }
    if (meusMomentos.length) {
      html += '<section class="secao"><h2>Envolvimento em episódios</h2>' +
              '<div class="linha-tempo">' + meusMomentos.map(cardMomento).join('') + '</div></section>';
    }
    if (minhasFotos.length) {
      html += '<section class="secao"><h2>Aparições</h2>' +
              '<div class="grade-galeria">' + minhasFotos.map(cardFoto).join('') + '</div></section>';
    }
    if (!meusPremios.length && !minhasFrases.length && !meusMomentos.length && !minhasFotos.length) {
      html += u.vazio('Ficha limpa. Por enquanto.', 'É só questão de tempo.');
    }

    return html;
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
          '<li><code>data/momentos.js</code> — os causos da linha do tempo</li>' +
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
    frases: frases,
    galeria: galeria,
    momentos: momentos,
    hall: hall,
    time: time,
    perfil: perfil,
    comoContribuir: comoContribuir,
    naoEncontrada: naoEncontrada,
    midiaDaGaleria: midiaDaGaleria,
    quiz: quiz,
    tituloSecao: tituloSecao,
    cardFrase: cardFrase
  };
})();
