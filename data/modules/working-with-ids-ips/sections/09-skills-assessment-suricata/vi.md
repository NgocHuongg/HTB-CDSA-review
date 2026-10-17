# Skills Assessment - Suricata (Bài đánh giá kỹ năng - Suricata)

## Bài tập phát triển Suricata rule: Phát hiện thực thi WMI (thông qua [WMIExec](https://github.com/fortra/impacket/blob/master/examples/wmiexec.py))
 
**Nguồn PCAP**: [https://github.com/elcabezzonn/Pcaps](https://github.com/elcabezzonn/Pcaps)

**Mô tả tấn công và các điểm có thể phát hiện**: [https://labs.withsecure.com/publications/attack-detection-fundamentals-discovery-and-lateral-movement-lab-5](https://labs.withsecure.com/publications/attack-detection-fundamentals-discovery-and-lateral-movement-lab-5)

`Windows Management Instrumentation (WMI)` là một tính năng mạnh mẽ của hệ điều hành Windows, cho phép thực hiện các tác vụ quản trị như thực thi code hoặc quản lý thiết bị, cả cục bộ (local) lẫn từ xa (remote). Như bạn có thể đoán, đây có thể là một công cụ rất hấp dẫn đối với những kẻ tấn công muốn thực hiện các hoạt động độc hại từ xa.

Để phát hiện việc thực thi WMI (thông qua `wmiexec`) qua mạng, ta cần tập trung vào các giao thức `SMB (Server Message Block)` và `DCOM (Distributed Component Object Model)` — đây là những phương tiện chính để thực hiện thực thi WMI từ xa.

Một phương pháp kẻ tấn công có thể dùng là tạo một `Win32_Process` thông qua dịch vụ WMI. Trong trường hợp này, kẻ tấn công sẽ tạo một instance của `Win32_ProcessStartup`, thiết lập các thuộc tính (property) của nó để kiểm soát môi trường của process mới, rồi gọi method `Create` để khởi chạy một process mới như `cmd.exe` hoặc `powershell.exe`.

---

Hãy xem lại tài liệu tham khảo đã dẫn ở trên, nơi bàn về các dấu vết mạng (network trace) do việc thực thi WMI tạo ra, rồi tiếp tục trả lời câu hỏi bên dưới.
