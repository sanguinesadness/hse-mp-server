import { Prisma } from '@prisma/client';

export type TProduct = {
  name: string;
  created_at: string;
  updated_at?: string;
  barcode?: string;
  offer_id: string;
  volume_weight: number;
  primary_image?: string;
  price?: string;
  marketing_price?: string;
  old_price?: string;
};

export class ProductModel implements TProduct {
  barcode?: string;
  created_at: string;
  marketing_price?: string;
  name: string;
  offer_id: string;
  old_price?: string;
  price?: string;
  primary_image?: string;
  updated_at?: string;
  volume_weight: number;

  static fromServer(
    data: ProductModel,
    userId: string
  ): Prisma.ProductCreateInput {
    return {
      name: data.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      barcode: data.barcode,
      offerId: data.offer_id,
      weight: data.volume_weight,
      primaryImage: data.primary_image,
      oldPrice: parseFloat(data.old_price),
      newPrice: parseFloat(data.price || data.marketing_price),
      user: { connect: { id: userId } }
    };
  }

  constructor(data: Partial<ProductModel>) {
    Object.keys(data).forEach((key: string) => {
      if (key in this) {
        this[key] = data[key];
      }
    });
  }
}
