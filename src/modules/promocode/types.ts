/** Do‘kon promokodi (Swagger PromoCodeResponseDto) */
export interface IPromocode {
  id: string;
  productId: string;
  code: string;
  isUsed: boolean;
  usedByUserId?: string | null;
  usedAt?: string | null;
}

export interface IPromocodeStatsRow {
  productId: string;
  productTitle: string;
  total: number;
  used: number;
  available: number;
}

export interface IPromocodeUploadInput {
  productId: string;
  file: File;
}
