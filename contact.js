/* ========================================
   MORGUE V3 — Contact Page Logic
   ======================================== */

'use strict';

function initContact() {
  renderNav('CONTACT');

  const submitBtn  = document.getElementById('form-submit-btn');
  const resetBtn   = document.getElementById('form-reset-btn');
  const sentModal  = document.getElementById('sent-modal');
  const closeModal = document.getElementById('sent-modal-close');

  // ---- SUBMIT ----
  submitBtn.addEventListener('click', () => {
    const email   = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const cat     = document.getElementById('form-category').value;
    const msg     = document.getElementById('form-message').value.trim();

    if (!email || !email.includes('@')) {
      showToast('ENTER A VALID EMAIL ADDRESS', 'error');
      return;
    }
    if (!msg) {
      showToast('MESSAGE CANNOT BE EMPTY', 'error');
      return;
    }

    // Build a mailto: link as the "backend" simulation
    const finalSubject = subject || (cat ? `MGV3 | ${cat.toUpperCase()} INQUIRY` : 'MGV3 | GENERAL INQUIRY');
    const body = encodeURIComponent(`From: ${email}\n\n${msg}\n\n---\nSent via MORGUE V3 Contact Form`);
    const mailto = `mailto:x@proton.me?subject=${encodeURIComponent(finalSubject)}&body=${body}`;

    // Simulate backend dispatch log
    simulateContactDispatch({ email, subject: finalSubject, category: cat, message: msg });

    // Open mail client as fallback
    window.location.href = mailto;

    // Show sent modal after short delay
    setTimeout(() => {
      sentModal.classList.add('active');
    }, 400);
  });

  // ---- RESET ----
  resetBtn.addEventListener('click', () => {
    document.getElementById('form-email').value    = '';
    document.getElementById('form-subject').value  = '';
    document.getElementById('form-category').value = '';
    document.getElementById('form-message').value  = '';
    showToast('FORM CLEARED');
  });

  // ---- CLOSE MODAL ----
  closeModal.addEventListener('click', () => {
    sentModal.classList.remove('active');
  });

  sentModal.addEventListener('click', (e) => {
    if (e.target === sentModal) sentModal.classList.remove('active');
  });
}

function simulateContactDispatch(data) {
  // Simulates a backend POST — logs locally for demo environment
  console.log('[MORGUE V3] Contact form dispatch simulated:', {
    to: 'x@proton.me',
    from: data.email,
    subject: data.subject,
    category: data.category,
    message: data.message,
    timestamp: new Date().toISOString()
  });

  const inbox = JSON.parse(sessionStorage.getItem('mgv3_contact_log') || '[]');
  inbox.push({ ...data, timestamp: new Date().toISOString() });
  sessionStorage.setItem('mgv3_contact_log', JSON.stringify(inbox));
}

document.addEventListener('DOMContentLoaded', initContact);
