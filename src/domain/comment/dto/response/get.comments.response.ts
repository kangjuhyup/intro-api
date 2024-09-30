export class GetCommentsResponse {
  count: number;
  comments: {
    avartar: string;
    name: string;
    company: string;
    body: string;
    createdAt: Date;
  }[];
}
