/* =========================================================================
   APLICAÇÃO
   Roteador por hash (#/frases, #/time/joao, ...), tema, busca, lightbox
   e as brincadeiras. Para adicionar conteúdo, mexa na pasta /data.
   ========================================================================= */

(function () {
  'use strict';

  var u = window.ACERVO.utils;
  var views = window.ACERVO.views;
  var app = document.getElementById('app');

  // Estado de busca/filtro de cada página (não recarrega o site)
  var estado = {
    acervo: { busca: '' },
    galeria: { modo: 'infinita' }
  };

  /* ---------------- Tema ----------------
     Três estados: Sistema (padrão), Claro e Escuro.

     O contrato de armazenamento é o mesmo da central do time
     ('auvp-theme' com 'light' | 'dark'; sem chave = seguir o sistema).
     Como os dois sites vivem no mesmo domínio, quem escolher um tema em
     um deles encontra o mesmo tema no outro.

     A classe .dark no <html> é a do Design System. O tema também é
     aplicado no <head>, antes da primeira pintura, para não piscar. */
  var CHAVE_TEMA = 'auvp-theme';
  var consultaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

  function temaEscolhido() {
    try {
      var salvo = localStorage.getItem(CHAVE_TEMA);
      return (salvo === 'light' || salvo === 'dark') ? salvo : 'sistema';
    } catch (e) {
      return 'sistema';
    }
  }

  function aplicarTema() {
    var escolha = temaEscolhido();
    var escuro = escolha === 'dark' || (escolha === 'sistema' && consultaEscuro.matches);

    document.documentElement.classList.toggle('dark', escuro);

    var icone = document.getElementById('tema-icone');
    var label = document.getElementById('tema-label');
    var botao = document.getElementById('tema-botao');
    var rotulos = { sistema: ['🖥️', 'Sistema'], light: ['☀️', 'Claro'], dark: ['🌙', 'Escuro'] };

    if (icone) icone.textContent = rotulos[escolha][0];
    // O botão é só o ícone; o texto vive no rótulo invisível (leitores de
    // tela) e no title (quem passa o mouse).
    if (label) label.textContent = rotulos[escolha][1];
    if (botao) {
      var descricao = 'Tema: ' + rotulos[escolha][1] +
        (escolha === 'sistema' ? ' (seguindo o seu computador)' : '') +
        ' — clique para alternar';
      botao.setAttribute('title', descricao);
      botao.setAttribute('aria-label', descricao);
    }
  }

  function iniciarTema() {
    aplicarTema();

    var botao = document.getElementById('tema-botao');
    if (botao) {
      botao.addEventListener('click', function () {
        // Sistema → Claro → Escuro → Sistema
        var proximo = { sistema: 'light', light: 'dark', dark: 'sistema' }[temaEscolhido()];
        try {
          if (proximo === 'sistema') localStorage.removeItem(CHAVE_TEMA);
          else localStorage.setItem(CHAVE_TEMA, proximo);
        } catch (e) { /* modo anônimo: vale só para esta sessão */ }
        aplicarTema();
      });
    }

    // Se o computador trocar de tema com o site aberto, acompanha na hora
    var aoMudar = function () { if (temaEscolhido() === 'sistema') aplicarTema(); };
    if (consultaEscuro.addEventListener) consultaEscuro.addEventListener('change', aoMudar);
    else if (consultaEscuro.addListener) consultaEscuro.addListener(aoMudar);
  }

  /* ---------------- Cabeçalho ---------------- */
  function iniciarCabecalho() {
    var cfg = window.ACERVO.config || {};

    var slotNome = document.querySelector('[data-slot="nome-site"]');
    if (slotNome && cfg.nome) slotNome.textContent = cfg.nome;
    if (cfg.nome) document.title = cfg.nome;

    var slotSub = document.querySelector('[data-slot="subtitulo"]');
    var subs = cfg.subtitulos || [];
    if (slotSub && subs.length) {
      var indice = Math.floor(Math.random() * subs.length);
      slotSub.textContent = subs[indice];
      // Troca o subtítulo de tempos em tempos, só pela piada
      setInterval(function () {
        indice = (indice + 1) % subs.length;
        slotSub.style.opacity = '0';
        setTimeout(function () {
          slotSub.textContent = subs[indice];
          slotSub.style.opacity = '1';
        }, 250);
      }, 9000);
      slotSub.style.transition = 'opacity .25s';
    }

    var slotRodape = document.querySelector('[data-slot="rodape"]');
    if (slotRodape) slotRodape.textContent = cfg.rodape || '';

    var slotContagem = document.querySelector('[data-slot="contagem"]');
    if (slotContagem) {
      var total = (window.ACERVO.frases || []).length +
                  (window.ACERVO.galeria || []).length +
                  (window.ACERVO.premios || []).length;
      slotContagem.textContent = u.plural(total, 'registro no acervo', 'registros no acervo');
    }

    // Menu do celular
    var menuBotao = document.getElementById('menu-botao');
    var nav = document.getElementById('nav-principal');
    if (menuBotao && nav) {
      menuBotao.addEventListener('click', function () {
        var aberto = nav.classList.toggle('aberto');
        menuBotao.setAttribute('aria-expanded', String(aberto));
      });
      nav.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'A') {
          nav.classList.remove('aberto');
          menuBotao.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ---------------- Roteador ---------------- */
  function rotaAtual() {
    var hash = window.location.hash.replace(/^#/, '') || '/';
    return hash.split('?')[0];
  }

  function renderizar() {
    var rota = rotaAtual();
    var partes = rota.split('/').filter(Boolean); // '/time/joao' -> ['time','joao']
    var html;

    // Endereços antigos continuam funcionando: quem tiver um link salvo de
    // #/frases ou #/time/alguem cai no lugar novo em vez de num 404.
    if (partes[0] === 'frases') { irPara('/acervo'); return; }
    if (partes[0] === 'time' && partes[1]) { irPara('/acervo/' + partes[1]); return; }

    switch (partes[0]) {
      case undefined:      html = views.home(); break;
      case 'acervo':       html = partes[1] ? views.pasta(partes[1]) : views.acervo(estado.acervo); break;
      case 'galeria':      html = views.galeria(estado.galeria); break;
      case 'hall':         html = views.hall(); break;
      case 'time':         html = views.time(); break;
      case 'como-contribuir': html = views.comoContribuir(); break;
      default:             html = views.naoEncontrada();
    }

    app.innerHTML = html;
    app.style.animation = 'none';
    void app.offsetWidth;         // força o navegador a reiniciar a animação
    app.style.animation = '';

    marcarNavegacaoAtiva(partes[0]);
    u.tratarImagens(app);
    ligarEventosDaPagina();
    revelarAoRolar();
  }

  // O modo edição chama isto para o site refletir a alteração na hora.
  window.ACERVO.renderizar = renderizar;

  function marcarNavegacaoAtiva(secao) {
    var links = document.querySelectorAll('.nav a');
    Array.prototype.forEach.call(links, function (a) {
      var rota = a.getAttribute('data-rota');
      var ativo = (!secao && rota === '/') || (secao && rota === '/' + secao);
      if (ativo) { a.setAttribute('aria-current', 'page'); }
      else { a.removeAttribute('aria-current'); }
    });
  }

  function irPara(rota) {
    window.location.hash = rota;
  }

  /* ---------------- Revelação ao rolar ----------------
     As seções entram conforme aparecem na tela. A classe que as esconde é
     posta aqui, no JS: se o script falhar ou não rodar, a página fica
     visível do jeito normal em vez de ficar em branco. */
  var observador = null;

  function revelarAoRolar() {
    var alvos = app.querySelectorAll('.revelar');
    if (!alvos.length) return;

    var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(alvos, function (el) { el.classList.add('revelado'); });
      return;
    }

    document.documentElement.classList.add('pode-revelar');
    if (observador) observador.disconnect();

    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('revelado');
        observador.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(alvos, function (el) {
      el.classList.remove('revelado');
      observador.observe(el);
    });
  }

  /* ---------------- Eventos das páginas ---------------- */
  function ligarEventosDaPagina() {
    // Busca do acervo
    var buscaAcervo = document.getElementById('busca-acervo');
    if (buscaAcervo) {
      buscaAcervo.addEventListener('input', function () {
        estado.acervo.busca = this.value;
        var posicao = this.selectionStart;
        renderizar();
        var novo = document.getElementById('busca-acervo');
        if (novo) { novo.focus(); novo.setSelectionRange(posicao, posicao); }
      });
    }

    // Alternar entre visão infinita e grade
    Array.prototype.forEach.call(document.querySelectorAll('[data-acao="modo-galeria"]'), function (b) {
      b.addEventListener('click', function () {
        estado.galeria.modo = estado.galeria.modo === 'grade' ? 'infinita' : 'grade';
        renderizar();
      });
    });

    iniciarVisaoInfinita();

    // Abrir foto no lightbox
    var fotos = document.querySelectorAll('[data-foto]');
    Array.prototype.forEach.call(fotos, function (botao) {
      botao.addEventListener('click', function () {
        abrirLightbox(parseInt(this.getAttribute('data-foto'), 10));
      });
    });

    // Botões "me surpreenda" e "quero outra": ambos trocam a frase em
    // destaque na home, sem recarregar a página.
    function trocarFraseDoDia(rolar) {
      var f = u.aleatorio(window.ACERVO.frases || []);
      var caixa = document.getElementById('frase-dia');
      if (!f || !caixa) return false;

      var p = u.pessoa(f.autor);
      caixa.className = 'frase-dia ' + u.acento(p);   // o destaque segue quem falou
      caixa.innerHTML = '<blockquote>“' + u.esc(f.texto) + '”</blockquote>' +
        '<footer>' + u.avatar(p) + '<strong>' + u.esc(p.nome) + '</strong>' +
        '<span>· ' + u.esc(u.dataLegivel(f.data)) + '</span></footer>';
      u.tratarImagens(caixa);
      if (rolar) caixa.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }

    var sortear = document.querySelector('[data-acao="sortear"]');
    if (sortear) {
      sortear.addEventListener('click', function () {
        u.confete();
        // Sem frase cadastrada não há o que sortear: manda para a seção.
        if (!trocarFraseDoDia(true)) irPara('/frases');
      });
    }

    var outra = document.querySelector('[data-acao="outra-frase"]');
    if (outra) {
      outra.addEventListener('click', function () { trocarFraseDoDia(false); });
    }

    // Quiz "Quem disse isso?"
    var palpites = document.querySelectorAll('[data-palpite]');
    Array.prototype.forEach.call(palpites, function (botao) {
      botao.addEventListener('click', function () {
        var quiz = document.getElementById('quiz');
        var veredito = document.getElementById('quiz-veredito');
        if (!quiz || !veredito || quiz.classList.contains('quiz--respondido')) return;

        var indice = parseInt(quiz.getAttribute('data-frase'), 10);
        var frase = (window.ACERVO.frases || [])[indice];
        if (!frase) return;

        var certo = frase.autor;
        var acertou = this.getAttribute('data-palpite') === certo;
        quiz.classList.add('quiz--respondido');

        // Marca todas as opções: a certa em verde, o palpite errado em vermelho
        Array.prototype.forEach.call(quiz.querySelectorAll('[data-palpite]'), function (b) {
          if (b.getAttribute('data-palpite') === certo) b.classList.add('quiz__opcao--certa');
          else if (b === botao) b.classList.add('quiz__opcao--errada');
          b.disabled = true;
        });

        var nome = u.pessoa(certo).nome;
        veredito.hidden = false;
        veredito.className = 'quiz__veredito ' + (acertou ? 'quiz__veredito--certo' : 'quiz__veredito--errado');
        veredito.innerHTML = acertou
          ? '✅ <strong>Acertou.</strong> Foi ' + u.esc(nome) + ' mesmo. ' +
            'Preocupante você ter reconhecido tão rápido.'
          : '❌ <strong>Errou.</strong> Quem disse foi ' + u.esc(nome) + '.';

        if (acertou) u.confete(['✅', '🎉', '🧠']);
      });
    });

    var outroQuiz = document.querySelector('[data-acao="outro-quiz"]');
    if (outroQuiz) {
      // Redesenhar a home inteira sortearia outra frase do dia junto; aqui
      // só o quiz precisa mudar, então ele é trocado no lugar.
      outroQuiz.addEventListener('click', function () {
        var quiz = document.getElementById('quiz');
        if (!quiz) return;
        var total = (window.ACERVO.frases || []).length;
        if (!total) return;
        var atual = parseInt(quiz.getAttribute('data-frase'), 10);
        var proximo = total > 1 ? (atual + 1 + Math.floor(Math.random() * (total - 1))) % total : 0;

        var molde = document.createElement('div');
        molde.innerHTML = views.quiz(proximo);
        var novo = molde.firstChild;
        if (!novo) return;
        quiz.parentNode.replaceChild(novo, quiz);
        u.tratarImagens(novo);
        ligarEventosDaPagina();
      });
    }
  }

  /* ---------------- Galeria em visão infinita ----------------
     O plano tem 3x3 cópias da mesma malha. Arrastar move o plano; quando o
     deslocamento passa do tamanho de uma malha, ele volta por módulo — o
     conteúdo emenda e a exploração não tem fim nem borda.

     Só o bloco do meio é alcançável por leitor de tela e teclado; as cópias
     ficam com aria-hidden. Quem navega por teclado usa o botão "ver em
     grade", que mostra a mesma coleção em lista normal. */
  function iniciarVisaoInfinita() {
    var caixa = document.getElementById('inf');
    var plano = document.getElementById('inf-plano');
    if (!caixa || !plano) return;

    var malhas = plano.querySelectorAll('.inf__malha');
    if (!malhas.length) return;

    var x = 0, y = 0, larguraMalha = 0, alturaMalha = 0;
    var arrastando = false, moveu = 0, px = 0, py = 0;

    function medir() {
      var m = malhas[0].getBoundingClientRect();
      larguraMalha = m.width;
      alturaMalha = m.height;
      // Começa deslocado uma malha, para haver conteúdo nos quatro sentidos
      if (!x && !y) { x = -larguraMalha; y = -alturaMalha; }
      posicionar();
    }

    function posicionar() {
      if (larguraMalha) {
        // Mantém o deslocamento sempre dentro de uma malha
        x = ((x % larguraMalha) + larguraMalha) % larguraMalha - larguraMalha;
        y = ((y % alturaMalha) + alturaMalha) % alturaMalha - alturaMalha;
      }
      plano.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    }

    caixa.addEventListener('pointerdown', function (ev) {
      arrastando = true; moveu = 0;
      px = ev.clientX; py = ev.clientY;
      caixa.setPointerCapture(ev.pointerId);
      caixa.classList.add('inf--arrastando');
    });

    caixa.addEventListener('pointermove', function (ev) {
      if (!arrastando) return;
      var dx = ev.clientX - px, dy = ev.clientY - py;
      px = ev.clientX; py = ev.clientY;
      moveu += Math.abs(dx) + Math.abs(dy);
      x += dx; y += dy;
      posicionar();
    });

    var soltar = function (ev) {
      if (!arrastando) return;
      arrastando = false;
      caixa.classList.remove('inf--arrastando');
      if (ev.pointerId !== undefined && caixa.hasPointerCapture &&
          caixa.hasPointerCapture(ev.pointerId)) {
        caixa.releasePointerCapture(ev.pointerId);
      }
    };

    // O clique é resolvido aqui, e não por um listener em cada item: com o
    // ponteiro capturado pela caixa, o evento 'click' nasce na caixa e nunca
    // chega ao botão de baixo. Soltamos a captura e perguntamos ao documento
    // qual item está sob o ponteiro.
    caixa.addEventListener('pointerup', function (ev) {
      var foiArraste = moveu > 8;
      soltar(ev);
      if (foiArraste) return;

      var alvo = document.elementFromPoint(ev.clientX, ev.clientY);
      var item = alvo && alvo.closest ? alvo.closest('[data-foto]') : null;
      if (item) abrirLightbox(parseInt(item.getAttribute('data-foto'), 10));
    });
    caixa.addEventListener('pointercancel', soltar);

    // Roda do mouse e trackpad também percorrem o plano
    caixa.addEventListener('wheel', function (ev) {
      ev.preventDefault();
      x -= ev.deltaX; y -= ev.deltaY;
      posicionar();
    }, { passive: false });

    if (document.readyState === 'complete') medir();
    else window.addEventListener('load', medir, { once: true });
    medir();
    window.addEventListener('resize', medir);
  }

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxMidia = document.getElementById('lightbox-midia');
  var lightboxLegenda = document.getElementById('lightbox-legenda');
  var focoAnterior = null;

  function abrirLightbox(indice) {
    var lista = window.ACERVO._galeriaAtual || [];
    var item = lista[indice];
    if (!item) return;

    focoAnterior = document.activeElement;

    // No lightbox o vídeo ganha controles e som — no card ele é só miniatura.
    if (item.src && u.ehVideo(item.src)) {
      lightboxMidia.innerHTML =
        '<video src="' + u.esc(item.src) + '" controls autoplay playsinline ' +
        'aria-label="' + u.esc(item.legenda || 'Vídeo do acervo') + '" data-fallback="🎬"></video>';
    } else if (item.src) {
      lightboxMidia.innerHTML =
        '<img src="' + u.esc(item.src) + '" alt="' + u.esc(item.legenda || '') + '" data-fallback="📷">';
    } else {
      lightboxMidia.innerHTML = '<div class="foto__ausente"><span>📷</span>arquivo ainda não subiu</div>';
    }

    var quem = (item.aparecem || []).map(function (id) { return u.pessoa(id).nome; }).join(', ');
    lightboxLegenda.innerHTML = u.esc(item.legenda || '') +
      '<br><small>' + u.esc(u.dataLegivel(item.data)) +
      (quem ? ' · ' + u.esc(quem) : '') +
      (item.creditos ? ' · registro de ' + u.esc(u.pessoa(item.creditos).nome) : '') + '</small>';

    u.tratarImagens(lightbox);
    lightbox.hidden = false;
    document.getElementById('lightbox-fechar').focus();
  }

  function fecharLightbox() {
    lightbox.hidden = true;
    lightboxMidia.innerHTML = '';
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
  }

  function iniciarLightbox() {
    document.getElementById('lightbox-fechar').addEventListener('click', fecharLightbox);
    lightbox.addEventListener('click', function (ev) {
      if (ev.target === lightbox) fecharLightbox();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !lightbox.hidden) fecharLightbox();
    });
  }

  /* ---------------- Easter egg: modo caos total ---------------- */
  function iniciarKonami() {
    var sequencia = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                     'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var posicao = 0;

    document.addEventListener('keydown', function (ev) {
      var tecla = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
      if (tecla === sequencia[posicao]) {
        posicao++;
        if (posicao === sequencia.length) {
          posicao = 0;
          document.documentElement.classList.toggle('caos-total');
          u.confete(['🤡', '🔥', '💀', '🎺', '🙈']);
        }
      } else {
        posicao = (tecla === sequencia[0]) ? 1 : 0;
      }
    });
  }

  /* ---------------- Início ---------------- */
  function iniciar() {
    iniciarTema();
    iniciarCabecalho();
    iniciarLightbox();
    iniciarKonami();
    if (window.ACERVO.editor) window.ACERVO.editor.iniciar();

    window.addEventListener('hashchange', function () {
      renderizar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    renderizar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
