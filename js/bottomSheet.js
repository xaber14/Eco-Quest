/* ============================================================
   EcoQuest — Bottom Sheet controller
   Opens when a mission card is clicked, fills in mission detail,
   closes on overlay click or close button.
   ============================================================ */

// Detail konten per misi (instruksi & contoh).
// Key = nomor misi pada card.
const MISSION_DETAILS = {
  1: {
    title: "Pilah Sampah",
    instruksi: "Buanglah sampah pada tempat sampah yang sudah disediakan disekitar area KG. Dan jangan lupa pisahkan sampah tertentu sesuai dengan keterangannya.",
    contoh: ["🗑️", "♻️", "🌿"]
  },
  2: {
    title: "Save Energy",
    instruksi: "Matikan lampu dan peralatan elektronik setelah selesai menggunakan ruang meeting untuk menghemat energi.",
    contoh: ["💡", "🔌", "🌱"]
  },
  3: {
    title: "No Gorengan",
    instruksi: "Pilih makanan sehat tanpa gorengan hari ini. Konsumsi makanan yang dikukus, direbus, atau dipanggang.",
    contoh: ["🥗", "🥦", "🍎"]
  },
  4: {
    title: "Running at GBK",
    instruksi: "Lari di kawasan GBK dan bagikan afirmasi positifmu. Ajak teman untuk hidup lebih sehat dan aktif.",
    contoh: ["🏃", "🏟️", "💪"]
  },
  5: {
    title: "Bike to Work",
    instruksi: "Kurangi polusi dengan bersepeda ke kantor. Hemat bahan bakar dan jaga lingkungan tetap bersih.",
    contoh: ["🚲", "🌍", "🛣️"]
  }
};

function initBottomSheet() {
  const overlay   = document.getElementById('sheetOverlay');
  const sheet     = document.getElementById('bottomSheet');
  const closeBtn  = document.getElementById('sheetClose');
  const titleEl   = document.getElementById('sheetTitle');
  const instrEl   = document.getElementById('sheetInstruksi');
  const examplesEl = document.getElementById('sheetExamples');
  if (!overlay || !sheet) return;

  function openSheet(missionId) {
    const data = MISSION_DETAILS[missionId];
    if (!data) return;

    titleEl.textContent = data.title;
    instrEl.textContent = data.instruksi;
    examplesEl.innerHTML = data.contoh
      .map(e => `<div class="sheet-example">${e}</div>`)
      .join('');

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';   // lock background scroll
  }

  function closeSheet() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Open on mission card click (ignore drag interactions)
  document.querySelectorAll('.mission-card').forEach(card => {
    let downX = 0;
    card.addEventListener('mousedown', (e) => { downX = e.pageX; });
    card.addEventListener('click', (e) => {
      // jika user men-drag (geser > 6px) jangan buka sheet
      if (Math.abs(e.pageX - downX) > 6) return;
      openSheet(card.dataset.mission);
    });
  });

  // Close: overlay click (tapi bukan saat klik di dalam sheet)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSheet();
  });

  // Close: tombol X
  closeBtn.addEventListener('click', closeSheet);

  // Close: tekan Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  // Close: swipe-down pada handle
  const handle = document.getElementById('sheetHandle');
  if (handle) {
    let startY = null;
    handle.addEventListener('mousedown', (e) => { startY = e.clientY; });
    window.addEventListener('mouseup', (e) => {
      if (startY !== null && e.clientY - startY > 40) closeSheet();
      startY = null;
    });
    handle.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, { passive: true });
    handle.addEventListener('touchend', (e) => {
      if (startY !== null && e.changedTouches[0].clientY - startY > 40) closeSheet();
      startY = null;
    });
  }
}
