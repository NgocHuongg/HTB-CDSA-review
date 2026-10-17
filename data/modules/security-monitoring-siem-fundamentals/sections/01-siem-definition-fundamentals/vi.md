# SIEM Definition & Fundamentals (Định nghĩa và kiến thức nền tảng về SIEM)


## SIEM là gì?

Đóng vai trò then chốt trong lĩnh vực bảo vệ hệ thống máy tính, Security Information and Event Management (SIEM – quản lý thông tin và sự kiện bảo mật) bao gồm việc sử dụng các sản phẩm và giải pháp phần mềm kết hợp việc quản lý dữ liệu bảo mật với việc giám sát các security event (sự kiện bảo mật). Các công cụ này cho phép đánh giá theo thời gian thực các alert liên quan đến bảo mật do phần cứng mạng và ứng dụng tạo ra.

Công cụ SIEM có rất nhiều chức năng cốt lõi, chẳng hạn như thu thập và quản lý log event, khả năng phân tích log event và dữ liệu bổ sung từ nhiều nguồn khác nhau, cũng như các tính năng vận hành như xử lý sự cố (incident handling), tóm tắt trực quan và lập tài liệu.

Nhờ ứng dụng các công nghệ SIEM, nhân sự IT có thể phát hiện các cuộc tấn công mạng ngay khi chúng xảy ra, thậm chí trước khi chúng xảy ra, từ đó tăng tốc độ phản ứng trong quá trình xử lý sự cố. Do đó, SIEM đóng vai trò không thể thiếu đối với hiệu quả và việc giám sát liên tục khung bảo mật thông tin của một công ty. Nó là nền tảng cho chiến lược bảo mật của tổ chức, mang lại một phương pháp toàn diện để nhận diện và xử lý các mối đe doạ tiềm ẩn.

---

## Sự phát triển của công nghệ SIEM

Thuật ngữ viết tắt "SIEM" ra đời từ sự hợp tác của hai analyst của Gartner, khi họ đề xuất một khung thông tin bảo mật mới tích hợp hai công nghệ có trước: Security Information Management (SIM – quản lý thông tin bảo mật) và Security Event Management (SEM – quản lý sự kiện bảo mật). Đề xuất này xuất hiện trong một bài viết năm 2005 của Gartner có tựa đề "Enhance IT Security through Vulnerability Management."

Công nghệ SIM thế hệ đầu được xây dựng dựa trên các hệ thống quản lý thu thập log truyền thống, cho phép lưu trữ dài hạn, phân tích và báo cáo dữ liệu log, đồng thời kết hợp log với threat intelligence (thông tin tình báo về mối đe doạ). Ngược lại, công nghệ SEM thế hệ thứ hai xử lý các security event bằng cách hợp nhất, tương quan (correlation) và gửi thông báo về các event từ nhiều thiết bị bảo mật khác nhau như phần mềm antivirus, firewall, Intrusion Detection Systems (IDS), cùng với các event được báo cáo trực tiếp từ cơ chế xác thực, SNMP trap, server và cơ sở dữ liệu.

Trong những năm sau đó, các nhà cung cấp đã kết hợp khả năng của SIM và SEM để tạo ra SIEM, dẫn tới một định nghĩa mới theo nghiên cứu của Gartner. Công nghệ mới này được chấp nhận rộng rãi vì nó mang lại một phương pháp toàn diện để phát hiện và xử lý mối đe doạ, bao gồm khả năng thu thập, lưu giữ và phân tích kỹ log cũng như security event từ nhiều nguồn khác nhau.

---

## Một giải pháp SIEM hoạt động như thế nào?

Hệ thống SIEM hoạt động bằng cách thu thập dữ liệu từ nhiều nguồn khác nhau, bao gồm PC, thiết bị mạng, server, v.v. Dữ liệu này sau đó được chuẩn hoá và hợp nhất để việc phân tích trở nên dễ dàng hơn.

