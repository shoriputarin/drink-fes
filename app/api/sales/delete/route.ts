import { NextRequest, NextResponse } from 'next/server';
import kv from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    const { index } = await req.json();
    
    // 現在の注文リストを取得
    const orders = await kv.lrange('orders', 0, -1);
    
    // 指定されたインデックスの注文を削除
    const updatedOrders = orders.filter((_, i) => i !== index);
    
    // リストを一旦クリア
    await kv.del('orders');
    
    // 更新された注文リストを再保存
    if (updatedOrders.length > 0) {
      await kv.rpush('orders', ...updatedOrders);
    }
    
    return NextResponse.json({ ok: true, message: '注文を削除しました' });
  } catch (error) {
    console.error('注文の削除に失敗:', error);
    return NextResponse.json(
      { ok: false, message: '注文の削除に失敗しました' },
      { status: 500 }
    );
  }
} 