(() => {
  const agent = document.querySelector('.sales-agent');
  if (!agent) return;

  const root = agent.dataset.root;
  const toggle = agent.querySelector('.sales-agent-toggle');
  const panel = agent.querySelector('.sales-agent-panel');
  const close = agent.querySelector('.sales-agent-close');
  const messages = agent.querySelector('.sales-agent-messages');
  const options = agent.querySelector('.sales-agent-options');

  const track = (choice) => window.gtag?.('event', 'sales_agent_choice', { choice });
  const say = (text) => {
    const bubble = document.createElement('p');
    bubble.className = 'sales-agent-bubble';
    bubble.textContent = text;
    messages.replaceChildren(bubble);
  };
  const showChoices = (choices) => {
    options.replaceChildren(...choices.map(({ label, action }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', action);
      return button;
    }));
  };
  const recommend = (choice, text, links) => {
    track(choice);
    say(text);
    showChoices([
      ...links.map(({ label, href, affiliate }) => ({
        label,
        action: () => {
          window.gtag?.('event', 'sales_agent_recommendation_click', { choice, affiliate: !!affiliate });
          window.location.href = /^https?:/.test(href) ? href : root + href;
        },
      })),
      { label: '← Ver outras opções', action: start },
    ]);
  };
  const courseQuestions = () => {
    track('course_questions');
    say('Claro! Quero que você decida com segurança. Qual destas dúvidas posso esclarecer?');
    showChoices([
      { label: 'O que eu recebo?', action: () => recommend(
        'course_contents',
        'Você recebe o Kit Mãe Organizada em PDF, com 27 páginas de checklists e planejadores, mais 7 videoaulas curtas mostrando como usar o material no seu ritmo.',
        [{ label: 'Ver todos os detalhes', href: 'kit-mae-organizada.html' }],
      ) },
      { label: 'Quanto custa e como funciona o acesso?', action: () => recommend(
        'course_price',
        'É um pagamento único de R$ 97 — não é assinatura. O acesso é imediato pela Hotmart, sem prazo de expiração, e funciona no celular, tablet ou computador.',
        [{ label: 'Quero o curso por R$ 97', href: 'https://pay.hotmart.com/B107015298G' }],
      ) },
      { label: 'Como sei se é para mim?', action: () => recommend(
        'course_fit',
        'Ele foi pensado para gestantes e famílias que querem organizar enxoval, consultas, orçamento, mala da maternidade, rede de apoio e primeiras semanas sem depender de listas espalhadas. É um material educativo e organizacional; não substitui pré-natal ou pediatria.',
        [{ label: 'Conhecer o conteúdo completo', href: 'kit-mae-organizada.html' }],
      ) },
      { label: 'E se eu não gostar?', action: () => recommend(
        'course_guarantee',
        'Você tem garantia legal de 7 dias. Se perceber que o curso não combina com o que precisa, pode solicitar o reembolso total dentro desse prazo.',
        [{ label: 'Comprar com garantia de 7 dias', href: 'https://pay.hotmart.com/B107015298G' }],
      ) },
      { label: '← Voltar ao início', action: start },
    ]);
  };
  function start() {
    say('Olá! Que alegria receber você por aqui. 💗 Em que posso ajudar hoje?');
    showChoices([
      { label: 'Quero me organizar para a maternidade', action: () => recommend(
        'curso',
        'Que escolha especial! O Curso Mãe Organizada reúne orientações e materiais práticos para trazer mais segurança à sua rotina. Veja com calma e só escolha se fizer sentido para você.',
        [{ label: 'Conhecer o Curso Mãe Organizada', href: 'kit-mae-organizada.html' }],
      ) },
      { label: 'Tenho dúvidas antes de comprar o curso', action: courseQuestions },
      { label: 'Estou montando o enxoval', action: () => recommend(
        'enxoval',
        'Vamos simplificar essa etapa? Separei um guia gratuito e uma seleção de ofertas para ajudar você a comprar apenas o necessário.',
        [
          { label: 'Ver o guia de enxoval', href: 'artigos/enxoval-completo-bebe.html' },
          { label: 'Ver ofertas selecionadas', href: 'ofertas-para-mamaes.html', affiliate: true },
        ],
      ) },
      { label: 'Quero economizar nas compras', action: () => recommend(
        'ofertas',
        'Claro! Nossa página de ofertas reúne opções úteis para comparar com tranquilidade. Alguns links são afiliados, mas o preço não aumenta para você.',
        [{ label: 'Ver ofertas para mamães', href: 'ofertas-para-mamaes.html', affiliate: true }],
      ) },
      { label: 'Procuro informação sobre gravidez ou bebê', action: () => recommend(
        'conteudo',
        'Você é muito bem-vinda. Nossos conteúdos são educativos e não substituem o acompanhamento de profissionais de saúde. Escolha um tema para começar.',
        [
          { label: 'Ler artigos gratuitos', href: 'index.html#artigos' },
          { label: 'Falar pela página de contato', href: 'contato.html' },
        ],
      ) },
    ]);
  }
  const open = () => {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    close.focus();
    track('open');
  };
  const hide = () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  };

  toggle.addEventListener('click', () => panel.hidden ? open() : hide());
  close.addEventListener('click', hide);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) hide(); });
  start();
})();
