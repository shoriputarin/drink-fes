"use client";
import { useState, useEffect } from 'react';
import { products } from '@lib/products';
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';

interface Order {
  productId: number;
  productName: string;
  productPrice: number;
  count: number;
  timestamp?: string;
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
        const ordersWithTime = data.sales.map((order: Order) => ({
          ...order,
          timestamp: new Date().toLocaleString('ja-JP')
        }));
        setOrders(ordersWithTime);
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

  // 売上集計
  const total = orders.reduce((sum, o) => sum + o.productPrice * o.count, 0);
  const salesByProduct = products.map(product => {
    const productOrders = orders.filter(o => o.productId === product.id);
    const totalCount = productOrders.reduce((sum, o) => sum + o.count, 0);
    const totalAmount = productOrders.reduce((sum, o) => sum + (o.productPrice * o.count), 0);
    return {
      ...product,
      totalCount,
      totalAmount
    };
  });

  return (
    <div className={styles.page} style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        width: '100%', 
        maxWidth: 1200, 
        margin: '0 auto',
        backgroundColor: 'var(--background)',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* 左側：注文フォーム */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1>ドリンク注文フォーム</h1>
            <Link 
              href="/admin" 
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
            >
              管理画面へ
            </Link>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              商品：
              <select 
                value={productId} 
                onChange={e => setProductId(Number(e.target.value))}
                style={{ padding: '0.5rem', borderRadius: '4px' }}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}（{p.price}円）
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              数量：
              <input
                type="number"
                min={1}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                style={{ width: '100px', padding: '0.5rem', borderRadius: '4px' }}
              />
            </label>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {loading ? '送信中...' : '注文する'}
            </button>
          </form>
          {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        </div>

        {/* 右側：売上情報 */}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: '1.5rem' }}>売上情報</h1>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>商品別売上</h2>
            <table border={1} cellPadding={8} style={{ width: '100%', marginBottom: '1rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>商品名</th>
                  <th>単価</th>
                  <th>販売数</th>
                  <th>売上</th>
                </tr>
              </thead>
              <tbody>
                {salesByProduct.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.price}円</td>
                    <td>{p.totalCount}個</td>
                    <td>{p.totalAmount}円</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>合計売上: {total}円</h2>
          </div>

          <div>
            <h2 style={{ marginBottom: '1rem' }}>直近5件の注文履歴</h2>
            <table border={1} cellPadding={8} style={{ width: '100%', marginBottom: '1rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>注文日時</th>
                  <th>商品</th>
                  <th>数量</th>
                  <th>金額</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>注文履歴はありません</td>
                  </tr>
                ) : (
                  orders.slice(-5).reverse().map((o, i) => (
                    <tr key={i}>
                      <td>{o.timestamp}</td>
                      <td>{o.productName}</td>
                      <td>{o.count}個</td>
                      <td>{o.productPrice * o.count}円</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
