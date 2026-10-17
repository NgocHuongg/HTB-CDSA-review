# Analysis in Practice (Phân tích trong thực tế)


Section trước đã định nghĩa network traffic analysis, các yếu tố phụ thuộc khi thực hiện phân tích traffic, và tầm quan trọng của nó. Section này sẽ phân tách một workflow (quy trình làm việc) để phân tích traffic, và ta sẽ làm quen với các thành phần chính của nó.

Đây không phải là một môn khoa học chính xác. Nó có thể là một quy trình rất linh hoạt và không phải là một vòng lặp thẳng. Nó chịu ảnh hưởng lớn bởi việc ta đang tìm gì (lỗi mạng hay hành vi độc hại) và bạn có visibility tới những phần nào của mạng. Tuy vậy, việc phân tích có thể được chắt lọc lại thành một vài nguyên tắc cơ bản. 

---  
## Descriptive Analysis (Phân tích mô tả)

Descriptive analysis là bước thiết yếu trong bất kỳ quá trình phân tích dữ liệu nào. Nó dùng để mô tả một tập dữ liệu dựa trên các đặc điểm riêng lẻ. Nó giúp phát hiện các lỗi có thể có trong quá trình thu thập dữ liệu và/hoặc các điểm bất thường (outlier) trong tập dữ liệu.

1. `What is the issue?` (Vấn đề là gì?)
   - Nghi ngờ có xâm nhập (breach)? Sự cố mạng? 
2. `Define our scope and the goal. (what are we looking for? which time period?)` (Xác định phạm vi và mục tiêu — ta đang tìm gì? trong khoảng thời gian nào?)
   - Mục tiêu: nhiều host có khả năng đang tải một file độc hại từ bad.example.com
   - Khi nào: trong vòng 48 giờ qua + 2 giờ tính từ bây giờ.
   - Thông tin hỗ trợ: tên file/loại file 'superbad.exe' 'new-crypto-miner.exe' 
3. `Define our target(s) (net / host(s) / protocol)` (Xác định đối tượng — mạng / host / giao thức)
   - Phạm vi: mạng 192.168.100.0/24, các giao thức được dùng là HTTP và FTP.

Dùng workflow này, ta sẽ xác định vấn đề, thứ ta đang tìm, thời điểm và nơi tìm ra nó. Descriptive analysis bao quát những khái niệm then chốt này cho quá trình phân tích của ta.

---
## Diagnostic Analysis (Phân tích chẩn đoán)  

Diagnostic analysis làm rõ nguyên nhân, hệ quả và sự tương tác giữa các điều kiện. Qua đó, nó cung cấp những hiểu biết có được nhờ tương quan (correlation) và diễn giải. Đặc trưng ở đây là góc nhìn hướng về quá khứ, giống như descriptive analytics có liên hệ chặt chẽ với nó, với khác biệt tinh tế là nó cố gắng tìm ra lý do của các sự kiện và diễn biến.

4. `Capture network traffic` (Capture network traffic)
   - Cắm vào một link có quyền truy cập tới mạng 192.168.100.0/24 để capture traffic trực tiếp, cố gắng bắt được một trong các file thực thi đang được truyền. Xem liệu admin có thể lấy dữ liệu PCAP và/hoặc netflow từ SIEM để có dữ liệu lịch sử hay không.
5. `Identification of required network traffic components (filtering)` (Xác định các thành phần network traffic cần thiết — lọc)
   - Khi đã có traffic, hãy lọc bỏ mọi packet không cần cho cuộc điều tra này, bao gồm: mọi traffic khớp với baseline thông thường, và giữ lại mọi thứ liên quan tới phạm vi điều tra. Ví dụ: HTTP và FTP từ subnet, mọi thứ có truyền tải hoặc chứa GET request tới các file thực thi bị nghi ngờ. 
