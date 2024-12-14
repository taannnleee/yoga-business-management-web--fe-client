'use client'
import React, { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "Tôi ở xa, phương thức giao hàng & thanh toán thế nào?",
        answer: "Chúng tôi giao hàng đến tất cả các tuyến huyện/thị xã trên toàn quốc thông qua các đối tác vận chuyển tin cậy. Bạn có thể trả tiền mặt khi nhận hàng (COD) hoặc thanh toán trực tuyến trên web hay qua tài khoản ngân hàng đều được. Xem thêm chi tiết tại Vận chuyển & giao hàng."
    },
    {
        question: "Phí ship thế nào? Có được miễn phí ship không?",
        answer: "Nếu đơn hàng của bạn từ 600K trở lên bạn sẽ được miễn phí ship toàn quốc ngoài ra bạn còn được tặng thêm 01 móc khóa chữ OM. Với đơn hàng dưới 600K bạn chỉ phải trả 30K phí ship đồng giá đi tất cả huyện/thị trên toàn quốc. Xem thêm chi tiết tại Vận chuyển & giao hàng."
    },
    {
        question: "Có được kiểm tra hàng khi nhận không?",
        answer: "Bạn được quyền xem và kiểm tra hàng trước khi nhận. Nếu sản phẩm không đúng như đơn hàng đã đặt, đóng nhầm hàng hay bị lỗi bạn có quyền từ chối nhận hàng và không phải trả bất cứ chi phí nào. Trong trường hợp bạn đã thanh toán trước, shop sẽ đổi lại đúng hàng hoặc hoàn tiền lại. Lưu ý: Vui lòng không xé niêm phong, bóc nhãn mác hay thử sản phẩm. Xem thêm chi tiết tại Vận chuyển & giao hàng."
    },
    {
        question: "Tôi vội không kiểm tra, hàng giao sai hay lỗi xử lý thế nào?",
        answer: "Bạn hoàn toàn yên tâm, ngay cả khi bạn không kiểm tra hàng lúc nhận, nếu đơn hàng giao không đúng chủng loại, màu sắc hay sản phẩm bị lỗi do sản xuất và/hoặc vận chuyển chúng tôi sẽ chịu trách nhiệm đổi sản phẩm mới và chịu mọi chi phí liên quan. Xem thêm Chính sách đổi trả và bảo hành."
    },
    {
        question: "Tôi đặt hàng, sau bao lâu tôi sẽ nhận được hàng?",
        answer: "Chúng tôi thường xử lý đóng gói và giao hàng trong vòng 01 giờ đồng hồ sau khi xác nhận đơn hàng. Nếu bạn ở nội thành Hà Nội và đặt hàng trong giờ làm việc, bạn sẽ nhận được hàng ngay trong ngày. Nếu bạn ở các tỉnh miền Bắc, bạn thường nhận được hàng sau 2-3 ngày. Các tỉnh miền Trung và miền Nam thường sau 3-5 ngày."
    },
    {
        question: "Tôi muốn đặt mua hàng thì làm thế nào?",
        answer: "Chúng tôi ở đây để phục vụ bạn! Bạn có thể chọn bất kỳ hình thức đặt mua hàng nào thuận tiện nhất cho bạn: Trực tuyến ngay trên trang web này, qua trang Facebook, trang Zalo OA, Email hay gọi Tổng đài Tư vấn bán hàng & CSKH: 097.848.3366. Xem thêm chi tiết tại Hướng dẫn mua hàng."
    },
    {
        question: "Có cần tạo tài khoản để mua hàng không?",
        answer: "Không, bạn có thể mua hàng mà không cần tài khoản. Tuy nhiên, việc tạo tài khoản sẽ giúp bạn theo dõi đơn hàng và dễ dàng thực hiện các giao dịch sau này."
    },
    {
        question: "Tôi có thể thay đổi đơn hàng đã đặt không?",
        answer: "Nếu đơn hàng chưa được xử lý hoặc giao, bạn có thể thay đổi. Tuy nhiên, nếu đơn hàng đã được vận chuyển, bạn sẽ không thể thay đổi."
    },
    {
        question: "Sản phẩm có bảo hành không?",
        answer: "Mỗi sản phẩm có chính sách bảo hành riêng. Bạn có thể xem chi tiết về bảo hành sản phẩm trên trang thông tin của từng sản phẩm."
    },
    {
        question: "Có giảm giá hay khuyến mãi nào không?",
        answer: "Chúng tôi luôn có các chương trình khuyến mãi hấp dẫn. Hãy theo dõi chúng tôi trên website hoặc các kênh mạng xã hội để không bỏ lỡ."
    },
    {
        question: "Làm thế nào để biết đơn hàng của tôi đã được xử lý?",
        answer: "Bạn sẽ nhận được email hoặc SMS thông báo khi đơn hàng của bạn được xác nhận và giao đi."
    },
    {
        question: "Tôi có thể hủy đơn hàng sau khi đặt không?",
        answer: "Nếu đơn hàng chưa được xử lý, bạn có thể yêu cầu hủy. Tuy nhiên, nếu đơn hàng đã được vận chuyển, bạn sẽ không thể hủy."
    },
    {
        question: "Làm sao để nhận thông báo về khuyến mãi mới?",
        answer: "Bạn có thể đăng ký nhận email hoặc theo dõi các kênh mạng xã hội của chúng tôi để nhận thông tin khuyến mãi."
    },
    {
        question: "Tôi có thể trả hàng đã mua không?",
        answer: "Nếu sản phẩm bị lỗi hoặc không đúng như mô tả, bạn có thể yêu cầu đổi trả theo chính sách của chúng tôi."
    },
    {
        question: "Phương thức thanh toán nào được chấp nhận?",
        answer: "Chúng tôi chấp nhận nhiều phương thức thanh toán như chuyển khoản ngân hàng, thanh toán qua ví điện tử hoặc COD (thanh toán khi nhận hàng)."
    },
    {
        question: "Có giảm giá cho đơn hàng lớn không?",
        answer: "Chúng tôi có chính sách giảm giá cho các đơn hàng lớn. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết."
    },
    {
        question: "Sản phẩm có sẵn hay không?",
        answer: "Chúng tôi luôn cố gắng đảm bảo hàng hóa sẵn có. Tuy nhiên, trong một số trường hợp, sản phẩm có thể hết hàng tạm thời."
    },
    {
        question: "Tôi có thể yêu cầu giao hàng vào giờ nào?",
        answer: "Chúng tôi có thể giao hàng trong giờ hành chính. Tuy nhiên, thời gian giao hàng cụ thể sẽ phụ thuộc vào khu vực của bạn."
    },
    {
        question: "Tôi có thể gửi quà cho người khác được không?",
        answer: "Có, bạn có thể gửi sản phẩm làm quà cho người khác, chúng tôi sẽ đảm bảo việc giao hàng đúng người nhận."
    },
    {
        question: "Có hỗ trợ giao hàng quốc tế không?",
        answer: "Chúng tôi hiện chỉ hỗ trợ giao hàng trong nước. Tuy nhiên, chúng tôi đang xem xét việc mở rộng giao hàng quốc tế trong tương lai."
    },
    {
        question: "Làm thế nào để kiểm tra tình trạng đơn hàng?",
        answer: "Bạn có thể kiểm tra tình trạng đơn hàng của mình bằng cách đăng nhập vào tài khoản và vào mục 'Lịch sử đơn hàng'."
    },
    {
        question: "Có dịch vụ đóng gói quà tặng không?",
        answer: "Chúng tôi cung cấp dịch vụ đóng gói quà tặng với chi phí hợp lý. Bạn có thể chọn khi đặt hàng."
    }
    // Thêm các câu hỏi khác ở đây nếu cần
];

const FAQSection: React.FC = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-4">
                        <div
                            onClick={() => toggleFAQ(index)}
                            className="cursor-pointer text-lg font-medium text-black hover:text-blue-600"
                        >
                            {faq.question}
                        </div>
                        {expandedIndex === index && (
                            <div className="mt-2 text-sm text-gray-700">{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;
