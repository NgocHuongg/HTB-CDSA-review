# Skills Assessment (Bài đánh giá kỹ năng)


## Hunting Stuxbot (Vòng 2)

Những chi tiết mới được phát hiện gần đây đã làm sáng tỏ chiến lược hoạt động của phiên bản mới nhất của Stuxbot.

1. Các phiên bản mới nhất của Stuxbot đang lợi dụng thư mục `C:\Users\Public` làm nơi trung chuyển để triển khai các công cụ bổ sung.
2. Các phiên bản mới nhất của Stuxbot đang sử dụng registry run key làm cơ chế đảm bảo sự hiện diện lâu dài (persistence) của chúng trong hệ thống bị lây nhiễm.
3. Các phiên bản mới nhất của Stuxbot đang sử dụng PowerShell Remoting để lateral movement trong mạng và giành quyền truy cập vào các domain controller.

---

## Dữ liệu có sẵn

Chiến lược an ninh mạng được triển khai dựa trên việc sử dụng Elastic stack làm giải pháp SIEM. Thông qua chức năng "Discover", chúng ta có thể xem log từ nhiều nguồn. Các nguồn này bao gồm:
- `Windows audit logs` (được phân loại dưới index pattern windows*)
- `System Monitor (Sysmon) logs` (cũng thuộc index pattern windows*, tìm hiểu thêm về Sysmon [tại đây](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon))
- `PowerShell logs` (cũng được index dưới windows*, tìm hiểu thêm về PowerShell log [tại đây](https://www.splunk.com/en_us/blog/security/hunting-for-malicious-powershell-using-script-block-logging.html))
- `Zeek logs`, [một công cụ giám sát an ninh mạng](https://www.elastic.co/guide/en/beats/filebeat/current/exported-fields-zeek.html) (được phân loại dưới index pattern zeek*)

---

## Nhiệm vụ

Di chuyển xuống cuối section này và bấm vào `Click here to spawn the target system!`

Bây giờ, truy cập `http://[Target IP]:5601`, bấm vào nút bật/tắt thanh điều hướng bên cạnh, rồi bấm vào "Discover". Sau đó, bấm vào biểu tượng lịch, chọn "last 15 years" và bấm "Apply".

`Hunt 1`: Tạo một KQL query để hunting ["Lateral Tool Transfer"](https://attack.mitre.org/techniques/T1570/) tới `C:\Users\Public`. Nhập nội dung của field `user.name` trong document liên quan tới một công cụ được chuyển sang có tên bắt đầu bằng "r" làm câu trả lời.

`Hunt 2`: Tạo một KQL query để hunting ["Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder"](https://attack.mitre.org/techniques/T1547/001/). Nhập nội dung của field `registry.value` trong document liên quan tới hành động persistence dựa trên registry đầu tiên làm câu trả lời.

`Hunt 3`: Tạo một KQL query để hunting ["PowerShell Remoting for Lateral Movement"](https://www.ired.team/offensive-security/lateral-movement/t1028-winrm-for-lateral-movement). Nhập nội dung của field `winlog.user.name` trong document liên quan tới lateral movement dựa trên PowerShell remoting nhắm tới DC1.

---
