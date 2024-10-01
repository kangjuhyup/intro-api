export const UserColumn = {
  table: 'tb_vm_user',
  address: 'address',
  name: 'name',
  company: 'company',
} as const;

export type UserColumn = (typeof UserColumn)[keyof typeof UserColumn];
