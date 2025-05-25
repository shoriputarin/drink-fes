import { NextRequest, NextResponse } from 'next/server';
import kv from '@/lib/kv';

export async function POST(req: NextRequest) {
  try {
    // Redisの'orders'キーを削除
    await kv.del('orders');
    return NextResponse.json({ ok: true, message: '売上データを消去しました' });
  } catch (error) {
    console.error('売上データの消去に失敗:', error);
    return NextResponse.json(
      { ok: false, message: '売上データの消去に失敗しました' },
      { status: 500 }
    );
  }
} 