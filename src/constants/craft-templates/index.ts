import hongPhongData from './hong-phong.json';
import thiepCuoi130PreData from './thiep-cuoi-130-pre.json';
import senNgayHyData from './sen-ngay-hy.json';
import henUocData from './hen-uoc.json';
import mocAmData from './moc-am.json';
import thiepCuoi132Data from './thiep-cuoi-132-premium.json';
import thiepCuoi131Data from './thiep-cuoi-131-basic.json';
import thiepCuoi129Data from './thiep-cuoi-129-pre.json';
import thiepCuoi128Data from './thiep-cuoi-128-pre.json';
import thiepCuoi127Data from './thiep-cuoi-127-pre.json';
import thiepCuoi126Data from './thiep-cuoi-126-pre.json';
import thiepCuoi125Data from './thiep-cuoi-125-pre.json';
import thiepCuoi124Data from './thiep-cuoi-124-pre.json';
import thiepCuoi123Data from './thiep-cuoi-123-pre.json';
import thiepCuoi122Data from './thiep-cuoi-122-pre.json';
import thiepCuoi121Data from './thiep-cuoi-121-pre.json';
import thiepCuoi120Data from './thiep-cuoi-120-pre.json';
import ourEternalChapterData from './our-eternal-chapter.json';
import thiepCuoi115Data from './thiep-cuoi-115-pre.json';
import thiepCuoi114Data from './thiep-cuoi-114-pre.json';

export interface CraftNode {
  type: {
    resolvedName: string;
  };
  isCanvas?: boolean;
  props: Record<string, any>;
  parent?: string;
  nodes?: string[];
  custom?: Record<string, any>;
}

export type CraftTree = Record<string, CraftNode>;

const CRAFT_REGISTRY: Record<string, CraftTree> = {
  'hong-phong': hongPhongData as unknown as CraftTree,
  'thiep-cuoi-130-pre': thiepCuoi130PreData as unknown as CraftTree,
  'thiep-cuoi-130': thiepCuoi130PreData as unknown as CraftTree,
  'sen-ngay-hy': senNgayHyData as unknown as CraftTree,
  'hen-uoc': henUocData as unknown as CraftTree,
  'moc-am': mocAmData as unknown as CraftTree,
  'thiep-cuoi-132-premium': thiepCuoi132Data as unknown as CraftTree,
  'thiep-cuoi-132': thiepCuoi132Data as unknown as CraftTree,
  'thiep-cuoi-131-basic': thiepCuoi131Data as unknown as CraftTree,
  'thiep-cuoi-131': thiepCuoi131Data as unknown as CraftTree,
  'thiep-cuoi-129-pre': thiepCuoi129Data as unknown as CraftTree,
  'thiep-cuoi-129': thiepCuoi129Data as unknown as CraftTree,
  'thiep-cuoi-128-pre': thiepCuoi128Data as unknown as CraftTree,
  'thiep-cuoi-128': thiepCuoi128Data as unknown as CraftTree,
  'thiep-cuoi-127-pre': thiepCuoi127Data as unknown as CraftTree,
  'thiep-cuoi-127': thiepCuoi127Data as unknown as CraftTree,
  'thiep-cuoi-126-pre': thiepCuoi126Data as unknown as CraftTree,
  'thiep-cuoi-126': thiepCuoi126Data as unknown as CraftTree,
  'thiep-cuoi-125-pre': thiepCuoi125Data as unknown as CraftTree,
  'thiep-cuoi-125': thiepCuoi125Data as unknown as CraftTree,
  'thiep-cuoi-124-pre': thiepCuoi124Data as unknown as CraftTree,
  'thiep-cuoi-124': thiepCuoi124Data as unknown as CraftTree,
  'thiep-cuoi-123-pre': thiepCuoi123Data as unknown as CraftTree,
  'thiep-cuoi-123': thiepCuoi123Data as unknown as CraftTree,
  'thiep-cuoi-122-pre': thiepCuoi122Data as unknown as CraftTree,
  'thiep-cuoi-122': thiepCuoi122Data as unknown as CraftTree,
  'thiep-cuoi-121-pre': thiepCuoi121Data as unknown as CraftTree,
  'thiep-cuoi-121': thiepCuoi121Data as unknown as CraftTree,
  'thiep-cuoi-120-pre': thiepCuoi120Data as unknown as CraftTree,
  'thiep-cuoi-120': thiepCuoi120Data as unknown as CraftTree,
  'our-eternal-chapter': ourEternalChapterData as unknown as CraftTree,
  'thiep-cuoi-115-pre': thiepCuoi115Data as unknown as CraftTree,
  'thiep-cuoi-115': thiepCuoi115Data as unknown as CraftTree,
  'thiep-cuoi-114-pre': thiepCuoi114Data as unknown as CraftTree,
  'thiep-cuoi-114': thiepCuoi114Data as unknown as CraftTree,
};

export function getCraftTemplate(slugOrId?: string | null): CraftTree | null {
  if (!slugOrId) return null;
  const key = slugOrId.toLowerCase().trim();
  if (CRAFT_REGISTRY[key]) return CRAFT_REGISTRY[key];

  // Match numbers (e.g. "thiep-cuoi-130" matching "130")
  const numMatch = key.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    for (const [slug, tree] of Object.entries(CRAFT_REGISTRY)) {
      if (slug.includes(`-${num}-`) || slug.endsWith(`-${num}`) || slug === num) {
        return tree;
      }
    }
  }

  // Try matching partial
  for (const [slug, tree] of Object.entries(CRAFT_REGISTRY)) {
    if (key.includes(slug) || slug.includes(key)) {
      return tree;
    }
  }

  return null;
}
