# The Triaging Process (Quy trình triage)


## Alert Triaging là gì?

`Alert triaging` (phân loại và sắp xếp ưu tiên alert), do analyst của Security Operations Center (SOC) thực hiện, là quá trình đánh giá và sắp xếp mức ưu tiên cho các alert bảo mật được tạo ra bởi nhiều hệ thống giám sát và phát hiện khác nhau, nhằm xác định mức độ đe doạ và tác động tiềm tàng của chúng lên hệ thống và dữ liệu của tổ chức. Quá trình này bao gồm việc rà soát và phân loại alert một cách có hệ thống để phân bổ nguồn lực hiệu quả và phản ứng với các sự cố bảo mật.

`Escalation` (chuyển cấp) là một khía cạnh quan trọng của alert triaging trong môi trường SOC. Quy trình escalation thường bao gồm việc thông báo cho cấp giám sát, đội incident response, hoặc những cá nhân được chỉ định trong tổ chức có thẩm quyền ra quyết định và điều phối nỗ lực phản ứng. SOC analyst cung cấp thông tin chi tiết về alert, bao gồm mức độ nghiêm trọng (severity), tác động tiềm tàng và mọi phát hiện liên quan từ cuộc điều tra ban đầu. Điều này giúp những người ra quyết định đánh giá tình hình và xác định hướng hành động phù hợp, như huy động các đội chuyên trách, khởi động các quy trình incident response rộng hơn, hoặc nhờ tới nguồn lực bên ngoài nếu cần.

Escalation đảm bảo các alert nghiêm trọng (critical) được chú ý kịp thời và tạo điều kiện phối hợp hiệu quả giữa các bên liên quan (stakeholder), cho phép phản ứng kịp thời và hiệu quả trước các sự cố bảo mật tiềm tàng. Nó giúp tận dụng chuyên môn và năng lực ra quyết định của những người chịu trách nhiệm quản lý và giảm thiểu các mối đe doạ hoặc sự cố ở cấp cao hơn trong tổ chức.

---

## Quy trình triage lý tưởng là gì?

1. `Initial Alert Review` (rà soát alert ban đầu):
- Rà soát kỹ alert ban đầu, bao gồm metadata, timestamp, source IP, destination IP, các hệ thống bị ảnh hưởng và rule/signature đã kích hoạt alert.
- Phân tích các log liên quan (network traffic, system, application) để hiểu ngữ cảnh của alert.

2. `Alert Classification` (phân loại alert):
- Phân loại alert dựa trên mức độ nghiêm trọng (severity), tác động (impact) và mức độ khẩn cấp (urgency) theo hệ thống phân loại đã định sẵn của tổ chức.

3. `Alert Correlation` (tương quan alert):
- Đối chiếu alert với các alert, event hoặc sự cố liên quan để nhận diện các mẫu (pattern), điểm tương đồng hoặc các indicator of compromise (IOC – dấu hiệu xâm nhập) tiềm tàng.
- Query SIEM hoặc hệ thống quản lý log để thu thập dữ liệu log liên quan.
- Tận dụng các nguồn threat intelligence (feed) để kiểm tra các mẫu tấn công hoặc signature malware đã biết.

4. `Enrichment of Alert Data` (làm giàu dữ liệu alert):
- Thu thập thêm thông tin để làm giàu dữ liệu alert và có thêm ngữ cảnh:
	- Thu thập network packet capture, memory dump hoặc mẫu file liên quan tới alert.
	- Dùng các nguồn threat intelligence bên ngoài, công cụ mã nguồn mở hoặc sandbox để phân tích file, URL hoặc địa chỉ IP đáng ngờ.
	- Khảo sát (reconnaissance) các hệ thống bị ảnh hưởng để tìm bất thường (kết nối mạng, process, thay đổi file).

5. `Risk Assessment` (đánh giá rủi ro):
- Đánh giá rủi ro và tác động tiềm tàng lên các tài sản, dữ liệu hoặc hạ tầng quan trọng:
	- Xét tới giá trị của các hệ thống bị ảnh hưởng, độ nhạy cảm của dữ liệu, các yêu cầu tuân thủ (compliance) và hệ quả pháp lý.
	- Xác định khả năng một cuộc tấn công thành công hoặc khả năng xảy ra lateral movement.
	