Các nền tảng SIEM được vận hành bởi các chuyên gia bảo mật, những người phân tích kỹ dữ liệu nhằm nhận diện và phát hiện các mối đe doạ tiềm ẩn. Quy trình này giúp doanh nghiệp tìm ra các vụ vi phạm bảo mật (security breach) và xem xét các alert, mang lại những hiểu biết quan trọng về tình trạng bảo mật của tổ chức.

Alert thông báo cho nhân sự Security Operations/Monitoring rằng họ cần xem xét một security event hoặc incident (có thể xảy ra). Các thông báo này thường ngắn gọn và cho nhân viên biết về một cuộc tấn công cụ thể nhắm vào hệ thống thông tin của tổ chức. Alert có thể được gửi qua nhiều kênh, chẳng hạn email, thông báo pop-up trên console, tin nhắn văn bản hoặc cuộc gọi tới điện thoại thông minh.

Hệ thống SIEM tạo ra rất nhiều alert do lượng event khổng lồ phát sinh từ mỗi nền tảng được giám sát. Không hiếm khi log event trong một giờ lên tới hàng trăm đến hàng nghìn event. Vì vậy, việc tinh chỉnh (fine-tuning) SIEM để phát hiện và cảnh báo các event có rủi ro cao là cực kỳ quan trọng.

Khả năng xác định chính xác các event rủi ro cao chính là điều phân biệt SIEM với các công cụ giám sát và phát hiện mạng khác, như Intrusion Prevention Systems (IPS) hay Intrusion Detection Systems (IDS). SIEM không thay thế khả năng ghi log của các thiết bị này; thay vào đó, nó hoạt động cùng với chúng bằng cách xử lý và hợp nhất dữ liệu log của chúng để nhận diện các event có khả năng dẫn tới việc hệ thống bị khai thác. Bằng cách tích hợp dữ liệu từ nhiều nguồn, các giải pháp SIEM mang lại một chiến lược toàn diện cho việc phát hiện và xử lý mối đe doạ.

---

## Yêu cầu nghiệp vụ & use case của SIEM

#### Log Aggregation & Normalization (Tổng hợp & chuẩn hoá log)

Tầm quan trọng của khả năng nhìn thấy mối đe doạ (threat visibility) thông qua việc hợp nhất log mà hệ thống SIEM mang lại là không thể xem nhẹ. Nếu thiếu nó, an ninh mạng của một tổ chức cũng chẳng có giá trị hơn một cái chặn giấy. Việc hợp nhất log đòi hỏi thu thập hàng terabyte thông tin bảo mật từ các firewall quan trọng, các cơ sở dữ liệu bảo mật và các ứng dụng thiết yếu. Quá trình này giúp đội SOC phân tích dữ liệu và nhận ra các mối liên hệ, cải thiện đáng kể khả năng nhìn thấy mối đe doạ.

Sử dụng tính năng hợp nhất log của SIEM, đội SOC có thể nhận diện và phân tích kỹ các security incident và event trên toàn bộ hạ tầng IT của tổ chức. Bằng cách tập trung hoá và tương quan thông tin từ nhiều nguồn khác nhau, SIEM mang lại một chiến lược toàn diện để phát hiện và xử lý mối đe doạ. Cách tiếp cận này giúp tổ chức nhận ra các mẫu (pattern), xu hướng và bất thường có thể là dấu hiệu của rủi ro bảo mật tiềm ẩn. Nhờ đó, đội SOC có thể phản ứng nhanh chóng và hiệu quả với các security incident, giảm thiểu hậu quả cho tổ chức.

#### Threat Alerting (Cảnh báo mối đe doạ)

Việc có một giải pháp SIEM có thể nhận diện và thông báo cho đội bảo mật IT về các mối đe doạ có thể xảy ra trong khối lượng khổng lồ dữ liệu security event thu thập được là điều thiết yếu. Tính năng này rất quan trọng vì nó giúp đội bảo mật IT tiến hành điều tra nhanh hơn, có trọng tâm hơn và phản ứng với các security incident tiềm ẩn một cách kịp thời và hiệu quả.

