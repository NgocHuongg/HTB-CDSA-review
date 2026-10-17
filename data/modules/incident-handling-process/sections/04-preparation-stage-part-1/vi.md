# Preparation Stage (Part 1) (Giai đoạn chuẩn bị – Phần 1)

Ở giai đoạn `Preparation` (chuẩn bị), ta có hai mục tiêu riêng biệt. Mục tiêu thứ nhất là xây dựng năng lực xử lý sự cố (incident handling capability) trong tổ chức. Mục tiêu thứ hai là khả năng bảo vệ trước và ngăn chặn các sự cố an ninh CNTT bằng cách triển khai các biện pháp bảo vệ phù hợp. Các biện pháp này gồm hardening (gia cố) endpoint và server, phân tầng Active Directory (Active Directory tiering), xác thực đa yếu tố (Multi-Factor Authentication), quản lý truy cập đặc quyền (privileged access management), v.v. Dù việc bảo vệ trước các sự cố không phải là trách nhiệm của đội xử lý sự cố, hoạt động này lại là nền tảng cho sự thành công chung của đội.

---

## Điều kiện tiên quyết của giai đoạn Preparation

Trong giai đoạn chuẩn bị, ta cần đảm bảo có:

- Thành viên đội xử lý sự cố có kỹ năng (có thể thuê ngoài — outsource — thành viên đội xử lý sự cố, nhưng dù vậy nội bộ vẫn cần có năng lực và hiểu biết cơ bản về incident handling).
- Đội ngũ nhân viên được đào tạo (càng nhiều càng tốt, thông qua các hoạt động nâng cao nhận thức bảo mật — security awareness — hoặc các hình thức đào tạo khác).
- Chính sách và tài liệu rõ ràng.
- Công cụ (phần mềm và phần cứng).

![Slide có tiêu đề “Incident Handling Preparation Prerequisites” liệt kê năm mục: Incident handling capability within the organization (năng lực xử lý sự cố trong tổ chức), Protect against & prevent IT security incidents (bảo vệ trước và ngăn chặn sự cố an ninh CNTT), Clear policies (chính sách rõ ràng), Documentation (tài liệu) và Tools (software & hardware) (công cụ – phần mềm và phần cứng).](images/ir_preparation.png)

---

## Chính sách & tài liệu rõ ràng

Một số chính sách và tài liệu thành văn cần chứa phiên bản cập nhật của các thông tin sau:

- Thông tin liên hệ và vai trò của các thành viên đội xử lý sự cố.
- Thông tin liên hệ của bộ phận pháp chế và tuân thủ (legal and compliance), ban quản lý, bộ phận hỗ trợ IT, bộ phận truyền thông và quan hệ báo chí, cơ quan thực thi pháp luật, nhà cung cấp dịch vụ internet (ISP), bộ phận quản lý cơ sở vật chất (facility management) và đội ứng phó sự cố bên ngoài (external incident response team).
- Chính sách, kế hoạch và quy trình ứng phó sự cố (incident response).
- Chính sách và quy trình chia sẻ thông tin sự cố.
- Baseline (đường cơ sở) của hệ thống và mạng, lấy từ golden image (bản image chuẩn) và môi trường ở trạng thái sạch (clean state).
- Sơ đồ mạng (network diagram).
- Cơ sở dữ liệu quản lý tài sản (asset management) trên toàn tổ chức.
- Các tài khoản người dùng có đặc quyền cao (excessive privileges) mà đội có thể dùng theo nhu cầu khi cần thiết (kể cả cho các hệ thống trọng yếu với hoạt động kinh doanh — business-critical — vốn được xử lý bằng các kỹ năng cần thiết để quản trị riêng hệ thống đó). Các tài khoản này thường được bật (enable) khi một incident được xác nhận trong quá trình điều tra ban đầu, rồi bị vô hiệu hoá (disable) khi sự cố kết thúc. Khi vô hiệu hoá các tài khoản này cũng bắt buộc phải đặt lại mật khẩu (password reset).
- Khả năng mua phần cứng, phần mềm hoặc thuê nguồn lực bên ngoài mà không cần qua toàn bộ quy trình mua sắm (procurement) (mua khẩn cấp tới một hạn mức nhất định). Trong lúc xử lý sự cố, điều bạn ít cần nhất là phải chờ hàng tuần chỉ để được duyệt mua một công cụ giá $500.
- Các cheat sheet về forensic/điều tra.

