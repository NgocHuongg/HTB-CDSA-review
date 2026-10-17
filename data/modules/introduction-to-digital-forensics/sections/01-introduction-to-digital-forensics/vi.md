# Introduction to Digital Forensics (Giới thiệu về Digital Forensics)

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0"> Cần nói rõ rằng module này không nhằm trở thành một chương trình toàn diện hay đầy đủ về Digital Forensics. Module cung cấp một nền tảng vững chắc cho SOC analyst, giúp họ tự tin xử lý các tác vụ Digital Forensics chủ chốt. Trọng tâm chính của module là phân tích hoạt động độc hại trong môi trường Windows. </p>
    </div>
</div>

`Digital forensics`, thường được gọi là computer forensics hay cyber forensics (điều tra số), là một nhánh chuyên sâu của an ninh mạng, bao gồm việc thu thập, bảo quản, phân tích và trình bày bằng chứng số (digital evidence) để điều tra các sự cố an ninh mạng, hoạt động tội phạm và vi phạm bảo mật. Nó áp dụng các kỹ thuật forensic lên các artifact số, bao gồm máy tính, server, thiết bị di động, mạng và phương tiện lưu trữ, nhằm làm sáng tỏ sự thật đằng sau các sự kiện liên quan đến không gian mạng. Digital forensics hướng tới việc tái dựng timeline (dòng thời gian), xác định các hoạt động độc hại, đánh giá tác động của sự cố và cung cấp bằng chứng cho các thủ tục pháp lý hoặc quy định. Digital forensics là một phần không thể thiếu của quy trình incident response (ứng phó sự cố), đóng góp những hiểu biết và hỗ trợ quan trọng ở nhiều giai đoạn khác nhau.

**Các khái niệm chính**:

- `Electronic Evidence`: Digital forensics làm việc với bằng chứng điện tử, có thể gồm file, email, log, cơ sở dữ liệu, lưu lượng mạng (network traffic) và nhiều thứ khác. Bằng chứng này được thu thập từ máy tính, thiết bị di động, server, dịch vụ cloud và các nguồn số khác.
- `Preservation of Evidence`: Đảm bảo tính toàn vẹn (integrity) và tính xác thực (authenticity) của bằng chứng số là rất quan trọng. Cần tuân thủ đúng quy trình để bảo quản bằng chứng, thiết lập chain of custody (chuỗi lưu giữ bằng chứng) và ngăn mọi thay đổi ngoài ý muốn.
- `Forensic Process`: Quy trình digital forensics thường gồm nhiều giai đoạn:
  - `Identification`: Xác định các nguồn bằng chứng tiềm năng.
  - `Collection`: Thu thập dữ liệu bằng các phương pháp đảm bảo tính forensic (forensically sound).
  - `Examination`: Kiểm tra dữ liệu đã thu thập để tìm thông tin liên quan.
  - `Analysis`: Diễn giải dữ liệu để rút ra kết luận về sự cố.
  - `Presentation`: Trình bày các phát hiện một cách rõ ràng, dễ hiểu.
- `Types of Cases`: Digital forensics được áp dụng trong nhiều loại vụ việc, bao gồm:
  - Điều tra tội phạm mạng (hacking, lừa đảo, đánh cắp dữ liệu).
  - Đánh cắp tài sản trí tuệ.
  - Điều tra hành vi sai phạm của nhân viên.
  - Rò rỉ dữ liệu (data breach) và các sự cố ảnh hưởng đến tổ chức.
  - Hỗ trợ tranh tụng trong các thủ tục pháp lý.
  
Các bước cơ bản để thực hiện một cuộc điều tra forensic như sau: 
1. `Create a Forensic Image`
2. `Document the System's State`
3. `Identify and Preserve Evidence`
4. `Analyze the Evidence`
5. `Timeline Analysis`
6. `Identify Indicators of Compromise (IOCs)`
7. `Report and Documentation`

## Digital Forensics cho SOC Analyst

