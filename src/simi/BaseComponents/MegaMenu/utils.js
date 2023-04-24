const CATEGORY_IDX = 'category-node-';

export const buildTree = (items, rootCategoryUid, fullMap) => {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  const map = new Map(items.map(_item => [_item.uid, { ..._item }]));

  for (const item of map.values()) {
    if (!map.has(item.parent_uid)) {
      continue;
    }

    const parent = map.get(item.parent_uid);
    parent.subCategories = [...(parent.subCategories || []), item];
  }

  if (fullMap) {
    return map;
  }

  return Array.from(map.values()).filter(
    ({ parent_uid }) => rootCategoryUid === parent_uid
  );
};

export const hexToRgb = hex => {
  if (!hex || !hex.toString().startsWith('#')) {
    return hex;
  }

  return hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16))
    .join(' ');
};

const parseCategoryId = id => {
  if (!id || !id.toString().startsWith(CATEGORY_IDX)) {
    return Number(id);
  }

  return Number(id.toString().replace(CATEGORY_IDX, ''));
};

export const mapItems = items =>
  items.map(item => ({
    ...item,
    id: parseCategoryId(item.id),
    parent_id: parseCategoryId(item.parent_id),
    parentId: parseCategoryId(item.parent_id)
  }));

export const mapConfig = config => {
  for (const key in config) {
    if (key.includes('color')) {
      config[key] = hexToRgb(config[key]);
    }
  }

  return config;
};

const STATUSES = {
  DISABLED: 0,
  BOTH: 1,
  DESKTOP_ONLY: 2,
  MOBILE_ONLY: 3
};

export const isEnableMenuItem = (status, isMobile) => {
  if (STATUSES.DISABLED === status) {
    return false;
  } else if (isMobile) {
    return [STATUSES.MOBILE_ONLY, STATUSES.BOTH, null].includes(status);
  } else {
    return [STATUSES.DESKTOP_ONLY, STATUSES.BOTH, null].includes(status);
  }
};

export const getOutsideViewportTransformValue = (ref, checkLeft) => {
  if (!ref || !ref.current) {
    return null;
  }

  const el = ref.current || {};

  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  el.style.display = 'block';

  const rect = el.getBoundingClientRect();

  el.style.display = null;
  el.style.position = null;
  el.style.visibility = null;

  const itemHeight = 40;
  const scrollBarWidth = 20;

  const windowsHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const outsideBottom = windowsHeight - rect.bottom;

  const windowsWidth =
    window.innerWidth || document.documentElement.clientWidth;
  const outsideRight = windowsWidth - rect.right;

  return {
    left: checkLeft && outsideRight < 0 ? outsideRight - scrollBarWidth : null,
    top: !checkLeft && outsideBottom < 0 ? outsideBottom + +itemHeight : null
  };
};
