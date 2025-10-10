export interface IRewardPromocode {
  id?: string;
  file?: string;
  rewardId?: string;
  title?: string;
  total?: number;
  unused?: number;
}

export interface IRewardPromocodeInput {
  file: string;
  rewardId: string;
}

export interface IRewardPromocodeEditBody {
  id: string;
  values: IRewardPromocodeInput;
}
