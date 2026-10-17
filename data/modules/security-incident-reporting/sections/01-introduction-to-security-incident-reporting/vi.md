# Introduction to Security Incident Reporting (Giới thiệu về báo cáo sự cố bảo mật)

Trong bối cảnh ngày nay, câu hỏi không phải là liệu một sự cố bảo mật có xảy ra hay không, mà là khi nào nó sẽ xảy ra. Doanh nghiệp, cơ quan chính phủ và người dùng cá nhân ngày càng phụ thuộc rất nhiều vào công nghệ — thứ đóng vai trò nền tảng cho phần lớn các hoạt động của chúng ta.

Dù sự tiến bộ công nghệ này đã nâng cao hiệu quả vận hành, khả năng tạo doanh thu và năng suất, nó cũng đồng thời làm gia tăng các rủi ro đi kèm. Các nền tảng công nghệ này đã trở thành mảnh đất màu mỡ cho các tác nhân độc hại, được hậu thuẫn bởi cả các thực thể nhà nước lẫn phi nhà nước. Một cơ chế báo cáo sự cố được thiết kế tỉ mỉ và tinh gọn đóng vai trò then chốt trong việc giúp bất kỳ tổ chức nào sẵn sàng đối phó hiệu quả với những mối đe doạ mới nổi này.

Báo cáo sự cố bảo mật (security incident reporting) đóng vai trò cầu nối giữa việc xác định và việc khắc phục (remediation) các mối đe doạ. Nó giúp lưu trữ lại các sự cố trong quá khứ, qua đó tạo ra một kho tư liệu vô giá về những bài học rút ra (lessons learned) từ các sai lầm trước đây. Kho tư liệu này có thể được tích hợp liền mạch vào một chiến lược rộng hơn nhằm phòng ngừa trước và giảm thiểu các mối đe doạ trong tương lai. Trong bối cảnh mối đe doạ (threat landscape) không ngừng biến đổi, một framework báo cáo sự cố toàn diện và nhất quán là điều không thể thiếu để đảm bảo các tổ chức và đội ngũ nhân sự của họ được chuẩn bị tốt nhất cho mọi tình huống bất ngờ.

Không chỉ dừng lại ở việc phản ứng với mối đe doạ, một quy trình báo cáo hiệu quả còn đáp ứng các yêu cầu nội bộ khác của tổ chức. Dù là bộ phận pháp chế cần đảm bảo tuân thủ quy định (regulatory compliance), ban điều hành cấp cao cần đánh giá hồ sơ rủi ro, hay CFO cần đánh giá hậu quả tài chính, một báo cáo sự cố có cấu trúc tốt đều là công cụ giúp làm rõ vấn đề cho tất cả các bên liên quan (stakeholder).

Báo cáo sự cố hiệu quả cần cân bằng giữa mức độ chi tiết và tính dễ tiếp cận, sao cho cả người am hiểu kỹ thuật lẫn người không chuyên về kỹ thuật đều có thể hiểu được. Mục tiêu của module này là giúp bạn nắm vững hơn những sắc thái tinh tế trong việc báo cáo sự cố một cách thành thạo.

## Xác định và phân loại sự cố

Để định hướng giữa vô số mối đe doạ an ninh mạng phức tạp có thể ảnh hưởng tới bạn hoặc tổ chức của bạn, cần có một cách tiếp cận bài bản trong việc xác định và phân loại sự cố bảo mật. Điều này cho phép phân bổ nguồn lực nhanh chóng và đẩy nhanh việc giảm thiểu mối đe doạ. Về cơ bản, nền tảng của một phản ứng ban đầu thành công đối với sự cố nằm ở khả năng xác định và phân loại mối đe doạ một cách kịp thời.

#### Xác định sự cố bảo mật

