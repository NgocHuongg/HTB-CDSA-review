# Preparation Stage (Part 2) (Giai đoạn chuẩn bị – Phần 2)

Một phần khác của giai đoạn `Preparation` là bảo vệ tổ chức trước các incident. Dù việc bảo vệ không nhất thiết là trách nhiệm của đội xử lý sự cố (incident handling team), đội vẫn nên nắm được mọi hoạt động liên quan tới bảo vệ để hiểu rõ hơn loại và mức độ tinh vi của một incident, đồng thời biết cần tìm artifact hoặc bằng chứng ở đâu để hỗ trợ điều tra.

Giờ hãy cùng xem một số biện pháp bảo vệ được khuyến nghị cao, có tác động giảm thiểu (mitigation) lớn trước phần lớn các mối đe doạ.

---

## DMARC

[DMARC](https://dmarcly.com/blog/how-to-implement-dmarc-dkim-spf-to-stop-email-spoofing-phishing-the-definitive-guide#what-is-dmarc) là cơ chế bảo vệ email chống phishing, được xây dựng trên nền [SPF](https://dmarcly.com/blog/how-to-implement-dmarc-dkim-spf-to-stop-email-spoofing-phishing-the-definitive-guide#what-is-spf) và [DKIM](https://dmarcly.com/blog/how-to-implement-dmarc-dkim-spf-to-stop-email-spoofing-phishing-the-definitive-guide#what-is-dkim) vốn đã có sẵn. Ý tưởng của DMARC là từ chối các email 'giả danh' xuất phát từ tổ chức của chúng ta. Vì vậy, nếu kẻ tấn công giả mạo (spoof) một email, đóng giả một nhân viên yêu cầu thanh toán hoá đơn, hệ thống sẽ từ chối email đó trước khi nó tới được người nhận. DMARC dễ triển khai và không tốn kém; tuy nhiên, không thể nhấn mạnh đủ rằng việc kiểm thử kỹ lưỡng là bắt buộc; nếu không (và chuyện này xảy ra khá thường xuyên), ta có nguy cơ chặn cả email hợp lệ mà không có cách nào khôi phục lại.

Với các rule lọc email (email filtering rule), ta có thể đưa DMARC lên một tầm 'cao hơn' và áp dụng thêm lớp bảo vệ đối với các email fail DMARC đến từ những domain không thuộc sở hữu của ta. Điều này khả thi vì một số hệ thống email sẽ thực hiện kiểm tra DMARC và chèn vào phần header của thư một header cho biết DMARC pass hay fail. Dù cách này có thể cực kỳ hiệu quả để phát hiện email phishing từ bất kỳ domain nào, nó cần được kiểm thử rộng rãi trước khi đưa vào môi trường production. Nguồn false positive lớn ở đây là các email được gửi 'on behalf of' (gửi thay mặt) thông qua một dịch vụ gửi email nào đó, vì chúng thường fail DMARC do domain không khớp.

---

## Hardening endpoint (& EDR)

Các thiết bị endpoint (workstation, laptop, v.v.) là điểm vào của phần lớn các cuộc tấn công mà ta phải đối mặt hằng ngày. Xét rằng hầu hết các mối đe doạ đều bắt nguồn từ Internet và nhắm vào người dùng đang duyệt web, mở file đính kèm hoặc chạy file thực thi độc hại, một tỷ lệ đáng kể các hoạt động này sẽ diễn ra trên endpoint của công ty.

Hiện nay có một vài tiêu chuẩn hardening endpoint được công nhận rộng rãi, phổ biến nhất là baseline của CIS và Microsoft, và đây thực sự nên là nền tảng để xây dựng các baseline hardening của tổ chức. Một số hành động rất quan trọng (và thực sự hiệu quả) cần lưu ý và thực hiện:

- Tắt LLMNR/NetBIOS.
- Triển khai LAPS và gỡ quyền quản trị (administrative privileges) khỏi người dùng thông thường.
- Tắt PowerShell hoặc cấu hình PowerShell chạy ở chế độ "ConstrainedLanguage".
- Bật các rule Attack Surface Reduction (ASR) nếu dùng Microsoft Defender.
- Triển khai whitelisting (danh sách cho phép). Chúng ta biết việc này gần như không thể triển khai được. Hãy cân nhắc ít nhất là chặn thực thi từ các thư mục mà người dùng có quyền ghi (Downloads, Desktop, AppData, v.v.). Đây là những vị trí mà exploit và payload độc hại sẽ xuất hiện đầu tiên. Nhớ chặn cả các loại script như .hta, .vbs, .cmd, .bat, .js và tương tự. Cần chú ý tới các file [LOLBin](https://lolbas-project.github.io/) khi triển khai whitelisting. Đừng bỏ qua chúng; chúng thực sự được dùng ngoài thực tế (in the wild) làm initial access để vượt qua whitelisting.
- Sử dụng firewall trên host (host-based firewall). Tối thiểu, hãy chặn giao tiếp giữa các workstation với nhau và chặn traffic outbound tới các LOLBin.
- Triển khai một sản phẩm EDR. Ở thời điểm hiện tại, [AMSI](https://learn.microsoft.com/en-us/windows/win32/amsi/how-amsi-helps) mang lại khả năng quan sát (visibility) rất tốt đối với các script bị obfuscate, cho phép sản phẩm antimalware kiểm tra nội dung trước khi nó được thực thi. Rất nên chỉ chọn các sản phẩm có tích hợp với AMSI.

---

## Bảo vệ mạng

Phân đoạn mạng (network segmentation) là một kỹ thuật mạnh để ngăn một vụ xâm nhập (breach) lan ra toàn bộ tổ chức. Các hệ thống quan trọng với hoạt động kinh doanh (business-critical) phải được cô lập, và chỉ cho phép kết nối khi nghiệp vụ thực sự cần. Tài nguyên nội bộ không nên public trực tiếp ra Internet (trừ khi được đặt trong DMZ).

Ngoài ra, khi nói tới bảo vệ mạng, ta nên cân nhắc các hệ thống IDS/IPS (Intrusion Detection System/Intrusion Prevention System – hệ thống phát hiện/ngăn chặn xâm nhập). Sức mạnh của chúng thực sự phát huy khi thực hiện SSL/TLS interception (chặn và giải mã SSL/TLS), nhờ đó chúng có thể nhận diện traffic độc hại dựa trên nội dung đi trên đường truyền, chứ không dựa vào danh tiếng (reputation) của địa chỉ IP — một cách phát hiện traffic độc hại truyền thống và rất kém hiệu quả.

Ngoài ra, cần đảm bảo chỉ những thiết bị được tổ chức phê duyệt mới có thể truy cập mạng. Có thể dùng các giải pháp như 802.1x để giảm rủi ro từ thiết bị cá nhân (bring your own device – BYOD) hoặc thiết bị độc hại kết nối vào mạng công ty. Nếu là công ty chỉ dùng cloud, ví dụ dùng Azure/Azure AD (nay gọi là Microsoft Entra ID), ta có thể đạt được mức bảo vệ tương tự bằng các policy Conditional Access, chỉ cho phép truy cập tài nguyên của tổ chức khi kết nối từ thiết bị do công ty quản lý.

---

## Privilege Identity Management / MFA / Mật khẩu

Ở thời điểm hiện tại, đánh cắp thông tin đăng nhập của người dùng đặc quyền là con đường leo thang (escalation path) phổ biến nhất trong môi trường Active Directory. Ngoài ra, một sai lầm thường gặp là người dùng admin hoặc có mật khẩu yếu (dù thường phức tạp), hoặc dùng chung mật khẩu với tài khoản người dùng thông thường của họ (mật khẩu này có thể bị lấy qua nhiều vector tấn công như keylogging). Để tham khảo, một mật khẩu yếu nhưng phức tạp là "Password1!". Nó gồm chữ hoa, chữ thường, số và ký tự đặc biệt, nhưng dù vậy vẫn dễ đoán và có thể tìm thấy trong nhiều danh sách mật khẩu (password list) mà kẻ tấn công dùng trong các cuộc tấn công. Nên hướng dẫn nhân viên dùng passphrase (cụm mật khẩu) vì chúng khó đoán hơn và khó brute force. Một ví dụ về passphrase dễ nhớ nhưng dài và phức tạp là "i LIK3 my coffeE warm". Nếu biết thêm một ngoại ngữ, ta có thể trộn từ của nhiều ngôn ngữ để tăng cường bảo vệ.

Xác thực đa yếu tố (Multi-factor authentication – MFA) là một giải pháp bảo vệ danh tính khác, cần được triển khai ít nhất cho mọi loại truy cập quản trị vào `all` (tất cả) ứng dụng và thiết bị.

---

## Quét lỗ hổng

Thực hiện quét lỗ hổng (vulnerability scan) liên tục trong môi trường của chúng ta và khắc phục (remediate) ít nhất các lỗ hổng mức "High" và "Critical" được phát hiện. Dù việc quét có thể tự động hoá, việc sửa lỗi thường cần can thiệp thủ công. Nếu vì lý do nào đó không thể áp dụng bản vá, ta nhất định phải phân đoạn (segment) các hệ thống có lỗ hổng.

---

## Đào tạo nâng cao nhận thức người dùng

Đào tạo người dùng nhận biết hành vi đáng ngờ và báo cáo khi phát hiện là một thắng lợi lớn cho chúng ta. Dù khó đạt tỷ lệ thành công 100% ở việc này, các buổi đào tạo như vậy được biết là giúp giảm đáng kể số vụ xâm nhập thành công. Các bài kiểm tra "bất ngờ" định kỳ cũng nên là một phần của chương trình đào tạo, ví dụ như email phishing hằng tháng, USB được để rơi trong toà nhà văn phòng, v.v.

---

## Đánh giá bảo mật Active Directory

Cách tốt nhất để phát hiện các cấu hình bảo mật sai (security misconfiguration) hoặc lỗ hổng nghiêm trọng bị phơi bày là tìm chúng từ góc nhìn của kẻ tấn công. Tự thực hiện đánh giá (hoặc thuê bên thứ ba nếu tổ chức thiếu kỹ năng) sẽ đảm bảo rằng khi một endpoint bị xâm nhập, kẻ tấn công sẽ không có khả năng leo thang lên đặc quyền cao trong mạng chỉ bằng một bước. Kẻ tấn công càng phải dùng thêm nhiều công cụ và tạo ra nhiều hoạt động thì khả năng ta phát hiện chúng càng cao, vì vậy ta cố gắng loại bỏ càng nhiều càng tốt những "chiến thắng dễ dàng" và "quả chín thấp" (low-hanging fruit).

Active Directory có một số con đường leo thang/lỗi (escalation path/bug) đã biết và mang tính đặc thù. Những cái mới cũng khá thường xuyên được phát hiện. Đánh giá bảo mật Active Directory là yếu tố then chốt đối với tư thế bảo mật (security posture) của toàn bộ môi trường. Ta không mặc định rằng các quản trị viên hệ thống nắm được mọi lỗi đã được phát hiện hoặc công bố, vì trên thực tế, nhiều khả năng là họ không nắm hết.

---

## Bài tập Purple Team

Chúng ta cần đào tạo các incident handler và giữ cho họ luôn gắn bó với công việc. Điều đó là không phải bàn cãi, và nơi tốt nhất để làm việc này là ngay trong môi trường của chính tổ chức. Bài tập purple team về cơ bản là các đợt đánh giá bảo mật do red team thực hiện, trong đó red team liên tục hoặc sau cùng thông báo cho blue team về các hành động, phát hiện, mọi thiếu sót về khả năng quan sát (visibility) hay bảo mật, v.v. Những bài tập như vậy giúp xác định lỗ hổng trong tổ chức, đồng thời kiểm tra năng lực phòng thủ của blue team về logging, monitoring, phát hiện và khả năng phản ứng. Nếu một mối đe doạ không bị phát hiện, đó là cơ hội để cải thiện. Với những mối đe doạ bị phát hiện, blue team có thể kiểm thử các playbook và quy trình xử lý sự cố để đảm bảo chúng chặt chẽ và đạt được kết quả mong đợi.

Để luyện tập các bài tập liên quan tới purple team, bạn có thể tham khảo các module như [Intro to Academy's Purple Modules](https://academy.hackthebox.com/module/details/257) và [Detection & OpSec Cyber Range](https://academy.hackthebox.com/module/details/285), vốn cung cấp môi trường để thực hành purple team.
