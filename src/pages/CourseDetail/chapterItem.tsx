import * as React from 'react';
import { ListItem, ListItemText, IconButton, Typography, Button } from '@mui/material';
import { AddCircleOutline, Edit, Delete, Visibility } from '@mui/icons-material';

const AddChapter = () => {
    const [chapterTitle, setChapterTitle] = React.useState('');

    const handleSubmit = () => {
        // Xử lý logic thêm chương tại đây
        console.log("Chương đã được thêm:", chapterTitle);
        // Reset trường input
        setChapterTitle('');
    };

    return (
        <div>
            <Typography variant="h6">Tiêu đề của chương</Typography>
            <div>Đặt tiêu đề của chương không nên sử dụng kí tự đặt biệt</div>
            <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Nhập tiêu đề chương"
            />
            <Button onClick={handleSubmit} variant="contained" color="primary">
                Lưu chương
            </Button>
        </div>
    );
};

export default AddChapter