# Skills Assessment (Bài đánh giá kỹ năng)

Trong bài đánh giá kỹ năng, bạn đóng vai một junior incident responder và cần thực hiện một số nhiệm vụ.

Hãy kéo xuống cuối section này và click vào "`Click here to spawn the target system!`". Sau đó, mở trang web TheHive tại "Target IP:9000" trên cổng 9000 bằng thông tin đăng nhập được cung cấp để xem các alert.

## Triage các alert

TheHive đã được nạp sẵn các alert liên quan tới vụ breach (xâm phạm) Insights Nexus. Bạn được yêu cầu triage (phân loại) các alert này, bắt đầu với:

- Nhiệm vụ 1: Tạo một case mới trong TheHive. Tìm tất cả các alert dành riêng cho kịch bản breach Insights Nexus và liên kết (link) các alert đó vào case. Bài tập này giúp bạn làm quen với việc làm việc với alert và case trong TheHive.
- Nhiệm vụ 2: Thực hiện triage, làm giàu dữ liệu (enrichment) và tương quan (correlation) trong TheHive. Trong phần ghi chú (notes) của một alert, bạn có thể thêm thông tin hữu ích phục vụ enrichment.
- Nhiệm vụ 3: Một trong các alert liên quan tới Insights Nexus trong TheHive có chứa một số thông tin trong phần notes. Output của lệnh netstat cho thấy có kết nối tới các địa chỉ IP bên ngoài. Bạn có thể xác minh phát hiện này.

![Giao diện case của TheHive hiển thị panel “Comments” chứa một đoạn output netstat -ano được dán vào, lấy từ host 10.10.5.23. Các dòng gồm TCP 127.0.0.1:5357 LISTENING, TCP 10.10.5.23:139 LISTENING, kết nối TCP outbound 10.10.5.23:52344 → 198.5.x.x:443 ESTABLISHED, 10.10.5.23:52345 → 203.0.x.x:4444 ESTABLISHED, UDP 10.10.5.23:123 đang listening, và các kết nối SMB tới 10.10.5.17:445 và 10.10.5.18:445 (ESTABLISHED/TIME_WAIT). Thanh trên cùng hiển thị các nút điều khiển (Create Case, ngôn ngữ EN-UK, người dùng HTB-ANALYST).](images/ir-netstat.png)

Output này được thu thập sau khi máy host đã gia nhập lại domain sau quá trình recovery (khôi phục). Tuy nhiên, máy vẫn đang kết nối tới một địa chỉ IP. Analyst đã thêm thông tin này vào phần comment của alert.

Có thêm một số câu hỏi ở cuối section này.

## Ánh xạ vào Cyber Kill Chain

Một người dùng mở một file đính kèm, file này thực thi một downloader ghi một file .exe vào `%AppData%`, tạo một registry key `Run`, và sau đó nạp `VaultCli.dll` thông qua một công cụ đáng ngờ, tuồn (exfiltrate) thông tin đăng nhập tới một IP bên ngoài. Nhiệm vụ của bạn là ánh xạ (map) từng bước của cuộc tấn công vào phase tương ứng của kill chain.

- Nhiệm vụ 1: Ánh xạ hoạt động tải file, registry và exfiltration sang MITRE ATT&CK.
- Nhiệm vụ 2: Kiểm tra alert liên quan tới Mimikatz trong TheHive và xác định MITRE Technique ID.

## Điều tra các log đã thu thập

- Nhiệm vụ 1: Ngoài ra, bạn được cung cấp một số file event log (cụ thể là `logs-wazuh.zip`). Một trong các nhiệm vụ là decode một số lệnh PowerShell và trích xuất IOC từ chúng.
- Nhiệm vụ 2: Xác định người dùng đã thực thi lệnh PowerShell đáng ngờ.
