import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // TODO: KVから売上データ取得
  return NextResponse.json({ ok: true, sales: [], message: '売上データ（ダミー）' });
} 