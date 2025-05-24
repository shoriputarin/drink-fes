import { useEffect, useState } from 'react';

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

  useEffect(() => {
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
    fetchSales();
  }, []);

  const total = sales.reduce((sum, s) => sum + (s.productPrice * s.count), 0);

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: 16 }}>
      <h1>売上集計画面</h1>
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
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={i}>
                  <td>{s.productName}</td>
                  <td>{s.productPrice}円</td>
                  <td>{s.count}</td>
                  <td>{s.productPrice * s.count}円</td>
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
