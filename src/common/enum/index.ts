export const YN = {
  Y: 'Y',
  N: 'N',
} as const;

export type YN = (typeof YN)[keyof typeof YN];

export const EventType = {
  EMAIL_VERIFIED: 'email.verified',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];