Sự cố bảo mật có thể bắt nguồn từ rất nhiều nguồn khác nhau và thường biểu hiện dưới dạng các phát hiện (detection), các bất thường (anomaly), hoặc các sai lệch so với baseline (mức chuẩn) đã được thiết lập. Có ba nguồn chính để xác định sự cố:

|Nguồn|Mô tả|
|------|------|
|Các hệ thống/công cụ bảo mật đang triển khai|Tổ chức của bạn nhiều khả năng đang triển khai rất nhiều loại hệ thống và công cụ bảo mật. Một số nguồn rất tốt để xác định sự cố gồm IDS/IPS, EDR/XDR, các công cụ SIEM, hay thậm chí là alert của antivirus cơ bản và dữ liệu NetFlow.|
|Quan sát của con người|Người dùng có thể nhận thấy và báo cáo các hoạt động đáng ngờ, email bất thường, hoặc hệ thống hoạt động không bình thường.|
|Thông báo từ bên thứ ba|Đối tác, nhà cung cấp (vendor), hay thậm chí khách hàng có thể thông báo cho tổ chức về các lỗ hổng hoặc vụ xâm phạm (breach) mà họ đang gặp phải.|


#### Phân loại sự cố bảo mật

Sau khi xác định được sự cố, bắt buộc phải phân loại nó để hỗ trợ việc ưu tiên và phân bổ nguồn lực cho một phản ứng hiệu quả. Việc phân loại này cũng giúp hiểu rõ bản chất của sự cố, từ đó làm cơ sở cho các buổi báo cáo tóm tắt (briefing) tiếp theo với các bên liên quan.

Ví dụ về các loại sự cố:

- `Malware`: Phần mềm độc hại, bao gồm virus, worm và ransomware.
- `Phishing`: Các nỗ lực lừa đảo nhằm đánh cắp thông tin nhạy cảm, chủ yếu thông qua email.
- `DDoS Attacks`: Các nỗ lực có chủ đích nhằm làm quá tải một hệ thống hoặc mạng, từ đó làm gián đoạn hoạt động bình thường của nó.
- `Unauthorised Access`: Các sự cố trong đó những thực thể không được phép giành được quyền truy cập vào hệ thống hoặc kho dữ liệu.
- `Data Leakage`: Việc vô tình làm lộ dữ liệu mật, cả bên trong lẫn bên ngoài phạm vi tổ chức.
- `Physical Breach`: Truy cập vật lý trái phép vào các khu vực được bảo vệ.

#### Các mức độ nghiêm trọng của sự cố:

- `Critical` (P1): Các mối đe doạ cận kề, gây nguy hiểm cho các chức năng kinh doanh cốt lõi hoặc dữ liệu nhạy cảm, đòi hỏi can thiệp ngay lập tức.
- `High` (P2): Các mối đe doạ tiềm ẩn đối với hoạt động kinh doanh, tuy chưa gây hại ngay lập tức nhưng có mức ưu tiên cao.
- `Medium` (P3): Các sự cố tuy không gây mối đe doạ tức thời cho hoạt động kinh doanh nhưng cần được xử lý kịp thời.
- `Low` (P4): Các sự cố nhỏ hoặc các bất thường thường gặp, có thể xử lý trong quy trình vận hành tiêu chuẩn.

Điều quan trọng cần nhận thức là sự cố thường thuộc nhiều loại cùng lúc, và có thể thay đổi linh hoạt cả về loại lẫn mức độ nghiêm trọng khi thu thập thêm thông tin trong giai đoạn phân tích. Bản chất biến động của các mối đe doạ này đòi hỏi một cách tiếp cận vừa linh hoạt vừa có cấu trúc cho cả việc xác định lẫn phân loại.

## Kết luận

Tóm lại, việc xác định và phân loại thành thạo là nền tảng của bất kỳ Security Operations Center (SOC) hiệu quả nào. Các quy trình này quyết định tốc độ, độ chính xác và hiệu quả của các biện pháp phản ứng, và từ đó là các chiến lược giảm thiểu.
