export const EmailHistoryColumn = {
  table: 'tb_vh_email',
  historyId: 'vh_email_id',
  address: 'address',
  verifyYn: 'verify_yn',
} as const;
export type EmailHistoryColumn =
  (typeof EmailHistoryColumn)[keyof typeof EmailHistoryColumn];
