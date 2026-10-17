# Detecting Zerologon (Phát hiện Zerologon)

Lỗ hổng `Zerologon`, còn được biết đến là CVE-2020-1472, là một lỗi nghiêm trọng trong cách hiện thực Netlogon Remote Protocol, cụ thể là trong thuật toán mật mã mà giao thức này sử dụng. Kẻ tấn công có thể khai thác lỗ hổng để mạo danh bất kỳ máy tính nào, kể cả domain controller, và thực thi các lời gọi thủ tục từ xa (remote procedure call) dưới danh nghĩa của máy đó. Hãy cùng đi sâu vào chi tiết kỹ thuật của lỗi này.

Cốt lõi của Zerologon là vấn đề mật mã trong cách Netlogon Remote Protocol của Microsoft xác thực người dùng và máy tính trong một Windows domain. Khi một client muốn xác thực với domain controller, nó dùng một giao thức tên là MS-NRPC — một phần của Netlogon — để thiết lập một kênh bảo mật (secure channel).

Trong quá trình này, client và server tạo ra một session key, được tính từ mật khẩu của machine account. Key này sau đó được dùng để suy ra vector khởi tạo (initialization vector – IV) cho chế độ mã hoá AES-CFB8. Trong một cấu hình an toàn, IV phải là duy nhất và ngẫu nhiên cho mỗi lần mã hoá. Tuy nhiên, do giao thức Netlogon được hiện thực sai, IV bị đặt thành một giá trị cố định gồm toàn số 0.

Kẻ tấn công có thể khai thác điểm yếu mật mã này bằng cách thử xác thực với domain controller bằng một session key gồm toàn số 0, qua đó vượt qua (bypass) quá trình xác thực. Điều này cho phép kẻ tấn công thiết lập secure channel với domain controller mà không cần biết mật khẩu của machine account.

Khi kênh này đã được thiết lập, kẻ tấn công có thể dùng hàm NetrServerPasswordSet2 để đổi mật khẩu của computer account thành bất kỳ giá trị nào, kể cả mật khẩu rỗng. Điều này thực chất trao cho kẻ tấn công toàn quyền kiểm soát domain controller và, kéo theo đó, toàn bộ Active Directory domain.

Lỗ hổng Zerologon đặc biệt nguy hiểm vì sự đơn giản và mức độ truy cập mà nó mang lại cho kẻ tấn công. Khai thác lỗi này chỉ cần vài message Netlogon, và có thể thực hiện trong vòng vài giây.

#### Zerologon trông như thế nào từ góc nhìn mạng

![Sơ đồ cho thấy giao tiếp giữa client (máy tính đã join domain) và server (domain controller). Các bước gồm NetrServerReqChallenge, server challenge, NetrServerAuthenticate3 và NetrServerPasswordSet2, dẫn tới việc đặt mật khẩu rỗng. Lặp lại cho đến khi thành công.](images/116.png)

**Nguồn ảnh**: [https://www.trendmicro.com/en_us/what-is/zerologon.html](https://www.trendmicro.com/en_us/what-is/zerologon.html)

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Giờ hãy kéo xuống cuối section này và bấm vào "Click here to spawn the target system!". Sau đó, truy cập giao diện Splunk tại https://[Target IP]:8000 và mở ứng dụng Search & Reporting của Splunk. Phần lớn các tìm kiếm được trình bày từ đây cho đến cuối section này có thể được thực hiện lại bên trong target, giúp nắm vững hơn các chủ đề được trình bày. </p>
    </div>
</div>

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Ngoài ra, ta có thể truy cập target đã spawn qua RDP như hướng dẫn bên dưới. Toàn bộ file, log và file PCAP liên quan đến các cuộc tấn công được đề cập có thể tìm thấy trong các thư mục /home/htb-student và /home/htb-student/module_files. </p>
    </div>
</div>

```shell-session
[!bash!]$ xfreerdp /u:htb-student /p:'HTB_@cademy_stdnt!' /v:[Target IP] /dynamic-resolution
```

#### Bằng chứng liên quan

- **Thư mục liên quan**: `/home/htb-student/module_files/zerologon`
- **Splunk Index liên quan**: `zerologon`
- **Splunk Sourcetype liên quan**: `bro:dce_rpc:json`

---

## Phát hiện Zerologon bằng Splunk & Zeek Logs

Giờ hãy cùng tìm hiểu cách nhận diện Zerologon bằng Splunk và Zeek logs.

```shell-session
index="zerologon" endpoint="netlogon" sourcetype="bro:dce_rpc:json"
| bin _time span=1m
| where operation == "NetrServerReqChallenge" OR operation == "NetrServerAuthenticate3" OR operation == "NetrServerPasswordSet2"
| stats count values(operation) as operation_values dc(operation) as unique_operations by _time, id.orig_h, id.resp_h
| where unique_operations >= 2 AND count>100
```

![Công cụ phân tích log hiển thị một search query cho các event Zerologon. Hiển thị hai event với các cột thời gian, IP nguồn (origin), IP phản hồi (response), count, operation values và unique operations.](images/117.png)
