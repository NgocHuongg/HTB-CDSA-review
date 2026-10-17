# Detection & Analysis Stage (Part 1) (Giai đoạn phát hiện & phân tích – Phần 1)

Tới thời điểm này, chúng ta đã xây dựng các quy trình và thủ tục, và đã có hướng dẫn về cách hành động khi xảy ra sự cố bảo mật.

Giai đoạn `Detection & Analysis` bao gồm mọi khía cạnh của việc phát hiện một incident, như sử dụng sensor, log và nhân sự đã được đào tạo. Giai đoạn này cũng bao gồm việc chia sẻ thông tin và tri thức, cũng như sử dụng threat intelligence dựa trên ngữ cảnh (context-based). Việc phân đoạn kiến trúc, cũng như hiểu rõ và có khả năng quan sát (visibility) bên trong mạng cũng là những yếu tố quan trọng.

Các mối đe doạ xâm nhập vào tổ chức qua vô số vector tấn công, và việc phát hiện chúng có thể đến từ các nguồn như:

- Một nhân viên nhận thấy hành vi bất thường.
- Một alert từ một trong các công cụ của chúng ta (EDR, IDS, Firewall, SIEM, v.v.).
- Các hoạt động threat hunting.
- Thông báo từ bên thứ ba cho biết họ phát hiện dấu hiệu tổ chức của chúng ta bị xâm nhập.

Rất nên tạo các cấp độ phát hiện bằng cách phân loại mạng một cách logic như sau:

- Phát hiện ở vành đai mạng (network perimeter) (dùng firewall, hệ thống phát hiện/ngăn chặn xâm nhập mạng hướng ra Internet, vùng phi quân sự (demilitarized zone), v.v.).
- Phát hiện ở cấp mạng nội bộ (dùng firewall cục bộ, hệ thống phát hiện/ngăn chặn xâm nhập trên host, v.v.).
- Phát hiện ở cấp endpoint (dùng hệ thống antivirus, hệ thống endpoint detection & response, v.v.).
- Phát hiện ở cấp ứng dụng (dùng log ứng dụng, log dịch vụ, v.v.).

---

## Điều tra ban đầu (Initial Investigation)

Khi phát hiện một sự cố bảo mật, ta nên tiến hành một số điều tra ban đầu và xác lập ngữ cảnh trước khi tập hợp đội và kích hoạt incident response trên toàn tổ chức. Hãy nghĩ xem thông tin được trình bày thế nào trong trường hợp event một tài khoản quản trị kết nối tới một địa chỉ IP lúc HH:MM:SS. Nếu không biết hệ thống nào nằm ở địa chỉ IP đó và thời gian đó tính theo múi giờ nào, ta rất dễ đưa ra kết luận sai về bản chất của event này. Tóm lại, ở giai đoạn này ta nên cố gắng thu thập càng nhiều thông tin càng tốt về những điểm sau:

- Ngày/giờ sự cố được báo cáo. Ngoài ra, ai đã phát hiện sự cố và/hoặc ai đã báo cáo nó?
- Sự cố được phát hiện như thế nào?
- Sự cố là gì? Phishing? Hệ thống không khả dụng? v.v.
- Lập danh sách các hệ thống bị ảnh hưởng (nếu có).
- Ghi lại ai đã truy cập các hệ thống bị ảnh hưởng và những hành động nào đã được thực hiện. Ghi chú xem đây là sự cố đang diễn ra hay hoạt động đáng ngờ đã dừng lại.
- Vị trí vật lý, hệ điều hành, địa chỉ IP và hostname, chủ sở hữu hệ thống, mục đích của hệ thống, trạng thái hiện tại của hệ thống.
- Danh sách địa chỉ IP; nếu có liên quan tới malware: thời gian và ngày phát hiện, loại malware, các hệ thống bị ảnh hưởng, bản export các file độc hại kèm thông tin forensic về chúng (như hash, bản sao của file, v.v.).

Với những thông tin đó trong tay, ta có thể đưa ra quyết định dựa trên hiểu biết đã thu thập được. Điều này có nghĩa là gì? Nhiều khả năng ta sẽ hành động khác đi nếu biết laptop bị xâm nhập là của CEO thay vì của một thực tập sinh.

Với thông tin thu thập ban đầu, ta có thể bắt đầu xây dựng dòng thời gian sự cố (incident timeline). Timeline này giúp ta làm việc có tổ chức trong suốt sự cố và cho ta bức tranh tổng thể về những gì đã xảy ra. Các event trong timeline được sắp xếp theo thời điểm chúng xảy ra. Lưu ý rằng trong quá trình điều tra sau này, ta không nhất thiết sẽ phát hiện bằng chứng theo đúng thứ tự thời gian này. Tuy nhiên, khi sắp xếp bằng chứng theo thời điểm xảy ra, ta sẽ có được ngữ cảnh từ các event riêng lẻ đã diễn ra. Timeline cũng có thể làm rõ liệu bằng chứng mới phát hiện có thuộc sự cố hiện tại hay không. Ví dụ, hãy hình dung thứ mà ta tưởng là payload ban đầu của cuộc tấn công sau đó lại được phát hiện đã có mặt trên một thiết bị khác từ hai tuần trước. Ta sẽ gặp những tình huống mà dữ liệu đang xem cực kỳ liên quan, và cả những tình huống mà dữ liệu không liên quan và ta đang tìm sai chỗ. Nhìn chung, timeline nên chứa thông tin được mô tả trong các cột sau:

