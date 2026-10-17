# Communications (Truyền thông)

Giữa bất kỳ cuộc khủng hoảng nào, truyền thông hiệu quả không chỉ có lợi mà còn mang tính sống còn. Mức độ hệ trọng còn cao hơn nữa trong một sự cố bảo mật, khi sự minh bạch, các nỗ lực phản ứng có phối hợp và việc xây dựng lòng tin với các bên liên quan (stakeholder) là tối quan trọng.

Hãy cùng phân tích các khía cạnh khác nhau của truyền thông và làm nổi bật một số thành phần chính.

## Tầm quan trọng của truyền thông hiệu quả

Tầm quan trọng của việc truyền thông khéo léo có nhiều mặt và có thể được chia thành các nhóm sau:

#### Lòng tin của các bên liên quan

Truyền thông minh bạch và mạch lạc đóng vai trò quan trọng trong việc giữ gìn lòng tin của các bên liên quan trong suốt sự cố. Nó là minh chứng cho tinh thần trách nhiệm, sự minh bạch và khả năng làm chủ tình hình của tổ chức.

#### Phối hợp & hiệu quả

Sự thống nhất giữa tất cả các bên tham gia đặc biệt quan trọng. Một sự cố an ninh mạng không phải là sự kiện riêng lẻ chỉ ảnh hưởng đến đội kỹ thuật; nó có những tác động rộng hơn đến toàn tổ chức. Giữ cho mọi người cùng nắm một thông tin thống nhất không chỉ là điều nên làm mà còn là điều thiết yếu.

#### Tuân thủ quy định (Regulatory Compliance)

Bắt buộc phải đối chiếu kỹ các yêu cầu tuân thủ quy định áp dụng riêng cho tổ chức của bạn. Các hướng dẫn này cần được ghi rõ trong Incident Response Plan (IRP – kế hoạch ứng phó sự cố) của bạn.

---

## Truyền thông nội bộ (Internal Communications)

Dù thường bị xem nhẹ, truyền thông nội bộ đóng vai trò then chốt trong việc truyền tải một thông điệp nhất quán trong toàn tổ chức. Điều này càng trở nên quan trọng khi xảy ra rò rỉ thông tin — chuyện vốn không hiếm trong môi trường doanh nghiệp. Hãy cùng xem một số thành phần chính của truyền thông nội bộ:

#### Thông báo ngay lập tức

Ngay khi ghi nhận một sự cố, các bên liên quan phải được thông báo kịp thời.

#### Cập nhật thường xuyên

Cần gửi các bản tóm tắt (briefing) nhất quán, định kỳ tới tất cả các đội tham gia. Điều này đảm bảo mọi người có chung hiểu biết về trạng thái của sự cố, những hệ quả tiềm tàng của nó, và mọi hành động đang chờ xử lý.

#### Vòng phản hồi (Feedback Loop)

Cần thiết lập một vòng phản hồi làm kênh để các đội trao đổi phát hiện, nêu lên mối lo ngại hoặc đưa ra đề xuất.

---

## Truyền thông bên ngoài (External Communications)

Truyền thông bên ngoài cũng quan trọng không kém và thường liên quan đến nhiều bên thứ ba khác nhau, từ khách hàng cho đến các cơ quan chính phủ và cơ quan quản lý. Việc xử lý trong bối cảnh này đòi hỏi sự khéo léo và lập kế hoạch cẩn thận. Dưới đây là một số khía cạnh chính cần cân nhắc:

#### Các bên bị ảnh hưởng

Cần thiết lập liên lạc trực tiếp với bất kỳ bên nào bị sự cố ảnh hưởng, dù đó là khách hàng, thân chủ hay đối tác kinh doanh.

#### Tuyên bố công khai

Với các sự cố có quy mô đáng kể, có thể cần đưa ra một tuyên bố công khai (public statement). Tuyên bố như vậy cần rõ ràng và tránh dùng thuật ngữ quá chuyên môn để không gây nhầm lẫn cho khách hàng và các bên thứ ba khác.

#### Cơ quan quản lý

Tuỳ theo khu vực pháp lý (jurisdiction) và bản chất của sự cố, bạn có thể có nghĩa vụ phải thông báo cho các cơ quan quản lý như Information Commissioner's Office (ICO) trong một khung thời gian quy định.

---

