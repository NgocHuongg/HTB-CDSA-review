# Detecting Golden Tickets (Phát hiện Golden Ticket)

Trước đó trong section này, ta đã đề cập tới `Golden Tickets`. Đáng tiếc là Zeek không có khả năng nhận diện Golden Ticket một cách đáng tin cậy. Vì vậy, ta sẽ tập trung search trên Splunk vào việc phát hiện các bất thường (anomaly) trong quá trình tạo Kerberos ticket.

Trong một cuộc tấn công Golden Ticket hoặc Pass-the-Ticket, kẻ tấn công bỏ qua quy trình xác thực Kerberos thông thường, vốn bao gồm các thông điệp AS-REQ và AS-REP.

Trong quy trình xác thực Kerberos thông thường, client bắt đầu bằng việc gửi thông điệp AS-REQ (Authentication Service Request) tới Key Distribution Center (KDC), cụ thể là tới Authentication Service (AS), để yêu cầu một Ticket Granting Ticket (TGT). KDC phản hồi bằng thông điệp AS-REP (Authentication Service Response), trong đó chứa TGT nếu thông tin đăng nhập của client hợp lệ. Sau đó client có thể dùng TGT để yêu cầu service ticket (Ticket Granting Service ticket, hay TGS) cho các dịch vụ cụ thể trong mạng.

- Trong tấn công Golden Ticket, kẻ tấn công tạo ra một TGT giả mạo (forged), cho phép chúng truy cập bất kỳ dịch vụ nào trong mạng mà không cần xác thực với KDC. Vì đã có TGT giả mạo, kẻ tấn công có thể yêu cầu trực tiếp TGS ticket mà không phải đi qua quy trình AS-REQ và AS-REP.
- Trong tấn công Pass-the-Ticket, kẻ tấn công đánh cắp một TGT hoặc TGS ticket hợp lệ từ một người dùng hợp pháp (ví dụ: bằng cách xâm nhập máy của họ), rồi dùng ticket đó để truy cập các dịch vụ trong mạng như thể chính là người dùng hợp pháp. Một lần nữa, vì kẻ tấn công đã có sẵn ticket hợp lệ, chúng có thể bỏ qua quy trình AS-REQ và AS-REP.

#### Lưu lượng Golden Ticket trông như thế nào

![Bản bắt gói tin mạng hiển thị các gói Kerberos TGS-REQ và TGS-REP. Các cột gồm time, source, destination, protocol, length và info.](images/111.png)

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Bây giờ hãy kéo xuống cuối section này và bấm vào "Click here to spawn the target system!". Sau đó, truy cập giao diện Splunk tại https://[Target IP]:8000 và mở ứng dụng Splunk Search & Reporting. Phần lớn các search được trình bày từ đây cho tới cuối section này có thể được thực hiện lại bên trong target, giúp nắm bắt các chủ đề được trình bày một cách toàn diện hơn. </p>
    </div>
</div>

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Ngoài ra, ta có thể truy cập target đã khởi tạo qua RDP như hướng dẫn dưới đây. Mọi file, log và file PCAP liên quan đến các cuộc tấn công được đề cập đều nằm trong các thư mục /home/htb-student và /home/htb-student/module_files. </p>
    </div>
</div>

```shell-session
[!bash!]$ xfreerdp /u:htb-student /p:'HTB_@cademy_stdnt!' /v:[Target IP] /dynamic-resolution
```

#### Bằng chứng liên quan

- **Thư mục liên quan**: `/home/htb-student/module_files/golden_ticket_attack`
- **Splunk Index liên quan**: `golden_ticket_attack`
- **Splunk Sourcetype liên quan**: `bro:kerberos:json`

---

## Phát hiện Golden Ticket bằng Splunk & Zeek log

Bây giờ hãy cùng tìm hiểu cách nhận diện Golden Ticket bằng Splunk và Zeek log.

```shell-session
index="golden_ticket_attack" sourcetype="bro:kerberos:json"
| where client!="-"
| bin _time span=1m 
| stats values(client), values(request_type) as request_types, dc(request_type) as unique_request_types by _time, id.orig_h, id.resp_h
| where request_types=="TGS" AND unique_request_types==1
```

![Công cụ phân tích log hiển thị một search query cho các event tấn công golden ticket. Hiển thị hai event với các cột time, IP nguồn, IP phản hồi, client values, request types và unique request types.](images/112.png)

**Phân tích search**:

- `index="golden_ticket_attack" sourcetype="bro:kerberos:json"`: Dòng này chỉ định nguồn dữ liệu mà query tìm kiếm. Nó tìm các event trong index `golden_ticket_attack` có `sourcetype` (định dạng dữ liệu) là `bro:kerberos:json`.
- `| where client!="-"`: Dòng này loại bỏ các event có field `client` bằng `-`. Mục đích là giảm nhiễu (noise) trong dữ liệu bằng cách loại các event không có thông tin client.
- `| bin _time span=1m`: Dòng này chia dữ liệu thành các khoảng `one-minute` (một phút) dựa trên field `_time`, tức timestamp của mỗi event. Việc này dùng để phân tích các mẫu hoạt động trong từng cửa sổ một phút.
- `| stats values(client), values(request_type) as request_types, dc(request_type) as unique_request_types by _time, id.orig_h, id.resp_h`: Dòng này tổng hợp dữ liệu theo phút, địa chỉ IP nguồn (`id.orig_h`) và địa chỉ IP đích (`id.resp_h`). Với mỗi tổ hợp của các field nhóm này, nó tính:
	- `values(client)`: Tất cả các giá trị client riêng biệt gắn với các event.
	- `values(request_type) as request_types`: Tất cả các loại request riêng biệt gắn với các event.
	- `dc(request_type) as unique_request_types`: Số lượng loại request riêng biệt (distinct count).
- `| where request_types=="TGS" AND unique_request_types==1`: Dòng này lọc kết quả để chỉ hiển thị những trường hợp mà loại request duy nhất là `TGS` (Ticket Granting Service) và chỉ có một loại request riêng biệt.