Khi nói về Security Operations Center (SOC), ta đang nói về tuyến phòng thủ đầu tiên trước các mối đe doạ mạng. Nhưng điều gì xảy ra khi có một vụ xâm nhập (breach), hoặc khi phát hiện một bất thường (anomaly)? Đó là lúc digital forensics vào cuộc.

Trước hết, digital forensics cung cấp cho ta `detailed post-mortem of security incidents` (bản phân tích hậu kiểm chi tiết về các sự cố bảo mật). Bằng cách phân tích bằng chứng số, ta có thể lần lại các bước của kẻ tấn công, hiểu được phương thức, động cơ và thậm chí có thể cả danh tính của chúng. Phân tích hồi cứu này rất quan trọng để cải thiện khả năng phòng thủ và hiểu rõ các điểm yếu của chính mình.

Hơn nữa, trong lúc sự cố bảo mật đang diễn ra căng thẳng, thời gian là yếu tố then chốt. Các công cụ digital forensics có thể `rapidly sift through vast amounts of data, pinpointing the exact moment of compromise, the affected systems, and the nature of the malware or attack technique used` (nhanh chóng sàng lọc lượng dữ liệu khổng lồ, xác định chính xác thời điểm bị xâm nhập, các hệ thống bị ảnh hưởng và bản chất của malware hoặc kỹ thuật tấn công được sử dụng). Việc xác định nhanh này giúp ta ngăn chặn (contain) mối đe doạ sớm hơn, giảm thiểu thiệt hại có thể xảy ra.

Cũng đừng quên các hệ quả pháp lý. Khi xảy ra một vụ xâm nhập nghiêm trọng, đặc biệt là vụ ảnh hưởng đến khách hàng hoặc các bên liên quan, khả năng phát sinh hậu quả pháp lý là rất cao. Digital forensics không chỉ giúp ta xác định thủ phạm mà còn `provides legally admissible evidence` (cung cấp bằng chứng có giá trị pháp lý) có thể dùng trước toà. Bằng chứng này được ghi log, tính hash và gắn timestamp một cách tỉ mỉ để đảm bảo tính toàn vẹn và tính xác thực.

Ngoài ra, những hiểu biết thu được từ digital forensics giúp các đội SOC có thể `proactively hunt for threats` (chủ động săn tìm mối đe doạ). Thay vì chỉ phản ứng với alert, ta có thể chủ động tìm kiếm dấu hiệu xâm nhập trong môi trường của mình, tận dụng các indicator of compromise (IoC) và tactics, techniques, and procedures (TTP) đã xác định được từ các sự cố trước.

Một khía cạnh quan trọng khác là `enhancement of our incident response strategies` (nâng cao chiến lược incident response). Khi hiểu được toàn bộ phạm vi của một cuộc tấn công, ta có thể điều chỉnh phản ứng phù hợp hơn, đảm bảo mọi hệ thống bị xâm nhập đều được xử lý và không bỏ sót bất cứ điều gì. Cách tiếp cận toàn diện này giảm nguy cơ kẻ tấn công còn ẩn náu trong môi trường hoặc tái sử dụng cùng một attack vector lần thứ hai.

Cuối cùng, digital forensics `fosters a culture of continuous learning within our SOC teams` (nuôi dưỡng văn hoá học hỏi liên tục trong các đội SOC). Mỗi sự cố, dù nhỏ đến đâu, đều là một cơ hội học hỏi. Bằng cách mổ xẻ các sự cố này, analyst có thể luôn đi trước, dự đoán các kỹ thuật tấn công mới và củng cố khả năng phòng thủ tương ứng.

Tóm lại, `digital forensics isn't just a reactive measure; it's a proactive tool that amplifies the capabilities of our SOC analysts` (digital forensics không chỉ là biện pháp bị động; nó là công cụ chủ động giúp khuếch đại năng lực của SOC analyst), đảm bảo tổ chức luôn vững vàng trước các mối đe doạ mạng không ngừng biến đổi.