6. `Contextual Analysis` (phân tích ngữ cảnh):
- Analyst xem xét ngữ cảnh xung quanh alert, bao gồm các tài sản bị ảnh hưởng, mức độ quan trọng của chúng và độ nhạy cảm của dữ liệu mà chúng xử lý.
- Họ đánh giá các biện pháp kiểm soát bảo mật hiện có, như firewall, hệ thống phát hiện/ngăn chặn xâm nhập (IDS/IPS) và các giải pháp bảo vệ endpoint, để xác định alert có cho thấy khả năng một biện pháp kiểm soát bị thất bại hay một kỹ thuật né tránh (evasion) hay không.
- Analyst đánh giá các yêu cầu tuân thủ, quy định ngành và nghĩa vụ hợp đồng liên quan để hiểu hệ quả của alert đối với tình trạng tuân thủ pháp lý và quy định của tổ chức.

7. `Incident Response Planning` (lập kế hoạch incident response):
- Khởi động kế hoạch incident response nếu alert là đáng kể:
	- Ghi lại chi tiết alert, các hệ thống bị ảnh hưởng, hành vi quan sát được, các IOC tiềm tàng và dữ liệu đã làm giàu.
	- Phân công thành viên đội incident response với vai trò và trách nhiệm được xác định rõ.
	- Phối hợp với các đội khác (network operations, quản trị hệ thống, nhà cung cấp) khi cần.

8. `Consultation with IT Operations` (tham vấn IT Operations):
- Đánh giá nhu cầu bổ sung ngữ cảnh hoặc thông tin còn thiếu bằng cách tham vấn IT operations hoặc các bộ phận liên quan:
	- Tham gia thảo luận hoặc họp để thu thập hiểu biết về các hệ thống bị ảnh hưởng, các thay đổi gần đây hoặc các hoạt động bảo trì đang diễn ra.
	- Phối hợp để hiểu các vấn đề đã biết, cấu hình sai hoặc thay đổi mạng có thể tạo ra alert false-positive (dương tính giả).
	- Có được cái nhìn toàn diện về môi trường và mọi hoạt động không độc hại có thể đã kích hoạt alert.
	- Ghi lại các hiểu biết và thông tin thu được trong quá trình tham vấn.

9. `Response Execution` (thực thi phản ứng):
- Dựa trên việc rà soát alert, đánh giá rủi ro và tham vấn, xác định các hành động phản ứng phù hợp.
- Nếu ngữ cảnh bổ sung giải quyết được alert hoặc xác định đó là một event không độc hại, thực hiện các hành động cần thiết mà không cần escalation.
- Nếu alert vẫn cho thấy các mối lo ngại bảo mật tiềm tàng hoặc cần điều tra thêm, tiến hành các hành động incident response.

10. `Escalation` (chuyển cấp):
- Xác định các yếu tố kích hoạt (trigger) escalation dựa trên chính sách của tổ chức và mức độ nghiêm trọng của alert:
	- Trigger có thể bao gồm việc hệ thống/tài sản quan trọng bị xâm nhập, tấn công đang diễn ra, kỹ thuật lạ/tinh vi, tác động trên diện rộng, hoặc mối đe doạ nội bộ (insider threat).
- Đánh giá alert dựa trên các trigger escalation, cân nhắc các hậu quả tiềm tàng nếu không escalate.
- Tuân theo quy trình escalation nội bộ, thông báo cho các đội/cấp quản lý cao hơn chịu trách nhiệm incident response.
- Cung cấp bản tóm tắt alert đầy đủ, mức độ nghiêm trọng, tác động tiềm tàng, dữ liệu đã làm giàu và đánh giá rủi ro.
- Ghi lại mọi trao đổi liên quan tới escalation.
- Trong một số trường hợp, escalate lên các thực thể bên ngoài (cơ quan thực thi pháp luật, nhà cung cấp dịch vụ incident response, CERT) dựa trên yêu cầu pháp lý/quy định.

11. `Continuous Monitoring` (giám sát liên tục):
- Liên tục giám sát tình hình và tiến độ incident response.
- Duy trì trao đổi thông suốt với các đội đã được escalate, cập nhật về diễn biến, phát hiện mới hoặc thay đổi về mức độ nghiêm trọng/tác động.
- Phối hợp chặt chẽ với các đội đã được escalate để có phản ứng thống nhất.

12. `De-escalation` (hạ cấp):
- Đánh giá nhu cầu de-escalation khi incident response tiến triển và tình hình đã được kiểm soát.
- De-escalate khi rủi ro đã được giảm thiểu, sự cố đã được khoanh vùng (contain) và không cần escalation thêm.
- Thông báo cho các bên liên quan, cung cấp bản tóm tắt các hành động đã thực hiện, kết quả và bài học rút ra (lessons learned).

Thường xuyên rà soát và cập nhật quy trình, đảm bảo nó phù hợp với chính sách, thủ tục và hướng dẫn của tổ chức. Điều chỉnh quy trình để đối phó với các mối đe doạ mới nổi và nhu cầu thay đổi.
