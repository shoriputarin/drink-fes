import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // TODO: KV保存処理
  return NextResponse.json({ ok: true, message: '注文を受け付けました（ダミー）' });
} 