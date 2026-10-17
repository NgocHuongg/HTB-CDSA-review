# Incident Handling Process Overview (Tổng quan quy trình xử lý sự cố)

Giờ đã quen với Cyber Kill Chain và các giai đoạn của nó, ta có thể dự đoán và lường trước tốt hơn các bước tiếp theo trong một cuộc tấn công, đồng thời đề xuất các biện pháp phù hợp để chống lại chúng.

Cũng giống Cyber Kill Chain, việc ứng phó một incident (sự cố) cũng gồm nhiều giai đoạn khác nhau, được định nghĩa là `Incident Handling Process`. `Incident Handling Process` xác định năng lực giúp tổ chức chuẩn bị, phát hiện và ứng phó với các event (sự kiện) độc hại. Lưu ý rằng quy trình này phù hợp để ứng phó với các event bảo mật IT, nhưng các giai đoạn của nó không tương ứng một-một với các giai đoạn của Cyber Kill Chain.

Theo định nghĩa của NIST, quy trình xử lý sự cố gồm bốn giai đoạn riêng biệt sau:

![Sơ đồ quy trình ứng phó sự cố: Preparation, Detection & Analysis, Containment Eradication & Recovery, Post-Incident Activity.](images/ir-lifecycle.png)

Incident handler dành phần lớn thời gian ở hai giai đoạn đầu, `preparation` và `detection and analysis`. Đây là nơi chúng ta, với vai trò incident handler, dành nhiều thời gian để tự nâng cao năng lực và tìm kiếm event độc hại tiếp theo. Khi phát hiện một event độc hại, ta chuyển sang giai đoạn kế tiếp và ứng phó với event đó (nhưng luôn phải có nguồn lực hoạt động ở hai giai đoạn đầu, để năng lực chuẩn bị và phát hiện không bị gián đoạn). Như thấy trong hình, quy trình này không tuyến tính mà là một vòng lặp (cyclic). Điểm chính cần hiểu ở giai đoạn này là khi phát hiện thêm bằng chứng mới, các bước tiếp theo cũng có thể thay đổi. Điều cốt yếu là không được bỏ qua bước nào trong quy trình và phải hoàn thành một bước trước khi chuyển sang bước tiếp theo. Ví dụ, nếu phát hiện mười máy bị nhiễm, ta chắc chắn không nên chỉ containment (khoanh vùng, cô lập) năm máy rồi bắt đầu eradication (loại bỏ mối đe doạ) trong khi năm máy còn lại vẫn ở trạng thái bị nhiễm. Cách làm như vậy có thể kém hiệu quả vì, ở mức tối thiểu, ta đang báo cho kẻ tấn công biết rằng ta đã phát hiện ra chúng và đang truy lùng chúng — điều này, như có thể hình dung, có thể dẫn đến những hậu quả khó lường.

Như vậy, xử lý sự cố có hai hoạt động chính là `investigating` (điều tra) và `recovering` (khôi phục). Việc điều tra nhằm:

- `Discover` (tìm ra) nạn nhân đầu tiên — '`patient zero`' — và lập một incident timeline được cập nhật liên tục (nếu sự cố vẫn đang diễn ra).
- Xác định kẻ tấn công đã dùng những `tools` (công cụ) và malware nào.
- `Document` (ghi chép lại) các hệ thống bị xâm nhập và những gì kẻ tấn công đã làm.

Sau khi điều tra, hoạt động khôi phục bao gồm `creating and implementing a recovery plan` (xây dựng và triển khai kế hoạch khôi phục). Khi kế hoạch đã được triển khai, doanh nghiệp sẽ trở lại hoạt động bình thường, nếu sự cố đã gây ra gián đoạn.

Khi một incident được xử lý xong hoàn toàn, một báo cáo sẽ được phát hành, nêu chi tiết nguyên nhân và chi phí của incident. Ngoài ra, các hoạt động "lessons learned" (rút kinh nghiệm) cũng được thực hiện, cùng với những việc khác, nhằm hiểu tổ chức cần làm gì để ngăn các incident tương tự xảy ra lần nữa.

Trong các phần tiếp theo, ta sẽ lần lượt đi qua tất cả các giai đoạn của `Incident Handling Process`.
