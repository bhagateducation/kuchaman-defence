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

// Fluent Forms normally submits to WordPress. On a standalone Hostinger
// install, use the small PHP endpoint bundled with this static site instead.
const siteRoot = new URL('.', document.currentScript.src);
document.querySelectorAll('form[id="fluentform_5"]').forEach((form) => {
  const submit = form.querySelector('button[type="submit"]');
  const notice = document.createElement('div');
  notice.setAttribute('role', 'status');
  notice.style.cssText = 'margin-top:12px;font-size:14px;line-height:1.5;';
  submit?.insertAdjacentElement('afterend', notice);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const data = new FormData(form);
    const name = String(data.get('names_1[first_name]') || '').trim();
    const mobile = String(data.get('numeric_field') || '').trim();
    const course = String(data.get('department') || '').trim();
    if (!name || !/^[+()\d\s-]{8,18}$/.test(mobile) || !course) {
      notice.textContent = 'Please enter your name, a valid mobile number, and a course.';
      return;
    }

    const previewHost = /(^localhost$|^127\.0\.0\.1$|\.github\.io$|^raw\.githack\.com$)/i.test(location.hostname);
    if (previewHost) {
      notice.textContent = 'This preview cannot send enquiries. Please contact the academy by phone or WhatsApp.';
      return;
    }

    submit.disabled = true;
    notice.textContent = 'Sending your enquiry…';
    data.set('source_page', location.pathname);
    try {
      const response = await fetch(new URL('api/enquiry.php', siteRoot), {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || 'Could not send your enquiry.');
      notice.textContent = 'Thank you. Your enquiry has been sent to the academy.';
      form.reset();
    } catch (error) {
      notice.textContent = `${error.message} Please call or WhatsApp the academy instead.`;
    } finally {
      submit.disabled = false;
    }
  }, true);
});
