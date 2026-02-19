(function chooseLang() {
  function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || '';
  }

  function altUrl(hreflang) {
    const link = document.querySelector('link[rel="alternate"][hreflang="' + hreflang + '"]');
    return link?.href || '';
  }

  const picker = document.getElementById('lang-picker');
  const btnFR = document.getElementById('pick-fr');
  const btnNL = document.getElementById('pick-nl');
  const btnClose = document.getElementById('pick-close');

  const urlFR = altUrl('fr') || (location.origin + location.pathname.replace(/^\/nl(\/|$)/, '/'));
  const urlNL = altUrl('nl') || (location.origin + '/nl' + (location.pathname === '/' ? '' : location.pathname));

  // S'assure que les liens pointent vers les équivalents de la page courante
  btnFR.href = urlFR;
  btnNL.href = urlNL;

  const pref = decodeURIComponent(getCookie('site_lang') || '');
  const onNL = location.pathname === '/nl' || location.pathname.startsWith('/nl/');

  // Si préférence déjà connue, redirige silencieusement vers la bonne version
  if (pref === 'nl' && !onNL && urlNL) {
    location.replace(urlNL + location.search + location.hash);
    return;
  }
  if (pref === 'fr' && onNL && urlFR) {
    location.replace(urlFR + location.search + location.hash);
    return;
  }

  // Sinon, affiche le picker (1ère visite)
  if (!pref) {
    picker.hidden = false;

    // Enregistre la préférence au clic (1 an)
    btnFR.addEventListener('click', function() { setCookie('site_lang', 'fr', 2592000); });
    btnNL.addEventListener('click', function() { setCookie('site_lang', 'nl', 2592000); });

    // Permet de fermer pour ne pas bloquer l'accès au contenu
    btnClose.addEventListener('click', function() { picker.hidden = true; });
  }
})();

function setCookie(name, value, maxAgeSeconds) {
document.cookie = name + '=' + value + '; Path=/; Max-Age=' + maxAgeSeconds + '; SameSite=Lax';
}

// Language switcher in the nav
document.querySelectorAll('.langSwitch a').forEach(el => {
    el.addEventListener('click', function(e) {
    e.preventDefault();
    const lang = el.dataset.lang;
    if (!lang) return;
    setCookie('site_lang', lang, 31536000);
    window.location.href = el.href; // go to the new language page
    });
});