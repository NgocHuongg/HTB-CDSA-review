# Zeek Fundamentals (Kiến thức cơ bản về Zeek)

Theo định nghĩa của chính các nhà phát triển, Zeek là một công cụ phân tích lưu lượng mạng (network traffic analyzer) mã nguồn mở. Nó thường được dùng để soi xét từng bit lưu lượng trên mạng, đào sâu tìm mọi dấu hiệu của hoạt động đáng ngờ hoặc độc hại. Nhưng Zeek không chỉ giới hạn ở đó. Nó còn là công cụ hữu ích để xử lý sự cố mạng (troubleshooting) và thực hiện nhiều loại đo lường khác nhau trong mạng. Ngay khi triển khai Zeek, đội an ninh mạng phòng thủ (blue team) có thể khai thác ngay một kho log file phong phú, cung cấp góc nhìn tổng quan ở mức cao về mọi loại hoạt động mạng. Cụ thể, các log này chứa bản ghi chi tiết của từng kết nối được tạo qua mạng, cùng với bản ghi chép các hoạt động ở tầng ứng dụng (application layer) như DNS query và response, HTTP session, v.v. Nhưng khả năng của Zeek còn vượt xa việc ghi log đơn thuần. Nó đi kèm một bộ chức năng để phân tích và phát hiện các hoạt động mạng.

Điều làm Zeek nổi bật là ngôn ngữ scripting rất mạnh, cho phép người dùng viết các Zeek script có chức năng tương tự Suricata rule. Tính năng mạnh mẽ này giúp Zeek có thể tuỳ biến và mở rộng hoàn toàn, cho phép thành viên blue team tự phát triển logic và chiến lược riêng cho việc phân tích mạng và phát hiện xâm nhập (intrusion detection).

Xét chức năng của Zeek, cộng với khả năng chạy trên phần cứng thông thường và ngôn ngữ scripting mạnh mẽ, có thể thấy rõ đây không phải là một IDS dựa trên signature nữa. Thay vào đó, Zeek là một nền tảng hỗ trợ phát hiện lạm dụng theo ngữ nghĩa (semantic misuse detection), phát hiện bất thường (anomaly detection) và phân tích hành vi (behavioral analysis)..

## Các chế độ hoạt động của Zeek

Zeek hoạt động ở các chế độ sau:
- Phân tích lưu lượng hoàn toàn thụ động (fully passive)
- Giao diện libpcap để bắt gói tin (packet capture)
- Phân tích thời gian thực (real-time) và offline (vd: dựa trên PCAP)
- Hỗ trợ cluster cho các triển khai quy mô lớn

## Kiến trúc của Zeek

Kiến trúc của Zeek gồm hai thành phần chính: `event engine` (hay core) và `script interpreter`. 

`event engine` nhận luồng gói tin đi vào và biến đổi nó thành một chuỗi các `events` ở mức cao. Trong ngữ cảnh của Zeek, các `events` này mô tả hoạt động mạng theo cách trung lập về chính sách (policy-neutral), nghĩa là chúng cho ta biết điều gì đang xảy ra nhưng không đưa ra diễn giải hay đánh giá nào về nó. Ví dụ, một HTTP request sẽ được biến đổi thành event `http_request`. Event này cung cấp đầy đủ chi tiết của request nhưng không đưa ra bất kỳ phán đoán hay phân tích nào, chẳng hạn như một port có trùng với port đã biết là được malware sử dụng hay không.

Phần diễn giải hay phân tích như vậy do `script interpreter` của Zeek đảm nhận; nó thực thi một tập event handler được viết bằng ngôn ngữ scripting của Zeek (Zeek script). Các script này thể hiện chính sách bảo mật (security policy) của hệ thống, định nghĩa các hành động cần thực hiện khi phát hiện những event nhất định.

