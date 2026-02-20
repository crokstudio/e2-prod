const gallery = document.querySelector('.grid-layout__gallery');

if (gallery) {
  const filters = Array.from(document.querySelectorAll('input[name="projects-filter"]'));
  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const items = Array.from(gallery.querySelectorAll('.gallery-item'));

  const MAX_COLUMNS = 3;
  const SLOT_PATTERN = [
    'horizontalBig',
    'horizontalSmall',
    'vertical',
    'vertical',
    'horizontalSmall',
    'horizontalBig',
    'horizontalSmall',
    'vertical',
    'horizontalSmall',
    'vertical',
    'horizontalSmall',
  ];

  const TYPE_TO_SPAN = {
    horizontalBig: { w: 2, h: 2 },
    horizontalSmall: { w: 1, h: 1 },
    vertical: { w: 1, h: 2 },
  };

  function normalizeType(rawType) {
    if (rawType === 'horizontalBig' || rawType === 'vertical') {
      return rawType;
    }
    return 'horizontalSmall';
  }

  function clearPlacement(item) {
    item.style.gridColumn = '';
    item.style.gridRow = '';
  }

  function isVisible(item) {
    return window.getComputedStyle(item).display !== 'none';
  }

  function canPlace(occupied, row, col, w, h) {
    for (let y = row; y < row + h; y++) {
      for (let x = col; x < col + w; x++) {
        if (occupied.has(`${y}:${x}`)) {
          return false;
        }
      }
    }
    return true;
  }

  function reserve(occupied, row, col, w, h) {
    for (let y = row; y < row + h; y++) {
      for (let x = col; x < col + w; x++) {
        occupied.add(`${y}:${x}`);
      }
    }
  }

  function getNextSlot(occupied, w, h) {
    let row = 1;
    while (true) {
      for (let col = 1; col <= MAX_COLUMNS - w + 1; col++) {
        if (canPlace(occupied, row, col, w, h)) {
          reserve(occupied, row, col, w, h);
          return { row, col, w, h };
        }
      }
      row += 1;
    }
  }

  function applySlotLayout() {
    items.forEach(clearPlacement);

    if (!desktopQuery.matches) {
      return;
    }

    const visibleItems = items.filter(isVisible);
    if (!visibleItems.length) {
      return;
    }

    const queues = {
      horizontalBig: [],
      horizontalSmall: [],
      vertical: [],
    };

    for (let i = 0; i < visibleItems.length; i++) {
      const item = visibleItems[i];
      const type = normalizeType(item.dataset.cardType);
      queues[type].push(item);
    }

    let remaining =
      queues.horizontalBig.length +
      queues.horizontalSmall.length +
      queues.vertical.length;

    const occupied = new Set();
    let slotIndex = 0;

    while (remaining > 0) {
      const slotType = SLOT_PATTERN[slotIndex % SLOT_PATTERN.length];
      const { w, h } = TYPE_TO_SPAN[slotType];
      const slot = getNextSlot(occupied, w, h);
      const queue = queues[slotType];

      if (queue.length) {
        const item = queue.shift();
        item.style.gridColumn = `${slot.col} / span ${slot.w}`;
        item.style.gridRow = `${slot.row} / span ${slot.h}`;
        remaining -= 1;
      }

      slotIndex += 1;
    }
  }

  function scheduleLayout() {
    window.requestAnimationFrame(applySlotLayout);
  }

  for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener('change', scheduleLayout);
  }

  window.addEventListener('resize', scheduleLayout);

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', scheduleLayout);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(scheduleLayout);
  }

  scheduleLayout();
}
