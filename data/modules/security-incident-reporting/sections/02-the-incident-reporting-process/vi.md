# The Incident Reporting Process (Quy trình báo cáo sự cố)

Quy trình báo cáo đóng vai trò là framework gắn kết mọi thành phần của việc báo cáo sự cố bảo mật. Một cơ chế báo cáo tổng thể, hiệu quả không chỉ mang lại sự rõ ràng và định hướng, mà còn cung cấp những thông tin chi tiết (insight) có tính hành động cao. Trong phần này, chúng ta sẽ phân tích các bước cần thiết của quy trình này.

#### 1. Phát hiện ban đầu & ghi nhận (Initial Detection & Acknowledgement)

Trước khi bất kỳ sự cố nào có thể được báo cáo chính thức, nó phải được phát hiện và ghi nhận trước. Các con đường phát hiện (detection vector) có thể khác nhau, từ quan sát của con người cho đến các alert tự động được tạo ra bởi các công cụ bảo mật đã triển khai. Trong một số trường hợp, chính tác nhân đe doạ (threat actor) có thể kích hoạt việc phát hiện, đặc biệt khi bạn đang xử lý một sự cố ransomware.

#### 2. Phân tích sơ bộ (Preliminary Analysis)

Trong giai đoạn này, cần xác định phạm vi và những hệ quả tiềm tàng của sự cố bảo mật. Sự cố cần được phân loại dựa trên các tiêu chí phân loại và mức độ nghiêm trọng mà chúng ta đã thiết lập trước đó.

#### 3. Ghi nhật ký sự cố (Incident Logging)

Mọi khía cạnh, hành động và quan sát liên quan đến sự cố bảo mật cần được ghi lại tỉ mỉ bằng một hệ thống đã được thiết lập. Các nền tảng phổ biến cho mục đích này gồm [JIRA](https://www.atlassian.com/software/jira) và [TheHive Project](https://thehive-project.org/). Nếu không có hệ thống như vậy, cần dùng các phương pháp thay thế. Ngay cả những công cụ thô sơ như giấy bút hoặc một bảng tính cũng có thể đủ dùng trong lúc cấp bách.

#### 4. Thông báo cho các bên liên quan (Notification of Relevant Parties)

Các bên liên quan (stakeholder) phải được xác định kịp thời, và việc thông báo nên được chia thành:

- `Internal Communications`
	- Cần cảnh báo cho các phòng ban nội bộ liên quan, như IT, pháp chế, PR (quan hệ công chúng) và các nhóm điều hành. Trong trường hợp sự cố có tác động rộng và nghiêm trọng, có thể cần thông báo trên toàn tổ chức.
- `External Communications`
 	- Tuỳ theo bản chất và mức độ ảnh hưởng của sự cố, có thể cần truyền thông ra bên ngoài. Việc này có thể bao gồm thông báo cho khách hàng, đối tác, cơ quan quản lý, hoặc thậm chí công chúng. 

#### 5. Điều tra chi tiết & báo cáo (Detailed Investigation & Reporting)

Thời gian của giai đoạn này có thể dao động rất lớn, từ vài ngày cho đến có thể là nhiều năm. Điều cốt yếu ở đây là một phân tích kỹ thuật toàn diện đi kèm với việc tổng hợp mọi phát hiện. Cuộc điều tra chuyên sâu này rất quan trọng để hiểu được toàn bộ tác động của sự cố.

#### 6. Lập báo cáo cuối cùng (Final Report Creation)

Đỉnh điểm trong vai trò của bạn với tư cách một security analyst hoặc incident responder là việc lập ra báo cáo sự cố hoàn chỉnh. Tài liệu này sẽ cung cấp cho cơ quan quản lý, công ty bảo hiểm và ban lãnh đạo điều hành một bản tường thuật chi tiết về sự cố, nguồn gốc của nó, và các hành động khắc phục đã thực hiện.

#### 7. Vòng phản hồi (Feedback Loop)!

Việc nhìn lại sau sự cố là thiết yếu để nâng cao mức độ sẵn sàng của chúng ta cho các sự cố trong tương lai. Việc này bao gồm xem lại và phân tích sự cố để xác định những điểm cần cải thiện.

## Kết luận

Không chỉ là một thủ tục hình thức đơn thuần, quy trình báo cáo là một tài sản chiến lược giúp nâng cao khả năng chống chịu (resilience) của tổ chức trước các mối đe doạ bảo mật. Thông qua việc ghi chép, phân tích nghiêm ngặt và rút kinh nghiệm từ mỗi sự cố, tổ chức có thể biến thách thức thành cơ hội để củng cố tư thế bảo mật (security posture) của mình.
