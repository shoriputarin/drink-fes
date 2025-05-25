import { NextRequest, NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { products } from '@lib/products';

export async function GET(req: NextRequest) {
  // Redisリストから全注文データを取得
  const orders = await kv.lrange('orders', 0, -1);
  const parsed = orders.map((o: any) => {
    // 文字列の場合はパース、オブジェクトの場合はそのまま使用
    const order = typeof o === 'string' ? JSON.parse(o) : o;
    const product = products.find((p) => p.id === order.productId);
    return {
      ...order,
      productName: product?.name ?? '不明',
      productPrice: product?.price ?? 0,
    };
  });
  return NextResponse.json({ ok: true, sales: parsed });
} 