Một số trường hợp không nghiêm trọng có thể được xử lý tương đối nhanh và không gặp nhiều trở ngại, cả trong lẫn ngoài tổ chức. Những trường hợp khác có thể đòi hỏi phải thông báo cho cơ quan thực thi pháp luật và truyền thông ra bên ngoài tới khách hàng và nhà cung cấp bên thứ ba, đặc biệt khi sự cố làm phát sinh các vấn đề pháp lý. Ví dụ, một vụ rò rỉ dữ liệu (data breach) liên quan tới dữ liệu khách hàng phải được báo cáo cho cơ quan thực thi pháp luật trong một khoảng thời gian nhất định theo GDPR. Có thể có nhiều yêu cầu tuân thủ (compliance) tuỳ theo địa điểm và/hoặc chi nhánh nơi xảy ra sự cố, vì vậy cách tốt nhất để nắm được chúng là trao đổi với đội pháp chế và tuân thủ theo từng sự cố (hoặc chủ động trao đổi từ trước).

Dù việc có sẵn tài liệu là rất quan trọng, việc ghi chép lại sự cố trong lúc điều tra cũng quan trọng không kém. Vì vậy, trong giai đoạn này ta cũng cần xây dựng năng lực báo cáo (reporting) hiệu quả. Sự cố có thể gây căng thẳng cực độ, và rất dễ quên mất phần này khi sự cố đang diễn biến, nhất là khi ta đang tập trung và làm việc cực nhanh để giải quyết sớm nhất có thể. Ta nên cố gắng giữ bình tĩnh, ghi chép, và đảm bảo các ghi chép có timestamp (dấu thời gian), hoạt động đã thực hiện, kết quả của hoạt động đó và người thực hiện. Nhìn chung, ta cần tìm câu trả lời cho các câu hỏi: ai (who), cái gì (what), khi nào (when), ở đâu (where), tại sao (why) và như thế nào (how).

---

## Công cụ (phần mềm & phần cứng)

Tiếp theo, ta cũng cần đảm bảo có đúng công cụ để làm việc. Chúng bao gồm (nhưng không giới hạn ở):

- Một laptop bổ sung hoặc một forensic workstation (máy trạm điều tra số) cho mỗi thành viên đội xử lý sự cố để lưu giữ disk image và file log, phân tích dữ liệu và điều tra mà không bị hạn chế gì (ta biết malware sẽ được thử nghiệm ở đây, nên các công cụ như antivirus cần được tắt). Các thiết bị này cần được quản lý phù hợp, không để gây rủi ro cho tổ chức.
- Công cụ thu thập (acquisition) và phân tích image phục vụ điều tra số (digital forensic).
- Công cụ thu thập (capture) và phân tích bộ nhớ (memory).
- Công cụ thu thập và phân tích live response.
- Công cụ phân tích log.
- Công cụ bắt (capture) và phân tích lưu lượng mạng.
- Cáp mạng và switch.
- Write blocker (thiết bị chặn ghi).
- Ổ cứng dùng để tạo forensic image.
- Cáp nguồn.
- Tua vít, nhíp và các dụng cụ liên quan khác để sửa chữa hoặc tháo rời thiết bị phần cứng khi cần.
- Công cụ tạo Indicator of Compromise (IOC – dấu hiệu xâm nhập) và khả năng tìm kiếm IOC trên toàn tổ chức.
- Biểu mẫu chain of custody (chuỗi lưu giữ bằng chứng).
- Phần mềm mã hoá.
- Hệ thống theo dõi ticket (ticket tracking system).
- Cơ sở vật chất an toàn để lưu trữ và điều tra.
- Hệ thống xử lý sự cố độc lập với hạ tầng của tổ chức.

Nhiều công cụ kể trên sẽ là một phần của thứ gọi là `jump bag` — túi đồ nghề luôn sẵn sàng với các công cụ cần thiết, có thể xách lên mang đi ngay lập tức. Nếu không chuẩn bị sẵn túi này, việc gom đủ công cụ cần thiết vào phút chót có thể mất hàng ngày, thậm chí hàng tuần, trước khi ta sẵn sàng ứng phó.

Cuối cùng, ta muốn nhấn mạnh tầm quan trọng của việc giữ hệ thống tài liệu hoàn toàn độc lập với hạ tầng của tổ chức và được bảo mật đúng cách. Ngay từ đầu, hãy giả định rằng toàn bộ domain đã bị xâm nhập và mọi hệ thống đều có thể trở nên không khả dụng. Tương tự, việc trao đổi về sự cố nên được thực hiện qua các kênh không thuộc hệ thống của tổ chức; hãy giả định rằng kẻ tấn công kiểm soát mọi thứ và có thể đọc được các kênh liên lạc như email.
