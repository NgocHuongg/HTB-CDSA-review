# Network Traffic Analysis (Phân tích lưu lượng mạng)


`Network Traffic Analysis (NTA)` có thể được mô tả là hoạt động kiểm tra lưu lượng mạng (network traffic) nhằm xác định các port và protocol thường được sử dụng, thiết lập baseline (mức nền bình thường) cho môi trường của chúng ta, giám sát và phản ứng trước các mối đe dọa, đồng thời đảm bảo có được cái nhìn sâu nhất có thể vào mạng của tổ chức.

Quy trình này giúp các chuyên gia bảo mật xác định các điểm bất thường (anomaly), bao gồm cả các mối đe dọa bảo mật trong mạng, và khoanh vùng mối đe dọa sớm và hiệu quả. Network Traffic Analysis cũng có thể hỗ trợ việc đáp ứng các hướng dẫn bảo mật. Kẻ tấn công thường xuyên cập nhật chiến thuật để tránh bị phát hiện và lợi dụng thông tin đăng nhập (credential) hợp lệ cùng các công cụ mà hầu hết công ty đều cho phép trong mạng của mình, khiến việc phát hiện và sau đó là phản ứng trở nên khó khăn cho bên phòng thủ. Trong những trường hợp như vậy, Network Traffic Analysis một lần nữa lại tỏ ra hữu ích. Các use case thường gặp hằng ngày của NTA bao gồm:

||
|-|
|`Collecting` (thu thập) lưu lượng real-time trong mạng để phân tích các mối đe dọa sắp tới.|
| `Setting` (thiết lập) một baseline cho hoạt động giao tiếp mạng hằng ngày. |
| `Identifying` (xác định) và phân tích lưu lượng từ các port không tiêu chuẩn, các host đáng ngờ, và các vấn đề với protocol mạng như lỗi HTTP, sự cố với TCP hoặc các cấu hình sai khác của mạng. |
| `Detecting` (phát hiện) malware trên đường truyền (on the wire), chẳng hạn ransomware, exploit và các tương tác không tiêu chuẩn. |
| NTA cũng hữu ích khi điều tra các sự cố trong quá khứ và trong quá trình threat hunting.|

Hãy thử hình dung một threat actor đang nhắm vào và xâm nhập mạng của chúng ta. Nếu muốn xâm phạm mạng, kẻ tấn công chắc chắn phải tương tác và giao tiếp với hạ tầng của chúng ta. Giao tiếp mạng diễn ra qua rất nhiều port và protocol khác nhau, tất cả đều được nhân viên, thiết bị và khách hàng sử dụng đồng thời. Để phát hiện lưu lượng độc hại, ta cần dùng hiểu biết của mình về lưu lượng mạng điển hình trong vùng mạng (enclave) của mình. Làm như vậy sẽ thu hẹp phạm vi tìm kiếm và giúp ta nhanh chóng tìm ra và phá vỡ hoạt động giao tiếp của đối phương.  

Ví dụ, nếu ta phát hiện nhiều gói `SYN` trên các port mà ta không bao giờ (hoặc hiếm khi) dùng trong mạng, ta có thể kết luận rằng nhiều khả năng đây là ai đó đang cố xác định port nào đang mở trên các host của ta. Những hành động như vậy là dấu hiệu điển hình của một `portscan`. Thực hiện được phân tích như thế và đi tới kết luận như thế đòi hỏi những kỹ năng và kiến thức nhất định.

---
## Kỹ năng và kiến thức cần có  

Các kỹ năng mà chúng ta sắp liệt kê và mô tả đòi hỏi kiến thức lý thuyết lẫn thực hành, được tích luỹ theo thời gian. Ta không cần phải thuộc lòng mọi thứ, nhưng nên biết cần tìm gì khi một số khía cạnh của nội dung có vẻ lạ lẫm. Điều này không chỉ áp dụng cho NTA mà còn cho hầu hết các chủ đề khác mà ta sẽ gặp trong an ninh mạng. 

#### TCP/IP Stack & OSI Model

Hiểu biết này đảm bảo ta nắm được cách lưu lượng mạng và các ứng dụng trên host tương tác với nhau. 

#### Các khái niệm mạng cơ bản

Hiểu được ta sẽ thấy những loại lưu lượng nào ở mỗi tầng bao gồm cả việc hiểu từng tầng (layer) tạo nên mô hình TCP/IP và OSI, cùng các khái niệm switching và routing. Nếu ta tap (đặt điểm nghe lén) vào mạng trên một đường backbone, ta sẽ thấy nhiều lưu lượng hơn bình thường rất nhiều, và nó sẽ khác hẳn so với những gì ta thấy khi tap vào một switch trong văn phòng.

#### Các port và protocol phổ biến

Nhận diện nhanh các port và protocol tiêu chuẩn, đồng thời hiểu đủ để vận dụng cách chúng giao tiếp, sẽ đảm bảo ta có thể nhận ra lưu lượng mạng có khả năng độc hại hoặc bị dị dạng (malformed).

#### Khái niệm về IP packet và các tầng con    

