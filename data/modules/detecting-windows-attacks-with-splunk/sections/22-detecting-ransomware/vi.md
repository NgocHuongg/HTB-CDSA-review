# Detecting Ransomware (Phát hiện ransomware)

`Ransomware` tận dụng hàng loạt kỹ thuật để đạt được mục tiêu của chúng. Trong phần phân tích sau, ta sẽ tìm hiểu hai trong số các phương pháp đó, xem xét cách chúng hoạt động bên trong và giải thích cách phát hiện chúng thông qua giám sát mạng.

1. `File Overwrite Approach`: Ransomware dùng chiến thuật này bằng cách truy cập file qua giao thức SMB, mã hoá chúng, rồi ghi đè trực tiếp file gốc bằng phiên bản đã mã hoá (cũng qua giao thức SMB). Những kẻ đứng sau ransomware ưa chuộng phương pháp này vì tính hiệu quả: nó cần ít thao tác hơn và để lại ít dấu vết hoạt động hơn. Để phát hiện cách tiếp cận này, các đội bảo mật nên tìm kiếm các thao tác ghi đè file quá mức trên hệ thống.
	![Lưu đồ quá trình mã hoá file: Start, liệt kê file (Enumerate files), đọc file (SMB::FILE_OPEN), mã hoá file trong bộ nhớ, ghi file (SMB::FILE_RENAME), lặp lại cho cùng file đó.](images/121.png)

2. `File Renaming Approach`: Trong cách tiếp cận này, kẻ đứng sau ransomware dùng giao thức SMB để đọc file, sau đó mã hoá chúng, và cuối cùng đổi tên các file đã mã hoá bằng cách thêm một phần mở rộng (extension) đặc trưng (cũng qua giao thức SMB), thường là dấu hiệu nhận biết dòng ransomware. Việc đổi tên báo hiệu rằng các file đã bị "bắt làm con tin", giúp analyst và quản trị viên dễ nhận ra cuộc tấn công hơn. Việc phát hiện bao gồm giám sát số lượng bất thường các file bị đổi tên với cùng một extension, đặc biệt là các extension gắn với những biến thể ransomware đã biết.
	![Lưu đồ quá trình mã hoá file: Start, liệt kê file (Enumerate files), đọc file (SMB::FILE_OPEN), mã hoá file trong bộ nhớ, ghi file với extension cụ thể (SMB::FILE_RENAME), lặp lại.](images/122.png)

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

- **Thư mục liên quan**: `/home/htb-student/module_files/ransomware_open_rename_sodinokibi`
- **Splunk Index liên quan**: `ransomware_open_rename_sodinokibi`
- **Splunk Sourcetype liên quan**: `bro:smb_files:json`

---

- **Thư mục liên quan**: `/home/htb-student/module_files/ransomware_new_file_extension_ctbl_ocker`
- **Splunk Index liên quan**: `ransomware_new_file_extension_ctbl_ocker`
- **Splunk Sourcetype liên quan**: `bro:smb_files:json`

---

## Phát hiện Ransomware bằng Splunk & Zeek Logs (ghi đè quá mức)

Giờ hãy cùng tìm hiểu cách nhận diện ransomware bằng Splunk và Zeek logs.

```shell-session
index="ransomware_open_rename_sodinokibi" sourcetype="bro:smb_files:json" 
| where action IN ("SMB::FILE_OPEN", "SMB::FILE_RENAME")
| bin _time span=5m
| stats count by _time, source, action
| where count>30 
| stats sum(count) as count values(action) dc(action) as uniq_actions by _time, source
| where uniq_actions==2 AND count>100
```

![Công cụ phân tích log hiển thị một search query cho các event ransomware có action SMB::FILE_OPEN và SMB::FILE_RENAME. Hiển thị một event với các cột thời gian, source, count, các giá trị action và unique actions.](images/123.png)

---

## Phát hiện Ransomware bằng Splunk & Zeek Logs (đổi tên quá mức với cùng một extension)

