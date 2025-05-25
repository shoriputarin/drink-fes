"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Sale {
  productId: number;
  productName: string;
  productPrice: number;
  count: number;
}

export default function AdminPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clearLoading, setClearLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      if (data.ok) {
        setSales(data.sales);
      } else {
        setError(data.message || 'データ取得エラー');
      }
    } catch (e) {
      setError('通信エラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleClearData = async () => {
    if (!confirm('本当に全ての売上データを消去しますか？この操作は取り消せません。')) {
      return;
    }

    setClearLoading(true);
    try {
      const res = await fetch('/api/sales/clear', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.ok) {
        alert('売上データを消去しました');
        await fetchSales();
      } else {
        alert(data.message || 'データの消去に失敗しました');
      }
    } catch (e) {
      alert('通信エラーが発生しました');
    } finally {
      setClearLoading(false);
    }
  };

  const handleDeleteOrder = async (index: number) => {
    if (!confirm('この注文を削除してもよろしいですか？')) {
      return;
    }

    setDeleteLoading(index);
    try {
      const res = await fetch('/api/sales/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
      });
      const data = await res.json();
      if (data.ok) {
        await fetchSales();
      } else {
        alert(data.message || '注文の削除に失敗しました');
      }
    } catch (e) {
      alert('通信エラーが発生しました');
    } finally {
      setDeleteLoading(null);
    }
  };

  const total = sales.reduce((sum, s) => sum + (s.productPrice * s.count), 0);

  return (
    <main style={{ maxWidth: 800, margin: '2rem auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>売上集計画面</h1>
        <Link 
          href="/" 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}
        >
          メインページに戻る
        </Link>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleClearData}
          disabled={clearLoading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '1rem',
          }}
        >
          {clearLoading ? '消去中...' : '全データを消去'}
        </button>
      </div>
      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <table border={1} cellPadding={8} style={{ width: '100%', marginBottom: 16 }}>
            <thead>
              <tr>
                <th>商品名</th>
                <th>単価</th>
                <th>数量</th>
                <th>小計</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={i}>
                  <td>{s.productName}</td>
                  <td>{s.productPrice}円</td>
                  <td>{s.count}</td>
                  <td>{s.productPrice * s.count}円</td>
                  <td>
                    <button
                      onClick={() => handleDeleteOrder(i)}
                      disabled={deleteLoading === i}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {deleteLoading === i ? '削除中...' : '削除'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>合計金額: {total}円</h2>
        </>
      )}
    </main>
  );
}
