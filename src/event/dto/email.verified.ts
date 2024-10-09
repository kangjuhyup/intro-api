export class EmailVerified {
  private historyId: number;
  private address: string;
  private name: string;
  private avartar: string;
  private comment: string;
  private company?: string;

  constructor(param: {
    historyId: number;
    address: string;
    name: string;
    avartar: string;
    comment: string;
    company?: string;
  }) {
    this.historyId = param.historyId;
    this.address = param.address;
    this.name = param.name;
    this.avartar = param.avartar;
    this.comment = param.comment;
    this.company = param.company;
  }

  get getHistoryId(): number {
    return this.historyId;
  }

  get getAddress(): string {
    return this.address;
  }

  get getName(): string {
    return this.name;
  }

  get getAvartar(): string {
    return this.avartar;
  }

  get getComment(): string {
    return this.comment;
  }

  get getCompany(): string | undefined {
    return this.company;
  }
}