Kiến thức nền tảng về cách TCP và UDP giao tiếp, ở mức tối thiểu, sẽ đảm bảo ta hiểu được những gì mình đang thấy hoặc đang tìm kiếm. Ví dụ, TCP là stream-oriented (hướng luồng) và cho phép ta dễ dàng theo dõi một cuộc hội thoại giữa các host. UDP thì nhanh nhưng không quan tâm tới tính trọn vẹn, nên sẽ khó tái dựng lại thứ gì đó từ loại gói tin này hơn.

#### Encapsulation (đóng gói) trong vận chuyển protocol   

Mỗi tầng sẽ đóng gói (encapsulate) tầng trước đó. Khả năng đọc hoặc mổ xẻ (dissect) được khi nào việc encapsulation này thay đổi sẽ giúp ta duyệt dữ liệu nhanh hơn. Rất dễ nhận ra các gợi ý dựa trên các header encapsulation.

---
## Môi trường và thiết bị

Danh sách dưới đây gồm nhiều loại công cụ và thiết bị khác nhau có thể dùng để thực hiện phân tích lưu lượng mạng. Mỗi loại cung cấp một cách khác nhau để capture (bắt) hoặc dissect lưu lượng. Có loại cung cấp cách sao chép và capture, trong khi loại khác đọc và ingest (nạp) dữ liệu. Module này sẽ chỉ tìm hiểu một vài trong số đó (chủ yếu là [Wireshark](https://www.wireshark.org/) và [tcpdump](https://www.tcpdump.org/)). Hãy nhớ rằng các công cụ này không chỉ dành riêng cho quản trị viên. Nhiều công cụ trong số này cũng có thể được dùng cho mục đích độc hại.

#### Các công cụ phân tích lưu lượng phổ biến

|**Công cụ**|**Mô tả**|
|-|-|
| `tcpdump` | [tcpdump](https://www.tcpdump.org/) là một tiện ích command-line, với sự hỗ trợ của LibPcap, capture và diễn giải lưu lượng mạng từ một network interface hoặc từ file capture. |
| `Tshark` | [TShark](https://www.wireshark.org/docs/man-pages/tshark.html) là một công cụ phân tích gói tin mạng (network packet analyzer) khá giống TCPDump. Nó capture gói tin từ mạng đang hoạt động (live) hoặc đọc và giải mã từ file. Đây là phiên bản command-line của Wireshark. |
| `Wireshark` | [Wireshark](https://www.wireshark.org/) là một công cụ phân tích lưu lượng mạng có giao diện đồ hoạ. Nó capture và giải mã các frame trên đường truyền, cho phép nhìn sâu vào môi trường. Nó có thể chạy nhiều dissector khác nhau trên lưu lượng để xác định đặc điểm của protocol và ứng dụng, giúp hiểu rõ những gì đang diễn ra. |
| `NGrep` |  [NGrep](https://github.com/jpr5/ngrep) là một công cụ so khớp mẫu (pattern-matching) được xây dựng để phục vụ chức năng tương tự grep trên các bản phân phối Linux. Khác biệt lớn là nó làm việc với các gói tin lưu lượng mạng. NGrep biết cách đọc lưu lượng live hoặc lưu lượng từ file PCAP, và sử dụng biểu thức regex cùng cú pháp BPF. Công cụ này phát huy tốt nhất khi dùng để debug lưu lượng từ các protocol như HTTP và FTP.|
| `tcpick` | [tcpick](http://tcpick.sourceforge.net/index.php?p=home.inc) là một packet sniffer dạng command-line, chuyên theo dõi và tái dựng (reassemble) các TCP stream. Chức năng đọc một stream và tái dựng lại thành file của tcpick rất tuyệt vời. |
| `Network Taps` | Tap ([Gigamon](https://www.gigamon.com/), [Niagra-taps](https://www.niagaranetworks.com/products/network-tap)) là các thiết bị có khả năng lấy bản sao lưu lượng mạng và gửi tới nơi khác để phân tích. Chúng có thể đặt in-line hoặc out of band. Chúng có thể chủ động capture và phân tích lưu lượng trực tiếp, hoặc thụ động bằng cách đặt gói tin gốc trở lại đường truyền như thể không có gì thay đổi. |
| `Networking Span Ports` | [Span Port](https://en.wikipedia.org/wiki/Port_mirroring) là một cách sao chép các frame từ thiết bị mạng tầng hai hoặc tầng ba trong quá trình xử lý egress (chiều ra) hoặc ingress (chiều vào) và gửi chúng tới một điểm thu thập. Thường thì một port được mirror để gửi các bản sao đó tới một log server. |
| `Elastic Stack` | [Elastic Stack](https://www.elastic.co/elastic-stack) là tập hợp các công cụ có thể lấy dữ liệu từ nhiều nguồn, ingest dữ liệu và trực quan hoá nó, giúp tìm kiếm và phân tích dữ liệu đó. |
| `SIEMS` | `SIEMS` (chẳng hạn [Splunk](https://www.splunk.com/en_us)) là điểm trung tâm nơi dữ liệu được phân tích và trực quan hoá. Alerting, phân tích forensic và các kiểm tra hằng ngày đối với lưu lượng đều là các use case của SIEM.  |
|và các công cụ khác.||


---
## Cú pháp BPF

Nhiều công cụ nêu trên có cú pháp và lệnh riêng để sử dụng, nhưng có một cú pháp được dùng chung giữa chúng là cú pháp [Berkeley Packet Filter (BPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter). Đây là cách chính mà ta sẽ sử dụng. Về bản chất, BPF là một công nghệ cho phép một raw interface đọc và ghi từ tầng Data-Link. Với tất cả những điều trên, ta quan tâm tới BPF vì khả năng lọc (filtering) và giải mã (decoding) mà nó mang lại. Ta sẽ dùng cú pháp BPF xuyên suốt module, nên hiểu cơ bản cách thiết lập một BPF filter sẽ có ích. Để biết thêm về cú pháp BPF, hãy xem [tài liệu tham khảo](https://www.ibm.com/docs/en/qsip/7.4?topic=queries-berkeley-packet-filters) này.

---
## Thực hiện Network Traffic Analysis

Việc phân tích có thể đơn giản như ngồi xem lưu lượng live chạy qua trên console, hoặc phức tạp như capture dữ liệu bằng tap, gửi về SIEM để ingest, rồi phân tích dữ liệu pcap để tìm signature và alert liên quan tới các tactic và technique phổ biến. 

Ở mức tối thiểu, để nghe thụ động (passive), ta cần được kết nối vào phân đoạn mạng (network segment) mà ta muốn nghe. Điều này đặc biệt đúng trong môi trường switched, nơi các VLAN và switch port sẽ không chuyển tiếp lưu lượng ra ngoài broadcast domain của chúng. Với điều đó, nếu muốn capture lưu lượng từ một VLAN cụ thể, thiết bị capture của ta phải được kết nối vào cùng mạng đó. Các thiết bị như network tap, các cấu hình switch hoặc router như span port và port mirroring có thể cho phép ta lấy bản sao của toàn bộ lưu lượng đi qua một đường link cụ thể, bất kể nó thuộc phân đoạn mạng hay đích đến nào. 
  
#### Quy trình NTA (NTA Workflow)

Phân tích lưu lượng không phải là một môn khoa học chính xác. NTA có thể là một quy trình rất linh động và không phải là một vòng lặp thẳng. Nó chịu ảnh hưởng lớn bởi việc ta đang tìm gì (lỗi mạng hay hành vi độc hại) và ta có khả năng quan sát (visibility) tới đâu trong mạng. Việc phân tích lưu lượng có thể được chắt lọc thành một vài nguyên tắc cơ bản.  
   
#### Quy trình NTA (NTA Workflow)  

![Sơ đồ chu trình gồm bốn bước: 1. Ingest Traffic, 2. Reduce Noise by Filtering, 3. Analyze and Explore, 4. Detect and Alert.](images/workflow.png) 


#### 1. Ingest Traffic (Nạp lưu lượng)
Khi đã quyết định vị trí đặt thiết bị, bắt đầu capture lưu lượng. Hãy dùng capture filter nếu ta đã có ý tưởng về thứ mình đang tìm.

#### 2. Reduce Noise by Filtering (Giảm nhiễu bằng cách lọc)
Capture lưu lượng của một đường link, đặc biệt là trong môi trường production, có thể cực kỳ nhiễu. Sau khi hoàn tất lần capture ban đầu, việc cố gắng lọc bỏ lưu lượng không cần thiết khỏi tầm nhìn có thể giúp việc phân tích dễ dàng hơn. (Ví dụ như lưu lượng Broadcast và Multicast.)  

#### 3. Analyze and Explore (Phân tích và khám phá)
Đây là lúc bắt đầu tách ra những dữ liệu liên quan tới vấn đề ta đang truy tìm. Xem xét các host cụ thể, các protocol, thậm chí cụ thể tới mức các flag được bật trong TCP header. Các câu hỏi sau sẽ giúp ta:

1. Lưu lượng được mã hoá hay là plain text? Nó có nên như vậy không? 

2. Ta có thấy người dùng cố truy cập vào các tài nguyên mà họ không được phép truy cập không? 

3. Có các host khác nhau đang giao tiếp với nhau mà bình thường thì không không? 

#### 4. Detect and Alert (Phát hiện và cảnh báo)

1. Ta có thấy lỗi nào không? Có thiết bị nào lẽ ra phải phản hồi nhưng lại không phản hồi không? 

2. Dùng kết quả phân tích để quyết định những gì ta thấy là vô hại (benign) hay có khả năng độc hại. 

3. Các công cụ khác như IDS và IPS có thể hữu ích ở bước này. Chúng có thể chạy heuristic và signature trên lưu lượng để xác định xem có gì bên trong có khả năng độc hại hay không.

#### 5. Fix and Monitor (Khắc phục và giám sát)
Fix and monitor không phải là một phần của vòng lặp nhưng nên được đưa vào bất kỳ quy trình nào ta thực hiện. Nếu ta thay đổi điều gì đó hoặc khắc phục một sự cố, ta nên tiếp tục giám sát nguồn đó trong một thời gian để xác định xem sự cố đã được giải quyết hay chưa.