Các giải pháp SIEM sử dụng phân tích nâng cao (advanced analytics) và threat intelligence để nhận diện mối đe doạ tiềm ẩn và tạo alert theo thời gian thực. Khi phát hiện một mối đe doạ, hệ thống sẽ chuyển alert tới đội bảo mật IT, cung cấp cho họ các chi tiết cần thiết để điều tra và giảm thiểu rủi ro một cách hiệu quả. Bằng cách cảnh báo kịp thời cho đội bảo mật IT, các giải pháp SIEM giúp giảm thiểu tác động tiềm tàng của các security incident và bảo vệ các tài sản quan trọng của tổ chức.

#### Contextualization & Response (Đặt vào ngữ cảnh & phản ứng)

Cần hiểu rằng chỉ tạo ra alert thôi là chưa đủ. Nếu một giải pháp SIEM gửi alert cho mọi security event có thể xảy ra, đội bảo mật IT sẽ sớm bị quá tải bởi số lượng alert khổng lồ, và false positive (cảnh báo nhầm) có thể trở thành vấn đề thường xuyên, đặc biệt ở các giải pháp cũ. Do đó, việc đặt mối đe doạ vào ngữ cảnh (threat contextualization) là rất quan trọng để sàng lọc alert, xác định các tác nhân liên quan đến security event, các phần của mạng bị ảnh hưởng và thời điểm xảy ra.

Contextualization giúp đội bảo mật IT nhận diện các mối đe doạ tiềm ẩn thực sự và hành động nhanh chóng. Các quy trình cấu hình tự động có thể lọc bớt một số mối đe doạ đã được đặt vào ngữ cảnh, giảm số lượng alert mà đội nhận được.

Một giải pháp SIEM lý tưởng nên cho phép doanh nghiệp trực tiếp xử lý mối đe doạ, thường là bằng cách tạm dừng hoạt động trong khi tiến hành điều tra. Cách tiếp cận này giúp giảm thiểu tác động tiềm tàng của các security incident và bảo vệ các tài sản quan trọng của tổ chức. Các giải pháp SIEM cung cấp ngữ cảnh và tự động hoá việc lọc mối đe doạ, giúp đội bảo mật IT tập trung vào các mối đe doạ thực sự, giảm alert fatigue (tình trạng "mệt mỏi vì alert") và nâng cao hiệu suất cũng như hiệu quả của incident response.

#### Compliance (Tuân thủ)

Các giải pháp SIEM đóng vai trò quan trọng trong việc tuân thủ (compliance) bằng cách hỗ trợ tổ chức đáp ứng các yêu cầu pháp lý thông qua một cách tiếp cận toàn diện để phát hiện và xử lý mối đe doạ.

Các quy định như PCI DSS, HIPAA và GDPR bắt buộc tổ chức triển khai các biện pháp bảo mật mạnh mẽ, bao gồm giám sát và phân tích lưu lượng mạng theo thời gian thực. Các giải pháp SIEM có thể giúp tổ chức đáp ứng các yêu cầu này, cho phép đội SOC phát hiện và phản ứng kịp thời với các security incident.

Các giải pháp SIEM cũng cung cấp khả năng báo cáo và kiểm toán (auditing) tự động, vốn rất cần thiết cho việc tuân thủ. Những tính năng này cho phép tổ chức lập báo cáo tuân thủ nhanh chóng và chính xác, đảm bảo họ đáp ứng các yêu cầu pháp lý và có thể chứng minh sự tuân thủ với kiểm toán viên và cơ quan quản lý.

---

## Luồng dữ liệu trong một SIEM

Bây giờ hãy xem qua cách dữ liệu di chuyển bên trong một SIEM cho tới khi sẵn sàng để phân tích.

