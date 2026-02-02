export const WORK_CATEGORIES = [
    'todos',
    'trabalho',
    'projeto',
    'componente',
    'conceito'
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];