Các event do core của Zeek sinh ra được xếp hàng đợi theo thứ tự, chờ đến lượt được xử lý theo nguyên tắc đến trước phục vụ trước (first-come, first-served). Phần lớn event của Zeek được định nghĩa trong các file `.bif` nằm trong thư mục `/scripts/base/bif/plugins/`. Để xem danh sách event đầy đủ hơn, tham khảo tài liệu sau: [https://docs.zeek.org/en/stable/scripts/base/bif/](https://docs.zeek.org/en/stable/scripts/base/bif)

## Zeek Logs

Về việc ghi log của Zeek, khi ta dùng Zeek để phân tích offline một file PCAP, các log sẽ được lưu trong thư mục hiện tại.

Trong vô số loại log mà Zeek tạo ra, một số log quen thuộc gồm:
- `conn.log`: Log này cung cấp chi tiết về các kết nối IP, TCP, UDP và ICMP.
- `dns.log`: Ở đây bạn sẽ tìm thấy chi tiết các DNS query và response.
- `http.log`: Log này ghi lại chi tiết các HTTP request và response.
- `ftp.log`: Chi tiết các FTP request và response được ghi ở đây.
- `smtp.log`: Log này bao quát các giao dịch SMTP, chẳng hạn thông tin người gửi và người nhận.

Hãy lấy `http.log` làm ví dụ. Nó chứa đầy dữ liệu giá trị như:
- `host`: Domain/IP của HTTP.
- `uri`: URI của HTTP.
- `referrer`: Referrer của HTTP request.
- `user_agent`: User agent của client.
- `status_code`: Mã trạng thái (status code) HTTP.

Để xem danh sách đầy đủ hơn các log phổ biến của Zeek và các field tương ứng, tham khảo tài liệu sau: [https://docs.zeek.org/en/master/logs/index.html](https://docs.zeek.org/en/master/logs/index.html)

Đáng chú ý là với cấu hình mặc định, Zeek nén các log file bằng gzip mỗi giờ. Các log cũ hơn sau đó được chuyển vào một thư mục đặt tên theo định dạng `YYYY-MM-DD`. Khi làm việc với các log đã nén này, các công cụ thay thế như `gzcat` để in log hoặc `zgrep` để tìm kiếm trong log sẽ rất hữu dụng.

Bạn có thể tìm ví dụ về cách làm việc với log Zeek nén gzip tại link này: [https://blog.rapid7.com/2016/06/02/working-with-bro-logs-queries-by-example/](https://blog.rapid7.com/2016/06/02/working-with-bro-logs-queries-by-example/)

Như đã nói ở trên, khi làm việc với log file của Zeek, ta có thể dùng các lệnh Unix có sẵn như cat hoặc grep. Tuy nhiên, Zeek cũng cung cấp một công cụ chuyên dụng tên là `zeek-cut` để xử lý log file. Tiện ích này nhận log file của Zeek qua standard input thông qua pipeline hoặc chuyển hướng luồng (stream redirection), rồi xuất các cột được chỉ định ra standard output.

Nếu bạn muốn tìm hiểu các ví dụ, use case của Zeek và học những điều cơ bản về viết Zeek script, hãy xem link sau: [https://docs.zeek.org/en/stable/examples/index.html](https://docs.zeek.org/en/stable/examples/index.html)

Để xem hướng dẫn bắt đầu nhanh (quick start) với Zeek, tham khảo link sau: [https://docs.zeek.org/en/stable/quickstart/index.html](https://docs.zeek.org/en/stable/quickstart/index.html)

## Các tính năng chính của Zeek

Các tính năng chính làm nên hiệu quả của Zeek gồm:
- Ghi log toàn diện các hoạt động mạng
- Phân tích các giao thức tầng ứng dụng (không phụ thuộc port, bao gồm các giao thức như HTTP, DNS, FTP, SMTP, SSH, SSL, v.v.)
- Khả năng kiểm tra nội dung file được trao đổi qua các giao thức tầng ứng dụng
- Hỗ trợ IPv6
- Phát hiện và phân tích tunnel
- Khả năng thực hiện kiểm tra tính hợp lệ (sanity check) trong quá trình phân tích giao thức
- So khớp mẫu (pattern matching) kiểu IDS
- Ngôn ngữ scripting mạnh mẽ, hiểu biết về miền mạng (domain-aware), cho phép diễn đạt các tác vụ phân tích tuỳ ý và quản lý trạng thái mạng theo thời gian
- Giao tiếp xuất ra log ASCII có cấu trúc tốt theo mặc định và cung cấp các backend thay thế cho ElasticSearch và DataSeries
- Tích hợp dữ liệu đầu vào bên ngoài vào quá trình phân tích theo thời gian thực
- Thư viện C bên ngoài để chia sẻ event của Zeek với các chương trình khác
- Khả năng kích hoạt các process bên ngoài tuỳ ý ngay từ trong ngôn ngữ scripting
