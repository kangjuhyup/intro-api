export const CommentColumn = {
  table: 'tb_vm_comment',
  address: 'address',
  comment: 'comment',
} as const;

export type CommentColumn = (typeof CommentColumn)[keyof typeof CommentColumn];
