/* ============================================================
   EcoQuest — Mission Page renderer
   ============================================================ */

let countdownTimer = null;

function initMisiPage() {
  EQ.checkWeeklyReset();
  renderMisiPage();
  startCountdown();
}

/* ── Render semua elemen misi ── */
function renderMisiPage() {
  const state = EQ.load();
  const stats = EQ.missionStats(state);

  // counter
  document.getElementById('misiSelesai').textContent  = stats.done;
  document.getElementById('misiTersisa').textContent  = stats.remaining;

  // render tiap card
  state.missions.forEach(m => renderMissionCard(m));
}

function renderMissionCard(mission) {
  const card = document.querySelector(`.mission-card[data-mission="${mission.id}"]`);
  if (!card) return;

  const isDone = mission.status === 'done';
  card.querySelector('.mc-done-overlay')?.remove();
  card.classList.toggle('is-done', isDone);

  if (isDone) {
    // badge "Selesai" biru absolut di kanan atas card
    const badge = document.createElement('div');
    badge.className = 'mc-done-overlay';
    badge.innerHTML = `
      <div class="mc-done-badge">
        <i class="ph ph-check-circle"></i>
        <span>Selesai</span>
      </div>`;
    card.appendChild(badge);
  }
}

/* ── Countdown sisa waktu ── */
function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);

  function tick() {
    const { msLeft, friday, pct } = EQ.getPeriodInfo();
    const el  = document.getElementById('sisaWaktuVal');
    const bar = document.getElementById('sisaWaktuBar');
    const sub = document.getElementById('sisaWaktuSub');

    // Bar: mulai full (100%) lalu mengecil ke kiri seiring waktu habis
    const barPct = (1 - pct) * 100;
    if (bar) {
      // transisi linear 1 detik → bar mengalir mulus antar tiap update detik
      bar.style.transition = 'width 1s linear';
      bar.style.width = barPct + '%';
    }

    if (el) el.innerHTML = formatCountdownWithSeconds(msLeft);
    if (sub) {
      sub.innerHTML = `Akan berakhir pada <strong>${EQ.formatDate(friday)}</strong>, pukul <strong>23:59 WIB</strong>`;
    }
  }

  tick();
  countdownTimer = setInterval(tick, 1000);
}

/* ── Dipanggil setelah submit foto berhasil ── */
function onMissionSubmitted(missionId) {
  const { state, mission, levelUp, alreadyDone } = EQ.completeMission(missionId);
  if (alreadyDone) return;

  // update card
  renderMissionCard(mission);

  // update counter
  const stats = EQ.missionStats(state);
  document.getElementById('misiSelesai').textContent = stats.done;
  document.getElementById('misiTersisa').textContent = stats.remaining;

  // update estimasi bonus time
  updateTimeBonus(state);

  // kalau level up → tampilkan notif
  if (levelUp) showLevelUpToast(state.user.level);
}

/* ── Format countdown: angka di atas, satuan di bawah ── */
function formatCountdownWithSeconds(ms) {
  const totalSec = Math.max(Math.floor(ms / 1000), 0);
  const hours   = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const seg = (num, unit) => `
    <span class="cd-seg">
      <span class="cd-num">${String(num).padStart(2, '0')}</span>
      <span class="cd-unit">${unit}</span>
    </span>`;

  // selalu tampilkan jam, menit, detik
  return seg(hours, 'Jam') + seg(minutes, 'Menit') + seg(seconds, 'Detik');
}

function updateTimeBonus(state) {
  const { msLeft } = EQ.getPeriodInfo();
  const hoursLeft = msLeft / 3_600_000;
  // Semakin cepat selesai, bonus lebih besar
  const bonus = hoursLeft > 30 ? 50 : hoursLeft > 15 ? 30 : hoursLeft > 5 ? 20 : 10;
  const el = document.getElementById('timeBonusVal');
  if (el) el.textContent = '+' + bonus + ' Pts';
}

/* ── Level up toast ── */
function showLevelUpToast(newLevel) {
  const toast = document.createElement('div');
  toast.className = 'levelup-toast';
  toast.innerHTML = `
    <i class="ph ph-star"></i>
    <div>
      <div class="toast-title">Level Up! 🎉</div>
      <div class="toast-sub">Selamat, kamu naik ke <strong>Lv.${newLevel}</strong></div>
    </div>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
