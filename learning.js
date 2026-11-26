(() => {
  'use strict';
  let currentButton;
  let card;
  const definitions = fetch('vocabulary.json').then(response => {
    if (!response.ok) throw new Error('Vocabulary unavailable');
    return response.json();
  });
  let request = 0;
  function close() {
    request += 1;
    if (currentButton) currentButton.setAttribute('aria-expanded', 'false');
    if (card) card.remove();
    currentButton = null;
    card = null;
  }
  document.addEventListener('click', async event => {
    const button = event.target.closest('.vocab-word');
    if (!button) return;
    const same = button === currentButton;
    close();
    if (same) return;
    currentButton = button;
    const token = request;
    try {
      const words = await definitions;
      if (token !== request) return;
      const entry = button.dataset.ko && button.dataset.definition
        ? {ko: button.dataset.ko, definition: button.dataset.definition}
        : words[button.dataset.word];
      if (!entry) return;
      card = document.createElement('span');
      card.className = 'vocabulary-card';
      card.setAttribute('role', 'note');
      const title = document.createElement('strong');
      title.textContent = button.textContent + ' · ' + entry.ko;
      const definition = document.createElement('span');
      definition.textContent = entry.definition;
      const dismiss = document.createElement('button');
      dismiss.textContent = '닫기';
      dismiss.type = 'button';
      dismiss.addEventListener('click', close);
      card.append(title, definition, dismiss);
      button.closest('.sentence').after(card);
      button.setAttribute('aria-expanded', 'true');
    } catch {
      close();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
})();
