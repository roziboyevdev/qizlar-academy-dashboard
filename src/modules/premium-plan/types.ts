
export interface PremiumPlan {
  id: string;
  title: string,
  price: number,
  duration_in_days: number,
  is_visible: boolean
  properties: string[],
  date: string;
}



export interface PremiumPlanInputType {
  title: string,
  properties: string[],
  price: number,
  is_visible: boolean,
  duration_in_days: number,
}


export interface PremiumPlanEditBodyType {
  id: string;
  values: PremiumPlanInputType;
}

