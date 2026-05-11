/* ========================================
   MORGUE V3 — Specials Page Logic
   ======================================== */

'use strict';

const ROOM_ADDRESSES = {
  xmr: 'x_XMR_ADDRESS_PLACEHOLDER_REPLACE_LATER',
  btc: 'y_BTC_ADDRESS_PLACEHOLDER_REPLACE_LATER'
};

let selectedCoin = 'xmr';

function initSpecials() {
  renderNav('SPECIALS');

  // Open payment modal on room access click
  document.getElementById('room-access-btn').addEventListener('click', () => {
    document.getElementById('payment-modal').classList.add('active');
  });

  // Close payment modal
  document.getElementById('pay-modal-close').addEventListener('click', () => {
    document.getElementById('payment-modal').classList.remove('active');
  });
  document.getElementById('payment-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('payment-modal'))
      document.getElementById('payment-modal').classList.remove('active');
  });

  // Coin selector
  document.getElementById('coin-selector').addEventListener('click', (e) => {
    const btn = e.target.closest('.coin-btn');
    if (!btn) return;
    document.querySelectorAll('.coin-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCoin = btn.dataset.coin;
    updateAddressDisplay();
  });

  // Confirm payment submit
  document.getElementById('room-pay-confirm-btn').addEventListener('click', () => {
    const email = document.getElementById('room-email').value.trim();
    if (!email || !email.includes('@')) {
      showToast('PLEASE ENTER A VALID EMAIL', 'error');
      return;
    }
    // Close payment modal, open confirmation modal
    document.getElementById('payment-modal').classList.remove('active');
    setTimeout(() => {
      document.getElementById('confirm-modal').classList.add('active');
    }, 200);
  });

  // Close confirm modal
  document.getElementById('confirm-close-btn').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.remove('active');
  });

  // Thumbnail click also opens payment modal
  document.getElementById('room-thumbnail').addEventListener('click', () => {
    document.getElementById('payment-modal').classList.add('active');
  });

  updateAddressDisplay();
}

function updateAddressDisplay() {
  const el = document.getElementById('room-addr-display');
  if (el) {
    el.textContent = ROOM_ADDRESSES[selectedCoin];
    el.onclick = () => copyToClipboard(ROOM_ADDRESSES[selectedCoin]);
  }
}

document.addEventListener('DOMContentLoaded', initSpecials);
