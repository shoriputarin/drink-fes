"use client";
import { useState, useEffect } from 'react';
import { products } from '@lib/products';
import Image from "next/image";
import styles from "./page.module.css";

interface Order {
  productId: number;
  productName: string;
  productPrice: number;
  count: number;
}

export default function OrderPage() {
  const [productId, setProductId] = useState(products[0]?.id || 1);
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // 注文履歴取得
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      if (data.ok) {
        // 最新5件のみ表示（新しい順）
        setOrders(data.sales.slice(-5).reverse());
      }
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, count }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage('注文が完了しました！');
        setCount(1);
        await fetchOrders(); // 注文後に履歴を更新
      } else {
        setMessage(data.message || 'エラーが発生しました');
      }
    } catch (err) {
      setMessage('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      <main style={{ maxWidth: 400, margin: '2rem auto', padding: 16 }}>
        <h1>ドリンク注文フォーム</h1>
        <form onSubmit={handleSubmit}>
          <label>
            商品：
            <select value={productId} onChange={e => setProductId(Number(e.target.value))}>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}（{p.price}円）
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            数量：
            <input
              type="number"
              min={1}
              value={count}
              onChange={e => setCount(Number(e.target.value))}
              style={{ width: 60 }}
            />
          </label>
          <br />
          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? '送信中...' : '注文する'}
          </button>
        </form>
        {message && <p style={{ color: 'green', marginTop: 16 }}>{message}</p>}

        {/* 注文履歴表示 */}
        <h2 style={{ marginTop: 32 }}>直近5件の注文履歴</h2>
        <ul>
          {orders.length === 0 ? (
            <li>注文履歴はありません</li>
          ) : (
            orders.map((o, i) => (
              <li key={i}>
                {o.productName} × {o.count}（{o.productPrice * o.count}円）
              </li>
            ))
          )}
        </ul>
        {/* 合計金額表示 */}
        <h3 style={{ marginTop: 16 }}>
          合計金額: {orders.reduce((sum, o) => sum + o.productPrice * o.count, 0)}円
        </h3>
      </main>
    </div>
  );
}
