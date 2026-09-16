(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector('#form-status');
  let sending = false;
  button.disabled = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('website')) return;
    sending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.dataset.state = 'pending';
    status.textContent = 'Sending your enquiry…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      // Existing public EmailJS identifiers; no private credentials belong here.
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({
          service_id: 'service_0c5w9cj', template_id: 'template_yeeife1', user_id: 'mjvU9i_2LyyusUOXo',
          template_params: {
            from_name: String(data.get('name')).trim(), from_email: String(data.get('email')).trim(),
            phone: String(data.get('phone')).trim(), message: String(data.get('message')).trim(),
            to_email: 'partridgewoodprojects@gmail.com'
          }
        })
      });
      if (!response.ok) throw new Error('Email provider rejected the request');
      status.dataset.state = 'success';
      status.textContent = 'Thank you! Your enquiry has been sent to Partridgewood Projects.';
      form.reset();
      window.trackEnquiry?.('generate_lead', 'contact_form');
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'We couldn’t confirm your enquiry was sent. Your details are still here. Please try again, call 061 428 4712, or use the email or WhatsApp links.';
    } finally {
      clearTimeout(timer);
      sending = false;
      button.disabled = false;
      button.textContent = 'Send enquiry';
      status.focus();
    }
  });
})();
