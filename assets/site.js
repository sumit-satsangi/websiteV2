// W10 EDITING GUIDE: This small browser script powers search boxes, tag buttons, and Year/Month archive visibility.
// W10 TIP: Content belongs in YAML; change this file only when filter behavior needs to change.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const chips = group.querySelectorAll('[data-tag-filter]');
    const scope = group.getAttribute('data-filter-group');
    const input = document.querySelector(`[data-search-input="${scope}"]`);
    const results = document.querySelector(`[data-results="${scope}"]`);
    if (!results) return;
    let selected = 'All';
    const apply = () => {
      const query = (input?.value || '').trim().toLowerCase();
      results.querySelectorAll('[data-search]').forEach((card) => {
        const haystack = (card.getAttribute('data-search') || '').toLowerCase();
        const tags = (card.getAttribute('data-tags') || '').split('|');
        card.hidden = Boolean((query && !haystack.includes(query)) || (selected !== 'All' && !tags.includes(selected)));
      });
      results.querySelectorAll('.archive-month').forEach((month) => {
        month.hidden = !Array.from(month.querySelectorAll('[data-search]')).some((card) => !card.hidden);
      });
      results.querySelectorAll('.archive-year').forEach((year) => {
        year.hidden = !Array.from(year.querySelectorAll('[data-search]')).some((card) => !card.hidden);
      });
    };
    chips.forEach((chip) => chip.addEventListener('click', () => {
      selected = chip.getAttribute('data-tag-filter') || 'All';
      chips.forEach((item) => item.classList.toggle('is-active', item === chip));
      apply();
    }));
    input?.addEventListener('input', apply);
  });
});
