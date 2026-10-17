# Skills Assessment (Bài đánh giá kỹ năng)


## Rà soát Dashboard & bài tập tư duy phản biện

Xin chúc mừng,

Bạn đã được Eagle tuyển vào vị trí SOC Tier 1 analyst. Hôm qua là ngày on-boarding (nhập môn) của bạn tại công ty, và hôm nay bạn sẽ làm quen với SOC. Ngày làm việc của bạn sẽ bắt đầu bằng buổi gặp một senior analyst, người sẽ cung cấp hiểu biết về môi trường; sau đó, bạn sẽ bắt đầu giám sát alert và các security event trên các dashboard SOC "cây nhà lá vườn" (tự xây dựng) của chúng ta.

Dưới đây là ghi chú của bạn sau buổi gặp senior analyst, người đã cung cấp hiểu biết về môi trường:

- Tổ chức đã chuyển toàn bộ hosting lên cloud; mạng DMZ cũ đã bị đóng, nên không còn server nào ở đó nữa.

- Đội IT operation (các IT admin cốt lõi) gồm bốn người. Họ là những người duy nhất có quyền cao (high privilege) trong môi trường.

- Đội IT operation thường có xu hướng dùng (các) tài khoản administrator mặc định dù đã được dặn là không nên.

- Mọi thiết bị endpoint đều được hardening theo các baseline hardening của CIS. Whitelisting (danh sách cho phép) có tồn tại nhưng ở mức hạn chế.

- Bộ phận IT security đã tạo một máy trạm quản trị đặc quyền (privileged admin workstation – PAW) và yêu cầu mọi hoạt động quản trị phải được thực hiện trên máy này.

- Môi trường Linux chủ yếu là các server "sót lại" từ ngày trước, gần như không có hoạt động nào (nếu có thì rất ít) trong một ngày bình thường. Tài khoản root không được sử dụng; do các phát hiện từ đợt audit, tài khoản này đã bị chặn kết nối từ xa, và user nào cần các quyền đó sẽ phải nâng quyền qua lệnh sudo.

- Có quy ước đặt tên và được tuân thủ nghiêm ngặt; ví dụ, service account có '-svc' trong tên. Service account được tạo với mật khẩu dài, phức tạp, và chúng thực hiện một tác vụ rất cụ thể (nhiều khả năng là chạy service cục bộ trên máy).

---
<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Nếu bạn đang có một instance target đang chạy, hãy reset nó bằng cách bấm vào biểu tượng "Reset Target". Việc này đảm bảo bạn lấy lại được quyền truy cập dashboard đã cấu hình sẵn mà có thể bạn đã xoá trong các phần liên quan tới SIEM visualization.</p>
    </div>
</div>

Giờ bạn có thể ngồi vào chỗ và bắt đầu giám sát. Truy cập `http://[Target IP]:5601`, bấm vào nút bật/tắt thanh điều hướng bên (side navigation toggle), rồi bấm vào "Dashboard". Rà soát dashboard `SOC-Alerts`.

- `Visualization 1: Failed logon attempts (All users)`

	Một visualization như vậy có thể làm lộ ra các cuộc tấn công brute force tiềm tàng. Điều quan trọng là phải nhận diện bất kỳ user đơn lẻ nào có nhiều lần thất bại, hoặc có lẽ là nhiều user khác nhau kết nối tới (hoặc từ) cùng một thiết bị endpoint. Tuy nhiên, dữ liệu hiện tại không chỉ ra kịch bản nào như vậy. Dù vậy, vẫn có một điểm bất thường đáng chú ý. **Gợi ý**: Nó liên quan tới tài khoản "sql-svc1".

- `Visualization 2: Failed logon attempts (Disabled user)`

	Có vẻ như có một sự cố trong đó user "Anni" đã cố gắng xác thực, dù tài khoản này đã bị vô hiệu hoá.

- `Visualization 3: Failed logon attempts (Admin users only)`

	**Gợi ý**: Kiểm tra xem có phải mọi event đều diễn ra trên Privileged Access Workstation (PAW) hoặc Domain Controller hay không. 

- `Visualization 4: RDP logon for service account`

	Service account trong môi trường này đảm nhận một chức năng rất chuyên biệt. Bạn có nhận thấy điều gì đáng ngờ không?

- `Visualization 5: User added or removed from a local group`

	Một administrator đã đưa một cá nhân (chỉ được thể hiện bằng giá trị SID) vào group "Administrators". Bạn nên escalate lên Tier 2/3 analyst hay tham vấn bộ phận IT Operations trước?

- `Visualization 6: Admin logon not from PAW`

	Administrator chỉ nên dùng PAW cho các kết nối từ xa tới server. Bạn nên escalate lên Tier 2/3 analyst hay tham vấn bộ phận IT Operations trước?

- `Visualization 7: SSH Logins`

	Xin nhắc lại rằng tài khoản root thường không được sử dụng.

Hãy làm các câu hỏi bên dưới và nhập câu trả lời của bạn.

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Vui lòng chờ 3-5 phút để Kibana sẵn sàng sau khi khởi tạo (spawn) target của các câu hỏi bên dưới. </p>
    </div>
</div>
