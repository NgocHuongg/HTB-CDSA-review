# Disk Forensics (Điều tra ổ đĩa)

Như đã nhấn mạnh trước đó, việc tuân thủ thứ tự về độ khả biến của dữ liệu (order of volatility) là rất quan trọng. Ta bắt buộc phải xem xét kỹ từng byte để phát hiện những dấu vết tinh vi mà kẻ tấn công để lại. Sau khi đã tìm hiểu memory forensics, giờ hãy chuyển sự chú ý sang lĩnh vực `disk forensics` (kiểm tra và phân tích disk image – ảnh ổ đĩa).

Nhiều công cụ disk forensics, cả thương mại lẫn mã nguồn mở, đều được tích hợp rất nhiều tính năng. Tuy nhiên, với các đội incident response, một số chức năng đặc biệt nổi bật:
- `File Structure Insight` (nắm bắt cấu trúc file): Khả năng duyệt và xem cây phân cấp file của ổ đĩa là rất quan trọng. Các công cụ forensic hàng đầu cần hiển thị cấu trúc này, cho phép truy cập nhanh tới các file cụ thể, đặc biệt là ở những vị trí đã biết trên một hệ thống bị nghi ngờ.
- `Hex Viewer` (trình xem hex): Trong những lúc cần soi thật kỹ dữ liệu của mình, việc xem file ở dạng thập lục phân (hexadecimal) là điều thiết yếu. Khả năng này đặc biệt hữu ích khi xử lý các mối đe doạ như malware được may đo riêng (tailored malware) hoặc các exploit đặc thù.
- `Web Artifacts Analysis` (phân tích artifact web): Vì có rất nhiều dữ liệu người dùng gắn với hoạt động trên web, một công cụ forensic phải sàng lọc và trình bày dữ liệu này một cách hiệu quả. Đây là yếu tố thay đổi cuộc chơi khi bạn đang ghép nối các sự kiện dẫn tới việc người dùng truy cập vào một website độc hại.
- `Email Carving` (trích xuất email): Đôi khi, dấu vết dẫn tới các mối đe doạ nội bộ. Có thể đó là một nhân viên có ý đồ xấu, hoặc chỉ là ai đó sơ suất. Trong những trường hợp như vậy, email thường nắm giữ chìa khoá. Một công cụ có thể trích xuất và trình bày dữ liệu này sẽ giúp quy trình gọn gàng hơn, giúp việc kết nối các manh mối trở nên dễ dàng hơn.
- `Image Viewer` (trình xem ảnh): Đôi khi, chính các hình ảnh được lưu trên hệ thống có thể tự kể một câu chuyện. Dù là để kiểm tra việc tuân thủ chính sách hay để điều tra sâu hơn, việc có sẵn một trình xem ảnh tích hợp là một lợi thế lớn.
- `Metadata Analysis` (phân tích metadata): Những chi tiết như timestamp tạo file, hash và vị trí trên ổ đĩa có thể vô cùng giá trị. Hãy xét một tình huống trong đó bạn đang cố khớp thời điểm khởi chạy một ứng dụng với một alert về malware. Những mối tương quan như vậy có thể là mắt xích then chốt trong cuộc điều tra của bạn.

Đó là lúc [Autopsy](https://www.autopsy.com/) xuất hiện: một nền tảng forensic thân thiện với người dùng, được xây dựng trên bộ công cụ mã nguồn mở Sleuth Kit. Nó có nhiều tính năng tương tự như các đối thủ thương mại: đánh giá timeline, tìm kiếm theo từ khoá, truy xuất artifact web và email, cùng khả năng sàng lọc kết quả dựa trên hash của các file độc hại đã biết.

Sau khi đã nạp một forensic image và xử lý dữ liệu, bạn sẽ thấy các artifact forensic được sắp xếp gọn gàng ở bảng điều khiển bên cạnh (side panel). Từ đây, bạn có thể:

![Giao diện Autopsy hiển thị các data source và artifact, gồm các chế độ xem file, các data artifact như Chromium extension, và các kết quả phân tích với keyword hit.](images/image16.png)

- Đi sâu vào `Data Sources` để khám phá các file và thư mục.
	![Trình duyệt file hiển thị các data source với các thư mục: OrphanFiles, CarvedFiles, Extend, Recycle.Bin, $Unalloc, Config.Msi, Documents and Settings, PerfLogs, Program Files, Program Files (x86), ProgramData, Recovery, System Volume Information, Tools, Users, Windows.](images/image1_.png)
- Kiểm tra `Web Artifacts`.
	![Giao diện Autopsy hiển thị các data artifact, tập trung vào 'Web Cache', liệt kê URL, domain và ngày tạo từ một tìm kiếm theo từ khoá 'powershell.exe'.](images/image80.png)
- Kiểm tra `Attached Devices`.
	![Giao diện Autopsy hiển thị các data artifact 'USB Device Attached', liệt kê hãng sản xuất, model, ID và timestamp của các thiết bị đã kết nối.](images/image8_.png)
- Khôi phục `Deleted Files`.
	![Giao diện Autopsy hiển thị các data source và danh sách file đã bị xoá, với tên file, thời gian sửa đổi và vị trí, từ một tìm kiếm theo từ khoá 'powershell.exe'.](images/image51.png)
- Thực hiện `Keyword Searches`.
	![Giao diện Autopsy hiển thị các data source và một tìm kiếm theo từ khoá 'powershell.exe' với tuỳ chọn so khớp chuỗi con (substring match), liệt kê 'fulldisk.raw.001' là data source.](images/image75.png)
	
	![Giao diện Autopsy hiển thị một tìm kiếm theo từ khoá 'powershell.exe', liệt kê các file như Windows PowerShell.lnk, NTUSER.DAT.LOG1, $LogFile, kèm vị trí và thời gian sửa đổi.](images/image23.png)
- Dùng `Keyword Lists` cho các tìm kiếm có mục tiêu.
	![Giao diện Autopsy hiển thị các keyword list với các tuỳ chọn Phone Numbers, IP Addresses, Email Addresses, URLs và Credit Card Numbers, với 'fulldisk.raw.001' là data source.](images/image72.png)
	
	![Giao diện Autopsy hiển thị kết quả tìm kiếm theo từ khoá 'powershell.exe', liệt kê các file như f0150936.dll và f0250748.dll, với vị trí và thông tin địa chỉ IP được làm nổi bật.](images/image52.png)
- Tiến hành `Timeline Analysis` để lập bản đồ các sự kiện.
	![Timeline Editor hiển thị các sự kiện của các ứng dụng như Notepad++, WinRAR, Process Hacker và Google Chrome, với số lượng trực quan và chi tiết từ ngày 10 tháng 8 năm 2023.](images/image99.png)
	
---

Chúng ta sẽ sử dụng Autopsy rất nhiều trong section "Practical Digital Forensics Scenario" sắp tới.
