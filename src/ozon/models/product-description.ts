export type TProductDescriptionResponse = {
  id: number;
  offer_id: string;
  name: string;
  description: string;
};

export type TProductDescriptionRequest = {
  product_id: number;
  offer_id: string;
};
