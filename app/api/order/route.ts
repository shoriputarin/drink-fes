import { NextRequest, NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { products } from '@lib/products';

export async function POST(req: NextRequest) {
  const data = await req.json();
  // 商品IDから商品情報を取得
  const product = products.find((p) => p.id === data.productId);
  if (!product) {
    return NextResponse.json({ ok: false, message: '商品が見つかりません' }, { status: 400 });
  }
  // 注文データに商品名・値段を付与して保存
  const order = {
    ...data,
    productName: product.name,
    productPrice: product.price,
  };
  await kv.rpush('orders', JSON.stringify(order));
  return NextResponse.json({ ok: true, message: '注文を受け付けました' });
} 