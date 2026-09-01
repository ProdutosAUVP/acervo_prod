/* =========================================================================
   UTILITÁRIOS
   Funções pequenas usadas pelo resto do site. Normalmente você não precisa
   mexer aqui para adicionar conteúdo — para isso, vá na pasta /data.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.utils = (function () {
  'use strict';

  /* --- Segurança: escapa texto antes de jogar no HTML --- */
  function esc(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* --- Datas --- */
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
               'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  function dataLegivel(iso) {
    if (!iso) return 'data desconhecida';
    var partes = String(iso).split('-');
    if (partes.length < 3) return iso;
    var dia = parseInt(partes[2], 10);
    var mes = parseInt(partes[1], 10) - 1;
    if (isNaN(dia) || isNaN(mes) || !MESES[mes]) return iso;
    return dia + ' de ' + MESES[mes] + ' de ' + partes[0];
  }

  function ordenarPorData(lista) {
    return lista.slice().sort(function (a, b) {
      return String(b.data || '').localeCompare(String(a.data || ''));
    });
  }

  /* --- Pessoas --- */
  function pessoa(id) {
    var time = window.ACERVO.time || [];
    for (var i = 0; i < time.length; i++) {
      if (time[i].id === id) return time[i];
    }
    // Pessoa citada em algum conteúdo mas que não está em data/time.js
    return { id: id, nome: id || 'Anônimo', cargo: '', bio: '', emoji: '👤', foto: '' };
  }

  // Cor de cada pessoa: sai da paleta categórica do Design System pela
  // posição em data/time.js, então ninguém precisa escolher cor na mão.
  // Para fixar uma, basta pôr `acento: 1..8` no cadastro da pessoa.
  function acento(p) {
    if (p && p.acento) return 'acento-' + (((parseInt(p.acento, 10) - 1) % 8) + 1);
    var time = window.ACERVO.time || [];
    for (var i = 0; i < time.length; i++) {
      if (p && time[i].id === p.id) return 'acento-' + ((i % 8) + 1);
    }
    return 'acento-8';
  }

  function avatar(p, grande) {
    var classe = 'avatar ' + acento(p) + (grande ? ' avatar--grande' : '');
    if (p.foto) {
      return '<span class="' + classe + '">' +
             '<img src="' + esc(p.foto) + '" alt="Foto de ' + esc(p.nome) + '" ' +
             'loading="lazy" data-fallback="' + esc(p.emoji || '👤') + '">' +
             '</span>';
    }
    return '<span class="' + classe + '" aria-hidden="true">' + esc(p.emoji || '👤') + '</span>';
  }

  function linkPessoa(id) {
    var p = pessoa(id);
    return '<a class="selo selo--acento ' + acento(p) + '" href="#/time/' + esc(p.id) + '">' +
           esc(p.emoji || '👤') + ' ' + esc(p.nome) + '</a>';
  }

  /* --- Mídia --- */
  // A galeria aceita imagem e vídeo; o tipo sai da extensão do arquivo.
  function ehVideo(src) {
    return /\.(mp4|webm|ogv|ogg|mov|m4v)$/i.test(String(src || ''));
  }

  /* --- Diversos --- */
  function pimenta(nota) {
    var n = Math.max(0, Math.min(5, parseInt(nota, 10) || 0));
    return new Array(n + 1).join('🌶️');
  }

  function plural(n, singular, pluralForma) {
    return n + ' ' + (n === 1 ? singular : pluralForma);
  }

  // Escolhe um item de forma estável para o dia de hoje: todo mundo do time
  // vê a mesma "frase do dia" no mesmo dia.
  function doDia(lista) {
    if (!lista.length) return null;
    var hoje = new Date();
    var semente = hoje.getFullYear() * 372 + hoje.getMonth() * 31 + hoje.getDate();
    return lista[semente % lista.length];
  }

  function aleatorio(lista) {
    if (!lista.length) return null;
    return lista[Math.floor(Math.random() * lista.length)];
  }

  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /* --- Estado vazio padrão --- */
  function vazio(mensagem, dica) {
    return '<div class="vazio">' +
           '<strong>' + esc(mensagem || (window.ACERVO.config || {}).vazio || 'Nada aqui ainda.') + '</strong>' +
           (dica ? '<p>' + esc(dica) + '</p>' : '') +
           '</div>';
  }

  /* --- Confete (usado nos botões cômicos) --- */
  function confete(emojis) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var lista = emojis || ['🎉', '🎊', '✨', '🏆', '😂', '🔥'];
    for (var i = 0; i < 22; i++) {
      (function (indice) {
        var el = document.createElement('span');
        el.className = 'confete';
        el.textContent = lista[Math.floor(Math.random() * lista.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
        el.style.animationDelay = (indice * 0.03) + 's';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 3600);
      })(i);
    }
  }

  /* --- Troca imagens quebradas por um placeholder simpático ---
     Numa foto da galeria vale explicar qual arquivo falta; num avatar ou
     num chip, o card de aviso destruiria o componente — ali entra só o
     emoji de reserva no lugar da imagem. */
  function tratarImagens(raiz) {
    var imgs = (raiz || document).querySelectorAll('img[data-fallback], video[data-fallback]');
    Array.prototype.forEach.call(imgs, function (img) {
      img.addEventListener('error', function () {
        var pai = img.parentNode;
        if (!pai) return;
        var emoji = img.getAttribute('data-fallback') || '📷';
        var ehGaleria = pai.classList.contains('foto__midia') || pai.id === 'lightbox-midia';
        // Um vídeo quebrado deixa o distintivo de play órfão; ele sai junto.
        var play = pai.querySelector && pai.querySelector('.foto__play');
        if (play) play.remove();

        if (ehGaleria) {
          var caminho = esc(img.getAttribute('src') || '');
          // Imagem que falha quase sempre é arquivo que não subiu. Vídeo pode
          // ser isso ou um navegador sem o codec — a mensagem não afirma a
          // causa errada, e o link deixa o arquivo acessível de qualquer jeito.
          var recado = img.tagName === 'VIDEO'
            ? 'não foi possível reproduzir este vídeo aqui<br>' +
              '<a href="' + caminho + '" target="_blank" rel="noopener">abrir o arquivo</a><br>'
            : 'imagem ainda não subiu<br>';
          pai.innerHTML = '<div class="foto__ausente"><span>' + esc(emoji) + '</span>' +
                          recado + '<code>' + caminho + '</code></div>';
        } else {
          var reserva = document.createElement('span');
          reserva.textContent = emoji;
          pai.replaceChild(reserva, img);
        }
      });
    });
  }

  return {
    esc: esc,
    dataLegivel: dataLegivel,
    ordenarPorData: ordenarPorData,
    pessoa: pessoa,
    acento: acento,
    avatar: avatar,
    linkPessoa: linkPessoa,
    pimenta: pimenta,
    plural: plural,
    doDia: doDia,
    aleatorio: aleatorio,
    normalizar: normalizar,
    ehVideo: ehVideo,
    vazio: vazio,
    confete: confete,
    tratarImagens: tratarImagens
  };
})();