Giờ hãy cùng tìm hiểu cách nhận diện ransomware bằng Splunk và Zeek logs.

```shell-session
index="ransomware_new_file_extension_ctbl_ocker" sourcetype="bro:smb_files:json" action="SMB::FILE_RENAME" 
| bin _time span=5m
| rex field="name" "\.(?<new_file_name_extension>[^\.]*$)"
| rex field="prev_name" "\.(?<old_file_name_extension>[^\.]*$)"
| stats count by _time, id.orig_h, id.resp_p, name, source, old_file_name_extension, new_file_name_extension,
| where new_file_name_extension!=old_file_name_extension
| stats count by _time, id.orig_h, id.resp_p, source, new_file_name_extension
| where count>20
| sort -count
```

![Công cụ phân tích log hiển thị một search query cho các event ransomware có action SMB::FILE_RENAME. Hiển thị một event với các cột thời gian, IP nguồn (origin), IP phản hồi (response), source, extension tên file cũ và mới, và count.](images/124.png)

**Phân tích search**:

- `index="ransomware_new_file_extension_ctbl_ocker" sourcetype="bro:smb_files:json" action="SMB::FILE_RENAME"`: Dòng này lọc các event dựa trên index `ransomware_new_file_extension_ctbl_ocker`, một sourcetype cụ thể `bro:smb_files:json`, và action `SMB::FILE_RENAME`. Điều này giúp thu hẹp tìm kiếm vào các action đổi tên file SMB trong index đã chỉ định.
- `| bin _time span=5m`: Dòng này nhóm các event vào các khoảng thời gian (time bin) `5` phút.
- `| rex field="name" "\.(?<new_file_name_extension>[^\.]*$)"`: Dòng này dùng biểu thức chính quy (regex) để trích xuất extension của file từ field `name` và gán nó vào field mới `new_file_name_extension`.
- `| rex field="prev_name" "\.(?<old_file_name_extension>[^\.]*$)"`: Tương tự, dòng này trích xuất extension của file từ field `prev_name` và gán nó vào field mới `old_file_name_extension`.
- `| stats count by _time, id.orig_h, id.resp_p, name, source, old_file_name_extension, new_file_name_extension`: Dòng này tổng hợp các event và đếm số lần xuất hiện dựa trên nhiều field, gồm thời gian, host khởi tạo (originating host), cổng phản hồi (responding port), tên file, source, extension cũ và extension mới của file.
- `| where new_file_name_extension!=old_file_name_extension`: Dòng này loại bỏ các event có extension mới giống với extension cũ.
- `| stats count by _time, id.orig_h, id.resp_p, source, new_file_name_extension`: Dòng này đếm các event còn lại theo thời gian, host khởi tạo, cổng phản hồi, source và extension mới của file.
- `| where count>20`: Dòng này loại bỏ mọi kết quả có ít hơn `21` lần đổi tên file trong một time bin `5` phút.
- `| sort -count`: Dòng này sắp xếp kết quả theo thứ tự giảm dần dựa trên số lần đổi tên file.

---

**Lưu ý**: Có thể tìm các extension đã biết liên quan đến ransomware trong các nguồn dưới đây.

- [https://docs.google.com/spreadsheets/d/e/2PACX-1vRCVzG9JCzak3hNqqrVCTQQIzH0ty77BWiLEbDu-q9oxkhAamqnlYgtQ4gF85pF6j6g3GmQxivuvO1U/pubhtml](https://docs.google.com/spreadsheets/d/e/2PACX-1vRCVzG9JCzak3hNqqrVCTQQIzH0ty77BWiLEbDu-q9oxkhAamqnlYgtQ4gF85pF6j6g3GmQxivuvO1U/pubhtml)
- [https://github.com/corelight/detect-ransomware-filenames](https://github.com/corelight/detect-ransomware-filenames)
- [https://fsrm.experiant.ca/](https://fsrm.experiant.ca/)
