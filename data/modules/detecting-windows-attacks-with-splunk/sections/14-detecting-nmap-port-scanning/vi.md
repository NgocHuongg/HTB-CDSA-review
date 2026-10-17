# Detecting Nmap Port Scanning (Phát hiện quét cổng bằng Nmap)

`Port scanning with Nmap` là một kỹ thuật chủ chốt trong bộ công cụ của cả kẻ tấn công lẫn pentester. Về bản chất, khi dùng Nmap, ta thăm dò các hệ thống trong mạng để tìm cổng mở (open port) — đây là những "cánh cổng" mà dữ liệu đi vào và đi ra khỏi một hệ thống. Có thể ví các cổng mở như những cánh cửa có thể đang không khóa trong một tòa nhà — những cánh cửa mà kẻ tấn công có khả năng lợi dụng để xâm nhập.

Khi dùng Nmap để quét cổng, về cơ bản ta đang khởi tạo một loạt yêu cầu kết nối. Ta thử thiết lập TCP handshake một cách có hệ thống với từng cổng trong không gian địa chỉ của mục tiêu. Nếu kết nối thành công, điều đó cho thấy cổng đang mở. Đây là lúc mọi thứ trở nên thú vị. Khi ta kết nối tới một cổng mở, dịch vụ đang lắng nghe trên cổng đó có thể gửi lại một "banner" — về cơ bản đây là một chút dữ liệu cho ta biết dịch vụ nào đang chạy, và có khi còn cho biết cả phiên bản đang chạy.

Nhưng hãy làm rõ một hiểu lầm — khi nói Nmap gửi dữ liệu tới cổng đang quét, thực ra ta không hề gửi dữ liệu thật nào. Ngoài bản thân TCP handshake, payload của các gói tin Nmap gửi đi bằng không. Ta không gửi thêm dữ liệu nào; ta chỉ đang cố khởi tạo một kết nối.

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

- **Thư mục liên quan**: `/home/htb-student/module_files/cobaltstrike_beacon`
- **Splunk Index liên quan**: `cobaltstrike_beacon`
- **Splunk Sourcetype liên quan**: `bro:conn:json`

---

## Phát hiện quét cổng Nmap bằng Splunk & Zeek log

Bây giờ hãy cùng tìm hiểu cách nhận diện quét cổng bằng Nmap với Splunk và Zeek log.

```shell-session
index="cobaltstrike_beacon" sourcetype="bro:conn:json" orig_bytes=0 dest_ip IN (192.168.0.0/16, 172.16.0.0/12, 10.0.0.0/8) 
| bin span=5m _time 
| stats dc(dest_port) as num_dest_port by _time, src_ip, dest_ip 
| where num_dest_port >= 3
```

![Công cụ phân tích log hiển thị một search query cho các event beacon Cobalt Strike. Hiển thị bốn event với các cột time, IP nguồn, IP đích và số lượng cổng đích.](images/104.png)

**Phân tích search**:

- `index="cobaltstrike_beacon`": Giới hạn search trong các log được lưu ở index `cobaltstrike_beacon`.
- `orig_bytes=0`: Phần này của bộ lọc search tập trung vào các event mạng mà số byte gốc (original bytes) được gửi đi bằng `zero`. 
- `dest_ip IN (192.168.0.0/16, 172.16.0.0/12, 10.0.0.0/8)`: Giới hạn search trong các event mạng có địa chỉ IP đích nằm trong các dải địa chỉ IP private, vốn thường được dùng trong mạng nội bộ.
- `| bin span=5m _time`: Lệnh này chia các event vào các khoảng `5` phút dựa trên field `_time`, tức timestamp của mỗi event.
- `| stats dc(dest_port) as num_dest_port by _time, src_ip, dest_ip`: Lệnh `stats` được dùng để tổng hợp dữ liệu. Hàm `dc(dest_port)` đếm số lượng cổng đích riêng biệt (distinct) được truy cập cho mỗi tổ hợp `_time`, `src_ip` và `dest_ip`. Kết quả được lưu vào một field mới tên là `num_dest_port`.
- `| where num_dest_port >= 3`: Phần này của search lọc kết quả để chỉ hiển thị những bản ghi có số lượng cổng đích riêng biệt (`num_dest_port`) từ `three` trở lên. Điều này dựa trên giả định rằng việc quét từ ba cổng trở lên trong một khoảng thời gian ngắn là dấu hiệu tiềm tàng của một cuộc quét cổng.
