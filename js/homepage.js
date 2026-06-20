/* ============================================================
   EcoQuest — Homepage UI renderer
   ============================================================ */

function initHomepage() {
  renderHomepage();
}

function renderHomepage() {
  const state = EQ.checkWeeklyReset();
  const { current, needed, pct } = EQ.expProgress(state);
  const stats = EQ.missionStats(state);

  // ── Bio ──
  document.getElementById('hpName').textContent  = state.user.name;
  document.getElementById('hpRank').textContent  = state.user.rank;
  document.getElementById('hpLevel').textContent = 'Lv.' + state.user.level;

  // ── EXP bar ──
  document.getElementById('hpExp').textContent  = current + ' EXP';
  document.getElementById('hpExpNext').innerHTML = `<strong>${needed}</strong> exp untuk naik level`;
  const bar = document.getElementById('hpExpBar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(() => {
    bar.style.transition = 'width 1s ease';
    bar.style.width = (pct * 100) + '%';
  });

  // ── Poin ──
  document.getElementById('hpPoinMinggu').textContent = state.user.poinMinggu + ' pts';
  document.getElementById('hpPoinTotal').textContent  = state.user.poinTotal;

  // ── Misi counts ──
  document.getElementById('hpMisiSelesai').textContent = stats.done + ' Selesai';
  document.getElementById('hpMisiBelum').textContent   = stats.remaining + ' Belum';

  // ── Step circles ──
  state.missions.forEach((m, i) => {
    const el = document.getElementById('hpStep' + (i + 1));
    if (!el) return;
    if (m.status === 'done') {
      el.style.background = 'var(--color-primary)';
      el.style.color = '#fff';
    } else {
      el.style.background = 'var(--color-surface)';
      el.style.color = 'var(--color-text-primary)';
    }
  });
}
