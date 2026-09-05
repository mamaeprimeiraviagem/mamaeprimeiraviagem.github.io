(() => {
  const key = 'mpv_cookie_consent_v1';
  const readChoice = () => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const saveChoice = (value) => {
    try { localStorage.setItem(key, value); } catch (_) {}
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

  const accepted = readChoice() === 'accepted';
  gtag('consent', 'default', {
    analytics_storage: accepted ? 'granted' : 'denied',
    ad_storage: accepted ? 'granted' : 'denied',
    ad_user_data: accepted ? 'granted' : 'denied',
    ad_personalization: accepted ? 'granted' : 'denied',
    wait_for_update: 500
  });

  window.siteConsentAnalyticsGranted = () => readChoice() === 'accepted';

  function update(value) {
    saveChoice(value);
    const granted = value === 'accepted' ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: granted,
      ad_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted
    });
    document.getElementById('cookie-consent')?.remove();
    if (value === 'accepted') location.reload();
  }

  function renderBanner() {
    if (readChoice()) return;
    const banner = document.createElement('section');
    banner.id = 'cookie-consent';
    banner.className = 'cookie-consent';
    banner.setAttribute('aria-label', 'Preferências de privacidade');
    banner.innerHTML = '<p><strong>Sua privacidade importa.</strong> Usamos cookies opcionais para medir visitas e melhorar o conteúdo. Você pode aceitar ou continuar apenas com os cookies essenciais. <a href="/privacidade.html">Saiba mais</a>.</p><div><button type="button" data-choice="denied">Somente essenciais</button><button type="button" class="cookie-accept" data-choice="accepted">Aceitar</button></div>';
    banner.addEventListener('click', (event) => {
      const choice = event.target.closest('[data-choice]')?.dataset.choice;
      if (choice) update(choice);
    });
    document.body.appendChild(banner);
  }

  function trackMetaViewContent() {
    if (!/^\/(?:artigos\/[^/]+|guia-[^/]+|ofertas-para-mamaes|kit-mae-organizada)[.]html$/.test(location.pathname) ||
        window.__metaViewContentSent || typeof window.fbq !== 'function') return;
    window.__metaViewContentSent = true;
    window.fbq('track', 'ViewContent');
  }

  function start() {
    renderBanner();
    trackMetaViewContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();