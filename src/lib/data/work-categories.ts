export const WORK_CATEGORIES = [
    'todos',
    'desenvolvimento',
    'design',
    'conceito'
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];
