// backend/src/controllers/statsController.js
const Book = require('../models/Book');
const Reader = require('../models/Reader');
const Borrowing = require('../models/Borrowing');
const moment = require('moment'); // Đừng quên: npm install moment

// === Vùng 1 & 3 Logic ===
exports.getHomeStats = async (req, res) => {
    try {
        const today = moment();
        const cutoffDate = moment().add(3, 'days').endOf('day').toDate(); // Sắp đến hạn (trong 3 ngày)

        // Vùng 1: Card Thống kê nhanh
        const totalBooks = await Book.countDocuments();
        const totalReaders = await Reader.countDocuments();
        const borrowedCount = await Borrowing.countDocuments({ status: 'Đang mượn' });
        
        // Sách đang mượn VÀ ngày hẹn trả đã qua
        const overdueCount = await Borrowing.countDocuments({ 
            status: 'Đang mượn',
            dueDate: { $lt: today.startOf('day').toDate() } 
        });

        // Vùng 3: Danh sách Sắp/Đã Quá Hạn
        const overdueItems = await Borrowing.find({
            status: 'Đang mượn',
            dueDate: { $lte: cutoffDate } 
        })
        .populate('reader', 'name') // Lấy tên bạn đọc
        .populate('book', 'title')   // Lấy tên sách
        .sort('dueDate'); 

        const formattedOverdueList = overdueItems.map(item => {
            const dueDate = moment(item.dueDate);
            let statusText = '';
            
            if (dueDate.isBefore(today, 'day')) {
                const daysOverdue = today.diff(dueDate, 'days');
                statusText = `Quá hạn ${daysOverdue} ngày`;
            } else {
                const daysUntilDue = dueDate.diff(today, 'days') + 1;
                statusText = `${daysUntilDue} ngày nữa đến hạn`;
            }

            return {
                readerName: item.reader?.name || 'N/A',
                bookTitle: item.book?.title || 'N/A',
                dueDate: item.dueDate,
                statusText: statusText,
            };
        });

        res.json({
            summary: { totalBooks, totalReaders, borrowedCount, overdueCount },
            overdueList: formattedOverdueList,
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu trang chủ.', error });
    }
};

// === Vùng 2 Logic (Dữ liệu mẫu cho biểu đồ) ===
exports.getChartData = (req, res) => {
    // Trong thực tế, bạn sẽ dùng Aggregation để nhóm theo ngày/tháng
    const data = [
        { date: 'T11/24', muon: 15, tra: 10 },
        { date: 'T12/24', muon: 20, tra: 15 },
        { date: 'T1/25', muon: 18, tra: 22 },
        { date: 'T2/25', muon: 25, tra: 19 },
        { date: 'T3/25', muon: 30, tra: 28 },
    ];
    res.json(data);
};