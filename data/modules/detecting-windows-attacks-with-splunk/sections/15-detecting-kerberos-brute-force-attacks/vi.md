# Detecting Kerberos Brute Force Attacks (Phát hiện tấn công brute force Kerberos)

Khi thực hiện `Kerberos-based user enumeration` (liệt kê người dùng dựa trên Kerberos), kẻ tấn công gửi một thông điệp AS-REQ (Authentication Service Request) tới Key Distribution Center (KDC) — thành phần chịu trách nhiệm xử lý xác thực Kerberos. Thông điệp này chứa username mà chúng đang muốn kiểm tra. Chúng theo dõi kỹ phản hồi nhận được, vì phản hồi tiết lộ thông tin giá trị về việc tài khoản người dùng được chỉ định có tồn tại hay không.

Một username hợp lệ sẽ khiến server `return a TGT` (trả về TGT) hoặc báo lỗi như `KRB5KDC_ERR_PREAUTH_REQUIRED`, cho biết cần preauthentication (xác thực trước). Ngược lại, một username không hợp lệ sẽ nhận về mã lỗi Kerberos `KRB5KDC_ERR_C_PRINCIPAL_UNKNOWN` trong thông điệp AS-REP (Authentication Service Response). Bằng cách xem xét các phản hồi cho thông điệp AS-REQ của mình, kẻ tấn công có thể nhanh chóng xác định username nào hợp lệ trên hệ thống mục tiêu.

#### Tấn công brute force Kerberos trông như thế nào trên đường truyền

![Bản bắt gói tin mạng hiển thị lưu lượng Kerberos với các request AS-REQ và KRB Error: KRB5KDC_ERR_C_PRINCIPAL_UNKNOWN. Các cột gồm time, source, destination, protocol, length và info.](images/107.png)

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

- **Thư mục liên quan**: `/home/htb-student/module_files/kerberos_bruteforce`
- **Splunk Index liên quan**: `kerberos_bruteforce`
- **Splunk Sourcetype liên quan**: `bro:kerberos:json`

---

## Phát hiện tấn công brute force Kerberos bằng Splunk & Zeek log

Bây giờ hãy cùng tìm hiểu cách nhận diện tấn công brute force Kerberos bằng Splunk và Zeek log.

```shell-session
index="kerberos_bruteforce" sourcetype="bro:kerberos:json"
error_msg!=KDC_ERR_PREAUTH_REQUIRED
success="false" request_type=AS
| bin _time span=5m
| stats count dc(client) as "Unique users" values(error_msg) as "Error messages" by _time, id.orig_h, id.resp_h
| where count>30
```

![Công cụ phân tích log hiển thị một search query cho các event brute force Kerberos. Hiển thị một event với các cột time, IP nguồn, IP phản hồi, count, unique users và error messages.](images/108.png)