| `Date` | `Time of the event` | `hostname` | `event description` | `data source` |
| --- | --- | --- | --- | --- |

Hãy lấy một event và điền vào bảng ví dụ ở trên. Bảng sẽ trông như sau:

| `Date` | `Time of the event` | `hostname` | `event description` | `data source` |
| --- | --- | --- | --- | --- |
| 09/09/2021 | 13:31 CET | SQLServer01 | Phát hiện công cụ hack 'Mimikatz' | Phần mềm antivirus |

Như bạn có thể suy ra, timeline tập trung chủ yếu vào hành vi của kẻ tấn công, nên các hoạt động được ghi lại mô tả thời điểm cuộc tấn công xảy ra, thời điểm một kết nối mạng được thiết lập để truy cập một hệ thống, thời điểm file được tải xuống, v.v. Điều quan trọng là phải ghi lại được hoạt động được phát hiện hoặc tìm thấy ở đâu và các hệ thống liên quan tới nó.

Ta cũng có thể xem một alert liên quan tới event log này trên nền tảng quản lý case (Case Management Platform) TheHive.

![Trang Alerts của TheHive hiển thị 43 alert. Ba mục đang hiển thị: “Possible suspicious access to Windows admin shares” — trạng thái New, source wazuh_alert/wazuh, agent SCDC01 (id 005, IP 172.16.200.50), Observables 1, TTPs 0., “InsightNexus Hacker tool Mimikatz was detected” — trạng thái New, severity C, tag InsightNexus, Mimikatz, T1003.001, Credential Dumping, T1003; Observables 3, TTPs 0, ID INX-WAZUH-2025-00080., InsightNexus Admin Login via ManageEngine Web Console” — trạng thái New, severity H, tag InsightNexus, T1078.001, Valid Accounts, Initial Access; Observables 2, TTPs 0, ID INX-ALERT-2025-00077. Thanh trên cùng có ô tìm kiếm và nút Create Case.](images/hivealert1.png)

Hãy kéo xuống cuối section này và click vào "`Click here to spawn the target system!`". Sau đó, mở trang web TheHive tại "Target IP:9000" trên cổng 9000 bằng thông tin đăng nhập được cung cấp để xem các alert.

Ta có thể gán (assign) alert cho chính mình, tạo case, xử lý case, bổ sung thêm chi tiết về sự cố vào case, và sau khi hoàn tất điều tra, ta có thể ghi lại toàn bộ phát hiện và bài học kinh nghiệm (lesson) vào case rồi đóng case.

---

## Các câu hỏi về mức độ nghiêm trọng & phạm vi sự cố

Khi xử lý một sự cố bảo mật, ta cũng nên cố gắng trả lời các câu hỏi sau để nắm được mức độ nghiêm trọng (severity) và phạm vi (extent) của sự cố:

- Tác động của việc khai thác (exploitation impact) là gì?
- Điều kiện cần để khai thác (exploitation requirements) là gì?
- Có hệ thống quan trọng với hoạt động kinh doanh (business-critical) nào có thể bị ảnh hưởng bởi sự cố không?
- Có bước khắc phục (remediation) nào được đề xuất không?
- Bao nhiêu hệ thống đã bị ảnh hưởng?
- Exploit có đang được sử dụng ngoài thực tế (in the wild) không?
- Exploit có khả năng lây lan kiểu worm (worm-like) không?

Hai câu hỏi cuối có thể cho thấy mức độ tinh vi của kẻ tấn công.

Như bạn có thể hình dung, các sự cố có tác động cao sẽ được xử lý ngay lập tức, và các sự cố có nhiều hệ thống bị ảnh hưởng sẽ phải được escalate (chuyển lên cấp cao hơn).

---

## Bảo mật thông tin & truyền thông về sự cố

Sự cố là chủ đề rất bảo mật (confidential), vì vậy mọi thông tin thu thập được cần được giữ theo nguyên tắc need-to-know (chỉ người cần biết mới được biết), trừ khi luật hiện hành hoặc quyết định của ban lãnh đạo yêu cầu khác. Có nhiều lý do cho việc này. Ví dụ, kẻ tấn công có thể là một nhân viên của công ty, hoặc nếu đã xảy ra rò rỉ (breach), việc truyền thông tới các bên nội bộ và bên ngoài phải do người được chỉ định đảm nhận, phối hợp với bộ phận pháp chế.

Khi một cuộc điều tra được khởi động, ta sẽ đặt ra một số kỳ vọng và mục tiêu. Chúng thường bao gồm loại sự cố đã xảy ra, các nguồn bằng chứng hiện có, và ước tính sơ bộ thời gian đội cần cho việc điều tra. Ngoài ra, tuỳ theo sự cố, ta sẽ đặt kỳ vọng về việc có thể truy ra kẻ tấn công hay không. Tất nhiên, nhiều điều nói trên có thể thay đổi khi cuộc điều tra tiến triển và phát hiện ra manh mối mới. Điều quan trọng là phải cập nhật cho mọi người liên quan và ban lãnh đạo về mọi tiến triển và kỳ vọng.

## Tiếp theo

Ở section tiếp theo, chúng ta sẽ đi sâu hơn vào chi tiết của quá trình điều tra, những gì có thể là indicator of compromise (IOC – dấu hiệu xâm nhập), và cách bắt đầu điều tra dựa trên nó.