6. `An understanding of captured network traffic` (Hiểu network traffic đã capture được)
   - Khi đã lọc bỏ nhiễu (noise), đã đến lúc đào sâu tìm mục tiêu — lọc theo những thứ như `ftp-data` để tìm các file đã được truyền và tái tạo (reconstruct) chúng. Với HTTP, ta có thể lọc theo `http.request.method == "GET"` để xem mọi GET request khớp với tên file mà ta đang tìm. Việc này có thể cho ta thấy ai đã lấy được các file đó, và có thể cả những lần truyền tải khác trong nội bộ mạng qua cùng các giao thức. 

Bằng cách capture traffic quanh nguồn gốc của vấn đề, loại bỏ mọi dữ liệu đã biết là bình thường, rồi dành thời gian kiểm tra và hiểu những gì còn lại, ta có thể xác định liệu đó có phải nguyên nhân gây ra vấn đề hay không. Làm như vậy, ta vừa thực hiện diagnostic analysis. Ta đang xác thực nguyên nhân gây ra vấn đề và xem xét các sự kiện xung quanh chúng. 

---
## Predictive Analysis (Phân tích dự đoán)

Bằng cách đánh giá dữ liệu lịch sử và hiện tại, predictive analysis tạo ra một mô hình dự đoán cho các khả năng trong tương lai. Dựa trên kết quả của descriptive analysis và diagnostic analysis, phương pháp phân tích dữ liệu này giúp xác định các xu hướng (trend), phát hiện sớm những sai lệch so với giá trị kỳ vọng, và dự đoán các sự việc trong tương lai chính xác nhất có thể.

7. `Note-taking and mind mapping of the found results` (Ghi chép và lập sơ đồ tư duy cho các kết quả tìm được)  
   - Ghi chú lại mọi thứ ta làm, thấy hoặc tìm được trong suốt cuộc điều tra là rất quan trọng. Hãy đảm bảo ta ghi chép đầy đủ, bao gồm:
   	* Các khoảng thời gian mà ta đã capture traffic.
	* Các host đáng ngờ trong mạng.
	* Các cuộc hội thoại (conversation) chứa các file đang bị nghi vấn. (bao gồm cả timestamp và số thứ tự packet)
8. `Summary of the analysis (what did we find?)` (Tóm tắt kết quả phân tích — ta đã tìm thấy gì?)
   - Cuối cùng, tóm tắt những gì ta đã tìm thấy, giải thích các chi tiết liên quan để cấp trên có thể quyết định cách ly (quarantine) các host bị ảnh hưởng hoặc tiến hành incident response ở quy mô lớn hơn. 
   - Kết quả phân tích của ta sẽ ảnh hưởng tới các quyết định được đưa ra, vì vậy điều cốt yếu là phải rõ ràng và súc tích nhất có thể. 

Bằng cách đánh giá dữ liệu đã tìm được, so sánh nó với baseline traffic và với dữ liệu đã biết là độc hại, chẳng hạn các dấu hiệu xâm nhập hoặc khai thác (như signature của virus và các công cụ hacking khác), ta đang thực hiện Predictive Analysis. Trong quá trình này, ta vẽ nên một bức tranh rõ ràng để có thể đưa ra các hành động phản ứng phù hợp. 

---
## Prescriptive Analysis (Phân tích đề xuất)

Prescriptive analysis nhằm thu hẹp xem cần thực hiện những hành động nào để loại bỏ hoặc ngăn chặn một vấn đề trong tương lai, hoặc để kích hoạt một hoạt động hay quy trình cụ thể. Dùng kết quả của workflow, ta có thể đưa ra các quyết định đúng đắn về những hành động cần thiết để giải quyết vấn đề và ngăn nó tái diễn. Đề xuất (prescribe) giải pháp là đỉnh điểm của workflow này. Khi đã xong và vấn đề đã được giải quyết, nên nhìn lại toàn bộ quy trình và rút ra bài học kinh nghiệm (lessons learned). Những bài học này, khi được ghi lại thành tài liệu, sẽ giúp ta củng cố các quy trình của mình — ghi lại những gì đã làm đúng, những hành động nào không giúp ích được, và những gì có thể cải thiện. 

