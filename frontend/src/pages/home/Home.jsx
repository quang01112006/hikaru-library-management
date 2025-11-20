// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Cần cài đặt recharts và đảm bảo react-router-dom đã được setup cho route này

// --- Component phụ cho Vùng 1 ---
const Card = ({ title, value, color = 'var(--p-500)' }) => ( 
    <div style={{ /* ... style khác ... */ }}>
        <h4 style={{ margin: '0 0 5px 0', color: 'var(--n-700)' }}>{title}</h4> {/* Dùng màu trung tính đậm cho tiêu đề */}
        <h1 style={{ color: color, margin: '0', fontSize: '2.5rem' }}>{value}</h1>
    </div>
);

// --- Component phụ cho Vùng 3 ---
const OverdueTable = ({ list }) => (
    <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3>🚨 Danh sách Sách sắp/đã Quá hạn</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            {/* ... (phần code Table HTML/JSX như đã gửi ở lần trước) ... */}
            <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Bạn đọc</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Tên sách</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Ngày hẹn trả</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Tình trạng</th>
                </tr>
            </thead>
            <tbody>
                {list.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>Không có sách nào sắp hoặc đã quá hạn.</td></tr>
                ) : (
                    list.map((item, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.readerName}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.bookTitle}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{new Date(item.dueDate).toLocaleDateString('vi-VN')}</td>
                            <td style={{ 
                                border: '1px solid #ddd', 
                                padding: '10px', 
                                color: item.statusText.includes('Quá hạn') ? 'red' : 'orange', 
                                fontWeight: 'bold' 
                            }}>
                                {item.statusText}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);


const Home = () => {
    const [data, setData] = useState({
        summary: {},
        chartData: [],
        overdueList: []
    });
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetchHomeData().then(result => {
    //         setData(result);
    //         setLoading(false);
    //     });
    // }, []);

    if (loading) return <div style={{ padding: '20px' }}>Đang tải dữ liệu Trang Chủ...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2>📊 Dashboard Quản Lý Thư Viện</h2>
            <hr />
            
            {/* Vùng 1: Cards Thống kê */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <Card title="Tổng số Đầu Sách" value={data.summary.totalBooks || 0} />
                <Card title="Tổng Bạn Đọc" value={data.summary.totalReaders || 0} />
                <Card title="Sách Đang Mượn" value={data.summary.borrowedCount || 0} color="var(--color-warning)" />
                <Card title="Sách Quá Hạn" value={data.summary.overdueCount || 0} color="var(--color-error)" />
            </div>

            {/* Vùng 2: Biểu đồ Hoạt động */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3>📈 Biểu đồ Hoạt động Mượn Trả</h3>
                <ResponsiveContainer width="100%" height={300}>
                    {/* <LineChart data={data.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="muon" stroke="#007bff" name="Số lần Mượn" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="tra" stroke="#28a745" name="Số lần Trả" />
                    </LineChart> */}
                </ResponsiveContainer>
            </div>
            
            {/* Vùng 3: Danh sách Quá hạn */}
            <OverdueTable list={data.overdueList} />

        </div>
    );
};

export default Home;