# Containment, Eradication, and Recovery Stage (Giai đoạn ngăn chặn, loại bỏ và khôi phục)

Khi cuộc điều tra hoàn tất và ta đã hiểu rõ loại sự cố cũng như tác động tới hoạt động kinh doanh (dựa trên tất cả các đầu mối — lead — thu thập được và thông tin đã tổng hợp trong timeline), đã đến lúc bước vào giai đoạn containment (ngăn chặn) để không cho sự cố gây thêm thiệt hại.

![Sơ đồ luồng ứng phó sự cố có tiêu đề “Containment, Eradication, and Recovery Stage.” Các bước: Investigation is complete (điều tra hoàn tất) → Containment Strategy (chiến lược ngăn chặn) → Evidence gathering (thu thập bằng chứng; ghi chú: Preserve Evidence – bảo toàn bằng chứng) → Identify the attacking host (xác định host tấn công) → Eradication and Recovery → Bring systems back to normal operation (đưa hệ thống trở lại hoạt động bình thường). Ghi chú bên cạnh phần containment: forensic image, đổi mật khẩu, áp dụng firewall rule, áp dụng bản vá hệ thống.](images/ir_stages.png)

---

## Containment (ngăn chặn)

Ở giai đoạn này, ta hành động để ngăn sự cố lan rộng. Ta chia các hành động thành `short-term containment` (ngăn chặn ngắn hạn) và `long-term containment` (ngăn chặn dài hạn). Điều quan trọng là các hành động containment phải được phối hợp và thực hiện đồng thời trên tất cả các hệ thống. Nếu không, ta có nguy cơ khiến kẻ tấn công nhận ra rằng ta đang truy lùng chúng, và khi đó chúng có thể thay đổi technique và công cụ để duy trì sự hiện diện (persist) trong môi trường.

Với short-term containment, các hành động được thực hiện chỉ để lại dấu vết (footprint) tối thiểu trên hệ thống nơi chúng diễn ra. Một số hành động có thể gồm: đưa hệ thống vào một VLAN riêng/cô lập, rút cáp mạng khỏi (các) hệ thống, hoặc sửa tên DNS C2 của kẻ tấn công để trỏ tới một hệ thống do ta kiểm soát hoặc tới một hệ thống không tồn tại. Các hành động ở đây giúp kìm hãm thiệt hại và tạo thời gian để xây dựng một chiến lược khắc phục (remediation) cụ thể hơn. Ngoài ra, vì ta giữ nguyên hệ thống (nhiều nhất có thể), ta có cơ hội tạo forensic image và bảo toàn bằng chứng nếu việc này chưa được làm trong lúc điều tra (bước này còn gọi là giai đoạn con `backup` của giai đoạn containment). Nếu một hành động short-term containment đòi hỏi phải tắt một hệ thống, ta phải đảm bảo việc này được thông báo cho phía kinh doanh (business) và được cấp quyền phù hợp.

Với các hành động long-term containment, ta tập trung vào các hành động và thay đổi mang tính lâu dài. Chúng có thể gồm đổi mật khẩu người dùng, áp dụng firewall rule, bổ sung hệ thống phát hiện xâm nhập trên host (host intrusion detection system), áp dụng bản vá hệ thống (patch) và tắt hệ thống. Trong khi thực hiện các hoạt động này, ta cần liên tục cập nhật tình hình cho phía kinh doanh và các bên liên quan (stakeholder). Hãy nhớ rằng một hệ thống giờ đã được vá không có nghĩa là sự cố đã kết thúc. Các hoạt động eradication, recovery và post-incident vẫn đang chờ thực hiện.

---

## Eradication (loại bỏ)

Khi sự cố đã được ngăn chặn (contain), cần tiến hành eradication để loại bỏ cả nguyên nhân gốc (root cause) của sự cố lẫn những gì sự cố còn để lại, nhằm đảm bảo kẻ tấn công đã bị đẩy ra khỏi hệ thống và mạng. Một số hoạt động trong giai đoạn này gồm: gỡ bỏ malware đã phát hiện khỏi hệ thống, dựng lại (rebuild) một số hệ thống và khôi phục những hệ thống khác từ bản sao lưu (backup). Trong giai đoạn eradication, ta có thể mở rộng các hoạt động containment đã thực hiện trước đó bằng cách áp dụng thêm các bản vá mà lúc trước chưa cần thiết ngay. Các hoạt động hardening (gia cố) hệ thống bổ sung cũng thường được thực hiện trong giai đoạn eradication (không chỉ trên hệ thống bị ảnh hưởng mà trong một số trường hợp là trên toàn mạng).

---

## Recovery (khôi phục)

Ở giai đoạn recovery, ta đưa hệ thống trở lại hoạt động bình thường. Tất nhiên, phía kinh doanh cần xác minh rằng hệ thống thực sự hoạt động như mong đợi và có đầy đủ dữ liệu cần thiết. Khi mọi thứ đã được xác minh, các hệ thống này được đưa vào môi trường production. Mọi hệ thống được khôi phục sẽ được ghi log và giám sát chặt chẽ sau sự cố, vì các hệ thống từng bị xâm nhập thường lại trở thành mục tiêu nếu kẻ tấn công giành lại quyền truy cập vào môi trường trong một thời gian ngắn. Các event đáng ngờ điển hình cần theo dõi là:

- Logon bất thường (vd: tài khoản người dùng hoặc service account chưa từng đăng nhập ở đó trước đây).
- Tiến trình (process) bất thường.
- Thay đổi registry ở những vị trí thường bị malware sửa đổi.

Ở một số sự cố lớn, giai đoạn recovery có thể kéo dài hàng tháng, vì nó thường được triển khai theo từng phase. Ở các phase đầu, trọng tâm là nâng cao mức độ bảo mật tổng thể để ngăn các sự cố trong tương lai thông qua những cải thiện nhanh (quick win) và xử lý các vấn đề dễ giải quyết (low-hanging fruit). Các phase sau tập trung vào những thay đổi lâu dài, bền vững để giữ cho tổ chức an toàn nhất có thể.
