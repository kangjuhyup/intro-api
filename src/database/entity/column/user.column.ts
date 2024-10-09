export const UserColumn = {
  table: 'tb_vm_user',
  address: 'address',
  name: 'name',
  company: 'company',
  fileId: 'file_id',
} as const;

export type UserColumn = (typeof UserColumn)[keyof typeof UserColumn];
