'use client'
import React from 'react';
import { Grid, Typography, Button, Card, CardContent, CardMedia, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define a custom theme to add colors
const theme = createTheme({
    palette: {
        primary: {
            main: '#2196F3', // Orange color for primary buttons
        },
        secondary: {
            main: '#4CAF50', // Green for secondary buttons
        },
        text: {
            primary: '#333', // Dark text color
            secondary: '#777', // Lighter text color
        },
        background: {
            default: '#F4F4F9', // Light background color
        },
    },
});

const ChooseMat = () => {
    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Grid container spacing={4}>
                    {/* Sidebar Section */}
                    <Grid item xs={12} sm={4} md={3}>
                        <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: 2 }}>
                            Zalo
                        </Button>
                        <Button variant="contained" color="secondary" fullWidth sx={{ marginBottom: 2 }}>
                            Call
                        </Button>
                        <Button variant="outlined" color="primary" fullWidth sx={{ marginBottom: 2 }}>
                            Thành viên thân thiết
                        </Button>
                    </Grid>

                    {/* Content Section */}
                    <Grid item xs={12} sm={8} md={9}>
                        <Typography variant="h4" gutterBottom color="primary">
                            1. Kích thước, độ dày và trọng lượng
                        </Typography>
                        <Typography variant="body1" paragraph color="text.primary">
                            Chiều dài không thể ngắn hơn chiều cao cơ thể, chiều rộng không thể hẹp hơn vai. Độ dày phải thích hợp, đây là một trong những thông số khiến nhiều bạn phân vân nhất.
                            Với cùng một chất liệu, thảm càng dày thì khả năng hỗ trợ tránh chấn thương càng tốt, tuy nhiên thảm dày lại có nhược điểm ở những động tác thăng bằng vì nó tạo ra sự “bồng bềnh”, thảm mỏng cho cảm giác tiếp đất tốt và chắc chắn hơn. Tùy thuộc vào chất liệu chế tạo thảm mà nhà sản xuất đưa ra các độ dày khác nhau để cân bằng giữa 2 yếu tố này, các mẫu thảm tập phổ thông dùng trong luyện tập hàng ngày thường có độ dày trong khoảng từ 4mm đến 8mm.
                            Trên thị trường thảm tập yoga chủ yếu có kích thước thông dụng là rộng 61cm và dài 173cm hoặc 183cm. Với các dòng thảm cao cấp từ các thương hiệu nổi tiếng thì họ làm theo kích thước riêng (thường rộng và dài hơn).
                            Với các bạn hay di chuyển không nên chọn thảm quá nặng để có thể dễ dàng mang theo, hoặc có thể chọn các mẫu thảm yoga du lịch có thể gấp lại gọn nhẹ, vô cùng tiện lợi.
                        </Typography>

                        <Typography variant="h4" gutterBottom color="primary">
                            2. Tính đàn hồi
                        </Typography>
                        <Typography variant="body1" paragraph color="text.primary">
                            Dùng 2 ngón tay ép thảm lại và thả ra để cảm nhận độ đàn hồi của thảm, khi thả tay ra thảm phải trở về vị trí ban đầu. Nếu thảm quá xốp thì dù có dày khi cơ thể tiếp xúc với đất cũng thấy đau. Nếu thảm quá cứng, thì da thịt chúng ta dễ bị tổn thương.
                            Trải bằng tấm thảm, một tấm thảm tốt là không có bất cứ điểm nào lồi hay lõm.
                        </Typography>

                        <Typography variant="h4" gutterBottom color="primary">
                            3. Độ bám hay tính chống trơn
                        </Typography>
                        <Typography variant="body1" paragraph color="text.primary">
                            Đây là tiêu chí quan trọng bậc nhất của một tấm thảm yoga, tạo nên sự khác biệt với các loại thảm tập thể dục khác. Một tấm thảm tập yoga cần phải có độ bám tốt, nó giúp bạn tự tin và thoải mái khi thực hiện các tư thế yoga. Trải bằng tấm thảm trên mặt sàn phẳng, áp lòng bàn tay xuống thảm và dùng lực thử đẩy mạnh tấm thảm ra trước, nếu thảm trượt trên nền hay tay trượt trên thảm, đều có nghĩa là độ bám của thảm không tốt, người sử dụng có thể bị chấn thương trong quá trình luyện tập.
                        </Typography>

                        <Typography variant="h4" gutterBottom color="primary">
                            4. Đường kẻ định tuyến
                        </Typography>
                        <Typography variant="body1" paragraph color="text.primary">
                            Nếu có thể được bạn hãy chọn cho mình một tấm thảm có đường kẻ định tuyến, điều này cũng khá quan trọng (nhất là đối với người mới tập). Đường định tuyến trên mặt thảm giúp bạn căn chỉnh chân, tay cho đúng vị trí và vào tư thế chuẩn xác vì chúng ta tập yoga để khỏe, chẳng ai muốn sau một thời gian tập yoga sai tư thế thì cột sống bị lệch, vẹo. Hơn nữa đường kẻ định tuyến cũng giúp bạn dễ nhớ điểm đặt tay, chân hơn, tránh mất thời gian cũng như mất tập trung vào việc ước lượng khoảng cách hay vị trí…
                        </Typography>

                        {/* Product Grid Section */}
                        <Grid container spacing={3} marginTop={4}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card sx={{ boxShadow: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/tham-tap-yoga-manduka-pro-6mm.jpg?v=1683784871997"
                                        alt="Product image"
                                    />
                                    <CardContent>
                                        <Typography variant="h6" color="text.primary">
                                            SET2260 beYoga
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            880,000đ
                                        </Typography>
                                        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                                            Mua ngay
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Card sx={{ boxShadow: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/tham-yoga-van-may-dinh-tuyen-cao-su-pu.jpg?v=1654768427190"
                                        alt="Product image"
                                    />
                                    <CardContent>
                                        <Typography variant="h6" color="text.primary">
                                            Thảm yoga Manduka
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            1,590,000đ
                                        </Typography>
                                        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                                            Mua ngay
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Card sx={{ boxShadow: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image="https://bizweb.dktcdn.net/thumb/medium/100/262/937/products/ao-tap-tanktop-tnk1251-beyoga-san-pham.jpg?v=1626589621933"
                                        alt="Product image"
                                    />
                                    <CardContent>
                                        <Typography variant="h6" color="text.primary">
                                            Áo tập thể thao BRA4103
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            380,000đ
                                        </Typography>
                                        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                                            Mua ngay
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default ChooseMat;
