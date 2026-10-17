# Skills Assessment - Snort (Bài đánh giá kỹ năng - Snort)

## Bài tập phát triển Snort rule: Phát hiện Overpass-the-Hash
 
**Nguồn PCAP**: [https://github.com/elcabezzonn/Pcaps](https://github.com/elcabezzonn/Pcaps)

**Mô tả tấn công và các điểm có thể phát hiện**: [http://www.labofapenetrationtester.com/2017/08/week-of-evading-microsoft-ata-day2.html](http://www.labofapenetrationtester.com/2017/08/week-of-evading-microsoft-ata-day2.html)

`Overpass-the-Hash (Pass-the-Key)` là một kiểu tấn công trong đó kẻ tấn công giành quyền truy cập trái phép vào tài nguyên bằng cách dùng một hash `NTLM (NT LAN Manager)` hoặc Kerberos key bị đánh cắp, mà không cần crack mật khẩu gốc tạo ra hash đó. Cuộc tấn công dùng hash này để tạo một `Kerberos TGT (Ticket-Granting Ticket)` nhằm xác thực với Active Directory (AD).

Khi kẻ tấn công dùng Overpass-the-Hash, chúng có hash `NTLM` của mật khẩu người dùng, và hash này được dùng để tạo một `AS-REQ (Authentication Service Request)` gửi tới `Key Distribution Center (KDC)`. Để trông như hợp lệ, `AS-REQ` chứa một field `PRE-AUTH`, trong đó có một timestamp đã mã hoá (`Enc-Timestamp`). Thông thường, client hợp lệ dùng field này để chứng minh rằng mình biết mật khẩu của người dùng, vì timestamp được mã hoá bằng hash mật khẩu của người dùng. Trong kịch bản tấn công này, hash dùng để mã hoá timestamp không được dẫn xuất từ mật khẩu thật mà chính là hash NTLM bị đánh cắp. Cụ thể hơn, trong một cuộc tấn công `Overpass-the-Hash`, kẻ tấn công không dùng hash này để mã hoá `Enc-Timestamp`. Thay vào đó, kẻ tấn công dùng trực tiếp hash NTLM bị đánh cắp để tính toán Kerberos `AS-REQ`, bỏ qua quy trình Kerberos thông thường vốn cần tới mật khẩu của người dùng và `Enc-Timestamp`. Về bản chất, kẻ tấn công "vượt qua" (overpass) quy trình xác thực thông thường dựa trên mật khẩu, nên kỹ thuật này mới có tên Overpass-the-Hash.

Một đặc điểm then chốt của kiểu tấn công này mà ta có thể tận dụng để phát hiện là `encryption type` (kiểu mã hoá) được dùng cho `Enc-Timestamp`. Một `AS-REQ` tiêu chuẩn từ client Windows hiện đại thường dùng kiểu mã hoá `AES256-CTS-HMAC-SHA1-96` cho Enc-Timestamp, nhưng một cuộc tấn công `Overpass-the-Hash` dùng hash NTLM cũ hơn sẽ dùng kiểu mã hoá `RC4-HMAC`. Sự khác biệt này có thể dùng làm chỉ dấu (indicator) của một cuộc tấn công tiềm ẩn.

---

Hãy xem lại tài liệu tham khảo đã dẫn ở trên, nơi bàn về các dấu vết mạng (network trace) do việc thực hiện tấn công `Overpass-the-Hash` tạo ra, rồi tiếp tục trả lời câu hỏi bên dưới.