## Định hướng các kênh truyền thông trong sự cố an ninh mạng

Khi chúng ta gặp phải một sự cố an ninh mạng, cách chúng ta truyền thông trở thành yếu tố then chốt cho cả tư thế bảo mật (security posture) lẫn tình trạng tuân thủ của chúng ta. Hãy cùng phân tích bức tranh kỹ thuật của các kênh truyền thông này và những hệ quả đan xen của chúng.

1. **Khía cạnh bảo mật của các kênh truyền thông**:
	- `Encryption`: Chúng ta phải đảm bảo mọi thông tin được chia sẻ đều được bọc trong lớp mã hoá đầu-cuối (end-to-end encryption) mạnh mẽ. Đây là điều không thể thương lượng, đặc biệt khi chúng ta thảo luận các chi tiết cụ thể của sự cố, chẳng hạn hệ thống nào bị tấn công hay lỗ hổng nào bị khai thác.
	- `Authentication and Authorization`: Quyền truy cập vào các kênh truyền thông của chúng ta phải được kiểm soát chặt chẽ như Fort Knox. Không thể nhấn mạnh đủ tầm quan trọng của xác thực đa yếu tố (MFA) để kiểm tra kỹ danh tính của những người đang cố truy cập kênh.
	- `Data Integrity`: Chúng ta cần chắc chắn rằng các thông điệp không bị thay đổi trong quá trình truyền. Các kỹ thuật băm mật mã (cryptographic hashing) có thể là lựa chọn tốt nhất để đảm bảo tính toàn vẹn của thông tin liên lạc.
	- `Ephemeral Communications`: Với những cuộc thảo luận tối mật, chúng ta có thể cân nhắc dùng các nền tảng nhắn tin tự huỷ tin nhắn sau khi đọc. Điều này giảm thiểu rủi ro bất kỳ con mắt tò mò nào truy cập dữ liệu nhạy cảm của chúng ta về sau.
	- `Air-Gapped Communications`: Trong những tình huống chúng ta nghi ngờ hạ tầng truyền thông chính có thể đang bị đe doạ, có thể cần chuyển sang dùng các hệ thống air-gapped (cách ly vật lý). Các hệ thống này là tuyến phòng thủ cuối cùng của chúng ta, hoàn toàn tách biệt khỏi các mạng khác có khả năng đã bị xâm phạm.

2. **Khía cạnh pháp lý (quy định) của các kênh truyền thông**:
	- `Data Privacy Laws`: Chúng ta đang hoạt động trong một thế giới mà các quy định về quyền riêng tư dữ liệu, như GDPR của EU, có ảnh hưởng rất lớn. Nếu chúng ta thảo luận hoặc chia sẻ dữ liệu cá nhân, đặc biệt là của cư dân EU, chúng ta cần tuân thủ nghiêm ngặt các yêu cầu của GDPR.
	- `Breach Notification Mandates`: Một số khu vực pháp lý có quy định rõ ràng về thời hạn thông báo vụ xâm phạm (breach). Chúng ta cần nắm rõ các quy định này khi truyền thông về các vụ xâm phạm dữ liệu, đảm bảo không chỉ kịp thời mà còn tuân thủ các hướng dẫn về nội dung mà các luật này đặt ra.
	- `Record-Keeping`: Dù vì lý do bảo mật chúng ta có thể nghiêng về tin nhắn tự huỷ, một số quy định lại yêu cầu lưu giữ hồ sơ rõ ràng về mọi thông tin liên lạc liên quan đến sự cố. Đây là chuyện đi trên dây, nhưng chúng ta cần tìm được điểm cân bằng đó.
	- `Cross-Border Communications`: Khi sự cố lan ra ngoài biên giới quốc gia, cuộc chơi truyền thông sẽ thay đổi. Một số quốc gia có luật chủ quyền dữ liệu (data sovereignty) nghiêm ngặt, quy định cách thức và địa điểm truyền tải, lưu trữ dữ liệu.
	- `Chain of Custody`: Nếu có dù chỉ một dấu hiệu cho thấy có thể sẽ có hành động pháp lý sau sự cố, chúng ta cần duy trì một chuỗi lưu giữ bằng chứng (chain of custody) không bị đứt quãng cho mọi thông tin liên lạc. Điều này đảm bảo rằng nếu cần trình bằng chứng trước toà, nó sẽ được chấp nhận.
