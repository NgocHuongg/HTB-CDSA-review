# Skills Assessment - Zeek (Bài đánh giá kỹ năng - Zeek)

## Phát hiện xâm nhập với Zeek: Phát hiện SSL certificate của Gootkit

**Nguồn PCAP**: [https://www.malware-traffic-analysis.net/2016/07/08/index.html](https://web.archive.org/web/20230128061716/https://www.malware-traffic-analysis.net/2016/07/08/index.html)

**Mô tả tấn công và các điểm có thể phát hiện**: [https://www.malware-traffic-analysis.net/2016/07/08/index.html](https://web.archive.org/web/20230128061716/https://www.malware-traffic-analysis.net/2016/07/08/index.html) <-- Tập trung vào các phần liên quan tới SSL certificate.

`Neutrino`, một exploit kit khét tiếng, và `Gootkit`, một banking trojan nguy hiểm, từng phối hợp với nhau để thực hiện các cuộc tấn công mạng.

Exploit kit `Neutrino` mở đường, sau đó `Gootkit` bắt đầu giao tiếp qua mạng bằng mã hoá SSL/TLS. Chính trong các luồng giao tiếp được mã hoá này, ta bắt gặp một chi tiết đặc biệt đáng chú ý — các SSL certificate mà `Gootkit` sử dụng chứa Common Name (`CN`) là "`My Company Ltd.`".

Tội phạm mạng thường dùng certificate tự ký (self-signed) hoặc do CA không đáng tin cậy cấp để thiết lập giao tiếp mã hoá. Những certificate này thường mang thông tin giả mạo hoặc chung chung. Trong trường hợp này, common name `My Company Ltd.` nổi bật như một điểm bất thường (anomaly) mà ta có thể dùng để nhận diện đợt lây nhiễm `Gootkit` cụ thể này, được phát tán qua exploit kit `Neutrino`.

---

Hãy xem lại tài liệu tham khảo đã dẫn ở trên, nơi bàn về các dấu vết mạng (network trace) do hoạt động giao tiếp của `Gootkit` tạo ra, rồi tiếp tục trả lời câu hỏi bên dưới.
