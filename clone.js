// The original Astra menu relies on WordPress' script loader. Keep its
// existing classes and markup so the static version has the same mobile menu.
document.querySelectorAll('.main-header-menu-toggle').forEach((button) => {
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    button.classList.toggle('toggled', open);
    document.body.classList.toggle('ast-main-header-nav-open', open);
  };

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  }, true);

  document.querySelectorAll('#ast-mobile-site-navigation a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
});