Workflow này là một ví dụ về cách bắt đầu quá trình phân tích trên traffic đã capture. Ở trên ta đã chia nhỏ nó thành từng phần để giải thích mỗi phần nằm ở đâu trong quá trình phân tích và thuộc loại phân tích nào. Ở đây ta đưa lại nó dưới dạng hoàn chỉnh để có thể dùng làm template (mẫu).
 
1. `What is the issue?` (Vấn đề là gì?)
   - Nghi ngờ có xâm nhập (breach)? Sự cố mạng? 
2. `Define our scope and the goal (what are we looking for? which time period?)` (Xác định phạm vi và mục tiêu — ta đang tìm gì? trong khoảng thời gian nào?)
   - mục tiêu: nhiều host có khả năng đang tải một file độc hại từ bad.example.com
   - khi nào: trong vòng 48 giờ qua + 2 giờ tính từ bây giờ.
   - thông tin hỗ trợ: tên file/loại file 'superbad.exe' 'new-crypto-miner.exe' 
3. `Define our target(s) (net / host(s) / protocol)` (Xác định đối tượng — mạng / host / giao thức)
   - phạm vi: mạng 192.168.100.0/24, các giao thức được dùng là HTTP và FTP.
4. `Capture network traffic` (Capture network traffic)
   - cắm vào một link có quyền truy cập tới mạng 192.168.100.0/24 để capture traffic trực tiếp, cố gắng bắt được một trong các file thực thi đang được truyền. Xem liệu admin có thể lấy dữ liệu PCAP và/hoặc netflow từ SIEM để có dữ liệu lịch sử hay không.