1. Các giải pháp SIEM tiếp nhận (ingest) log từ nhiều nguồn dữ liệu khác nhau. Mỗi công cụ SIEM có những khả năng riêng để thu thập log từ các nguồn khác nhau. Quá trình này được gọi là data ingestion hoặc data collection (thu thập dữ liệu).

2. Dữ liệu thu thập được sẽ được xử lý và chuẩn hoá để correlation engine (bộ máy tương quan) của SIEM có thể hiểu được. Dữ liệu thô phải được ghi hoặc đọc theo một định dạng mà SIEM hiểu được, và được chuyển đổi từ nhiều loại tập dữ liệu khác nhau về một định dạng chung. Quá trình này được gọi là data normalization (chuẩn hoá dữ liệu) và data aggregation (tổng hợp dữ liệu).

3. Cuối cùng là phần quan trọng nhất của SIEM, nơi đội SOC sử dụng dữ liệu đã chuẩn hoá do SIEM thu thập để tạo ra các detection rule, dashboard, visualization, alert và incident. Điều này giúp đội SOC nhận diện các rủi ro bảo mật tiềm ẩn và phản ứng nhanh với các security incident.

---

## Lợi ích của việc sử dụng một giải pháp SIEM

Rõ ràng là lợi ích của việc triển khai một hệ thống Security Information and Event Management (SIEM) vượt xa những rủi ro tiềm ẩn của việc không có nó, với giả định rằng biện pháp kiểm soát bảo mật đó đang bảo vệ một thứ có tầm quan trọng cao hơn.

Nếu không có SIEM, nhân sự IT sẽ không có cái nhìn tập trung về toàn bộ log và event, dẫn tới khả năng bỏ sót các event quan trọng và tồn đọng một lượng lớn event đang chờ điều tra. Ngược lại, một SIEM được hiệu chỉnh đúng cách sẽ củng cố quy trình incident response, nâng cao hiệu suất và cung cấp một dashboard tập trung cho các thông báo dựa trên các danh mục và ngưỡng event được định sẵn.

Ví dụ, nếu firewall ghi nhận năm lần đăng nhập sai liên tiếp khiến tài khoản admin bị khoá, thì cần có một hệ thống ghi log tập trung có khả năng tương quan toàn bộ log để giám sát tình huống đó. Tương tự, một phần mềm lọc web ghi nhận một máy tính kết nối tới một website độc hại 100 lần trong một giờ có thể được xem xét và xử lý ngay trong một giao diện duy nhất nhờ SIEM.

Các SIEM hiện đại thường tích hợp sẵn khả năng phát hiện các ngưỡng giới hạn có thể cấu hình và các event trong những khung thời gian cụ thể, đồng thời cung cấp bản tóm tắt và báo cáo tuỳ chỉnh. Các SIEM tinh vi hơn hiện nay còn tích hợp AI để cảnh báo dựa trên phân tích hành vi và mẫu (pattern).

Khả năng báo cáo và thông báo của SIEM giúp nhân sự IT nhanh chóng phản ứng và xử lý các sự cố tiềm ẩn, nhấn mạnh khả năng nhận diện các cuộc tấn công độc hại trước khi chúng xảy ra. Khả năng này có thể giảm chi phí liên quan đến một vụ vi phạm bảo mật toàn diện, giúp tổ chức tránh được những thiệt hại đáng kể về tài chính và danh tiếng.

Nhiều tổ chức chịu sự quản lý chặt chẽ, chẳng hạn trong lĩnh vực Ngân hàng, Tài chính, Bảo hiểm và Y tế, bắt buộc phải có một SIEM được quản lý, triển khai on-premise hoặc trên cloud. Hệ thống SIEM cung cấp bằng chứng cho thấy các hệ thống đang được giám sát, ghi log, rà soát và tuân thủ các chính sách lưu giữ log, đáp ứng các tiêu chuẩn tuân thủ như ISO và HIPAA.
