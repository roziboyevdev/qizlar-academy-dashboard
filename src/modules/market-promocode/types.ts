export interface IMarketPromocode {
  id?: string;
  file: string;
  productId: string;
}

export interface IMarketPromocodeInput {
  file: string;
  productId: string;
}

export interface IMarketPromocodeEditBody {
  id: string;
  values: IMarketPromocodeInput;
}
