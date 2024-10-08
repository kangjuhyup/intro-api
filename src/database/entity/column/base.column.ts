export const BaseColumn = {
  useYn: 'use_yn',
  creator: 'creator',
  createdAt: 'created_at',
  updator: 'updator',
  updatedAt: 'updated_at',
} as const;

export type BaseColumn = (typeof BaseColumn)[keyof typeof BaseColumn];