5. `Identification of required network traffic components (filtering)` (Xác định các thành phần network traffic cần thiết — lọc)
   - khi đã có traffic, hãy lọc bỏ mọi traffic không cần cho cuộc điều tra này, bao gồm: mọi traffic khớp với baseline thông thường, và giữ lại mọi thứ liên quan tới phạm vi. `HTTP và FTP từ subnet, mọi thứ có truyền tải hoặc chứa GET request tới các file thực thi bị nghi ngờ. 
6. `An understanding of captured network traffic` (Hiểu network traffic đã capture được)
   - Khi đã lọc bỏ nhiễu (noise), đã đến lúc đào sâu tìm mục tiêu — lọc theo những thứ như `ftp-data` để tìm các file đã được truyền và tái tạo chúng. Với HTTP, ta có thể lọc theo `http.request.method == "GET"` để xem mọi GET request khớp với tên file mà ta đang tìm. Việc này có thể cho ta thấy ai đã lấy được các file đó, và có thể cả những lần truyền tải khác trong nội bộ mạng qua cùng các giao thức. 
7. `Note-taking and mind mapping of the found results. ` (Ghi chép và lập sơ đồ tư duy cho các kết quả tìm được) 
   - Ghi chú lại mọi thứ ta làm, thấy hoặc tìm được trong suốt cuộc điều tra là rất quan trọng. Hãy đảm bảo ta ghi chép đầy đủ, bao gồm:
   * Các khoảng thời gian mà ta đã capture traffic.
   * Các host đáng ngờ trong mạng.
   * Các cuộc hội thoại chứa các file đang bị nghi vấn. (bao gồm cả timestamp và số thứ tự packet)
8. `Summary of the analysis (what did we find?)` (Tóm tắt kết quả phân tích — ta đã tìm thấy gì?)
   - Cuối cùng, tóm tắt những gì đã tìm thấy, giải thích các chi tiết liên quan để cấp trên có thể đưa ra quyết định có cơ sở về việc cách ly các host bị ảnh hưởng hoặc tiến hành incident response ở quy mô lớn hơn. 
   - Kết quả phân tích của ta sẽ ảnh hưởng tới các quyết định được đưa ra, vì vậy điều cốt yếu là phải rõ ràng và súc tích nhất có thể. 

Thường thì quy trình này không phải là việc làm một lần là xong. Nó thường mang tính chu kỳ, và ta sẽ cần chạy lại các bước dựa trên kết quả phân tích bản capture ban đầu để có được bức tranh lớn hơn. Đây có thể là một cuộc tấn công lớn hơn nhiều so với những gì có trong ví dụ. Giả sử cần tiến hành incident response toàn diện. Khi đó, ta có thể phải phân tích lại file PCAP đã capture trước đó để xem mọi cuộc hội thoại liên quan tới các host bị ảnh hưởng trong vòng vài phút quanh thời điểm truyền file thực thi, chẳng hạn để đảm bảo nó không lây lan qua một đường khác.

---  
## Các thành phần chính của một quá trình phân tích hiệu quả

#### 1. Hiểu rõ môi trường của bạn
Có một số thành phần then chốt để phân tích traffic hiệu quả. Trước tiên, hãy hiểu rõ môi trường. Nếu ta không chắc một host có thuộc về mạng hay không, làm sao ta xác định được nó có phải thiết bị lạ (rogue) hay không? Duy trì danh mục tài sản (asset inventory) và sơ đồ mạng (network map) là điều sống còn. Chúng sẽ hỗ trợ cho quá trình phân tích.   

#### 2. Vị trí đặt là then chốt

Tiếp theo, vị trí đặt host dùng để capture traffic là một yếu tố quan trọng. Vị trí lý tưởng cho công cụ capture là gần nguồn gốc của vấn đề nhất. Nếu traffic đang bị nghi vấn đến từ internet, lắng nghe trên các link đi vào (inbound) là cách tuyệt vời để thấy được bức tranh đầy đủ. Đó là vị trí gần nguồn nhất mà chúng ta, những người quản trị, có thể đạt được. Nếu vấn đề có vẻ chỉ giới hạn ở một host trong mạng nội bộ, hãy thử đặt công cụ capture trong cùng segment với host có vấn đề và xem traffic nào đang diễn ra bên trong segment đó.

#### 3. Sự kiên trì  

Kiên trì (persistence) là thành phần quan trọng tiếp theo đối với ta. Vấn đề không phải lúc nào cũng dễ phát hiện. Nó thậm chí có thể không phải là sự kiện thường xuyên trên mạng. Ví dụ, Command and Control server của kẻ tấn công liên lạc tới máy tính của nạn nhân có thể chỉ diễn ra theo chu kỳ vài giờ một lần, hoặc thậm chí mỗi ngày một lần hay ít hơn. Điều này có nghĩa là nếu ta không bắt được nó ngay lần đầu, có thể phải một lúc lâu sau nó mới xuất hiện trong log. Đừng đánh mất động lực tìm ra vấn đề. Điều đó có thể là ranh giới giữa việc chặn được kẻ tấn công và một vụ xâm nhập toàn diện như tấn công ransomware.

---  
## Cách tiếp cận phân tích

Ta đã dành thời gian bàn về quy trình phân tích và cách bắt đầu một workflow cơ bản khi thực hiện công việc. Hãy dành chút thời gian bàn về một số "chiến thắng dễ dàng" (easy win) khi xem traffic và tìm vấn đề.

Bắt đầu với `standard protocols first` (các giao thức tiêu chuẩn trước) rồi dần đi vào những giao thức `austere and specific` (ít gặp và đặc thù) chỉ có ở tổ chức. Phần lớn các cuộc tấn công đến từ internet, nên bằng cách nào đó chúng phải truy cập được vào mạng nội bộ. Điều này có nghĩa là sẽ có traffic được tạo ra và log được ghi lại về nó. HTTP/S, FTP, E-mail, cùng traffic TCP và UDP cơ bản sẽ là những thứ phổ biến nhất thấy được từ bên ngoài đi vào. Hãy bắt đầu từ những thứ này và loại bỏ mọi thứ không cần thiết cho cuộc điều tra. Sau đó, kiểm tra các giao thức tiêu chuẩn cho phép giao tiếp giữa các mạng, như SSH, RDP hoặc Telnet. Khi tìm kiếm những loại bất thường (anomaly) này, hãy lưu ý tới chính sách bảo mật của mạng. Kế hoạch bảo mật và các triển khai của tổ chức ta có cho phép các phiên RDP được khởi tạo từ bên ngoài doanh nghiệp không? Còn việc dùng Telnet thì sao?

Tìm kiếm các `patterns` (mẫu lặp lại). Có host cụ thể hoặc nhóm host nào liên lạc (check in) với một thứ gì đó trên internet vào cùng một thời điểm mỗi ngày không? Đây là kiểu thiết lập Command and Control điển hình, có thể dễ dàng phát hiện bằng cách tìm các pattern trong dữ liệu traffic. 

Kiểm tra mọi traffic `host to host` (giữa các host với nhau) trong mạng. Trong một thiết lập tiêu chuẩn, các host của người dùng hiếm khi nói chuyện với nhau. Vì vậy hãy nghi ngờ mọi traffic trông như thế này. Thông thường, host sẽ nói chuyện với hạ tầng để xin cấp phát (lease) địa chỉ IP, gửi DNS request, dùng các dịch vụ doanh nghiệp và tìm đường ra ngoài. Ta cũng sẽ thấy host nói chuyện với các web server cục bộ, file share và các hạ tầng quan trọng khác cần cho môi trường hoạt động, như Domain controller và các ứng dụng xác thực.

Tìm kiếm các sự kiện `unique` (bất thường, chỉ xảy ra riêng lẻ). Những chuyện như một host thường truy cập một trang cụ thể mười lần mỗi ngày bỗng thay đổi pattern và chỉ truy cập một lần là điều đáng tò mò. Việc thấy một chuỗi User-Agent khác lạ, không khớp với các ứng dụng của ta, hoặc các host nói chuyện với một server ngoài internet, cũng là điều đáng lo ngại. Một port ngẫu nhiên chỉ được bind một hoặc hai lần trên một host cũng đáng chú ý. Đó có thể là lối mở cho những thứ như C2 callback, ai đó mở port để làm việc gì đó không theo chuẩn, hoặc một ứng dụng đang có hành vi bất thường. Trong các môi trường lớn, pattern là điều đương nhiên, nên bất cứ thứ gì nổi bật lên đều đáng được xem xét.


`Don't be afraid to ask for help.` (Đừng ngại nhờ giúp đỡ.) Điều này nghe có vẻ hiển nhiên và bị nói quá nhiều, nhưng sau một thời gian nhìn chằm chằm vào các bản packet capture, mọi thứ có thể nhoè vào nhau và ta có thể không thấy được toàn cảnh. Có thêm một người nữa xem dữ liệu có thể giúp ích rất nhiều trong việc phát hiện những thứ có thể bị bỏ qua.

----
Tóm lại, quá trình phân tích là một công việc rất linh hoạt, và không ngày nào của ta giống ngày nào. Hãy tiếp tục học hỏi, hiểu những gì đang diễn ra xung quanh, và khi kỹ năng của bạn tăng lên thì khả năng phát hiện mối đe doạ cũng vậy. Quy trình này không chỉ dựa vào việc dùng các công cụ như tcpdump và Wireshark. Có nhiều công cụ hữu ích như Snort, Security Onion, Firewall và SIEM có thể giúp làm giàu hiểu biết của ta về môi trường và mang lại khả năng bảo vệ tốt hơn. Đừng ngại sử dụng chúng trong các cuộc điều tra.
