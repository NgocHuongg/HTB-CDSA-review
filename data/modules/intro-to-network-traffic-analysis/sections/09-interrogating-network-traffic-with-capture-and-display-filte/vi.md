# Interrogating Network Traffic With Capture and Display Filters (Khảo sát lưu lượng mạng bằng capture filter và display filter)
----

 
Bài lab này nhằm giúp mọi người làm quen với việc khảo sát lưu lượng mạng (network traffic) và có thêm cơ hội thực hành hữu ích với việc áp dụng packet filter. Ta sẽ dùng các filter như `host`, `port`, `protocol` và nhiều filter khác để thay đổi góc nhìn khi đào sâu vào một file .PCAP.  

Giờ ta đã chứng minh được khả năng capture lưu lượng mạng cho Corporation, ban quản lý giao cho ta nhiệm vụ phân tích nhanh lưu lượng mà nhóm đã capture được trong lúc khảo sát mạng. Mục tiêu là xác định những server nào đang trả lời các request DNS và HTTP/S trong mạng nội bộ của ta.  
   
<div class="card bg-light">
    <div class="card-body">
        <p class="mb-0">Nếu bạn muốn làm bài lab này theo hướng tự khám phá, tôi đã liệt kê các nhiệm vụ tổng quát cần hoàn thành. Để xem hướng dẫn chi tiết cách hoàn thành từng bước, hãy xem phần lời giải bên dưới mỗi nhiệm vụ.</p>
    </div></div>
    
----    
## Các nhiệm vụ  

Sử dụng `TCPDump-lab-2.zip` trong phần tài nguyên tùy chọn (optional resources), hãy làm bài lab hết khả năng của mình. Mục tiêu không phải là tìm ra mọi thứ ngay lần đầu. Điều ta quan tâm hàng đầu là hiểu được các khái niệm. Khi lặp lại các thao tác này nhiều lần, mọi thứ sẽ dễ dần.

#### Nhiệm vụ #1

`Read a capture from a file without filters implemented.`

Để bắt đầu, hãy xem file pcap này khi chưa áp dụng filter nào.  
  
<details>
  <summary><b>Bấm để xem đáp án</b></summary>  

```shell-session
[!bash!]$ tcpdump -r (file.pcap)
```  

</details>  
  
---   
#### Nhiệm vụ #2

`Identify the type of traffic seen.`
  
Ghi lại những loại traffic có thể thấy được. (Các port được sử dụng, giao thức, và bất kỳ thông tin nào khác mà bạn thấy liên quan.) Ta có thể dùng những filter nào để việc này dễ hơn?  

Ta thấy những loại traffic nào? 

Các giao thức phổ biến:

Các port được sử dụng:

<details>
  <summary><b>Bấm để xem đáp án</b></summary>  

Ta thấy những loại traffic nào? 

Các giao thức phổ biến: Ta sẽ thấy rất nhiều traffic `DNS, HTTP, and HTTPS`.

Các port được sử dụng: `53 80 443`

</details>  

---
#### Nhiệm vụ #3 

`Identify conversations.`

Ta đã xem qua những điểm cơ bản của traffic này, giờ hãy xác định xem bạn có nhận ra pattern (khuôn mẫu) nào trong traffic không.  
Bạn có thấy kết nối nào lặp lại thường xuyên giữa một server và một host không? Nếu có, đó là ai? 

Client và server dùng số port nào trong TCP three-way handshake đầy đủ đầu tiên?

Ai là server trong các conversation (phiên trao đổi) này? Làm sao ta biết?

Ai là các host nhận?

<details> 
  <summary><b>Bấm để xem đáp án</b></summary>

Để việc này đơn giản hơn, bật hiển thị absolute sequence number `(-S)` sẽ cực kỳ hữu ích trong việc xác định các conversation.  

Ta cũng có thể xem xét các host khác nhau tham gia. Server thường giao tiếp qua well-known port được gán cho giao thức `(80 for HTTP, 443 for HTTPS, for example)`. Các host hoặc bên nhận trong conversation thường dùng một port số cao ngẫu nhiên.
</details>  

---  
#### Nhiệm vụ #4 

`Interpret the capture in depth.`

Giờ đã phần nào quen với file pcap, hãy bắt tay vào phân tích. Dùng bất kỳ cú pháp nào cần thiết để trả lời các câu hỏi dưới đây.

Timestamp của conversation đầu tiên được thiết lập trong file pcap là gì?

Địa chỉ IP của apache.org theo các response từ DNS server là gì?

Conversation đầu tiên đó đang dùng giao thức nào? (tên/#)
<details>
  <summary><b>Bấm để xem đáp án</b></summary>

Để xác định đúng timestamp: Đọc file bằng (-r) rồi xem xét các conversation. Tìm conversation đầu tiên được thiết lập ( Full TCP Handshake "Syn / SYN-ACK / ACK") và nhìn vào field đầu tiên trong output để lấy timestamp.
Để tìm IP của Host ( ), ta có thể filter traffic để chỉ thấy các conversation xuất phát từ host đó ( src 'name-of-host' ) rồi tắt phân giải tên (name resolution) bằng (-n).
Để xác định giao thức được dùng trong conversation đầu tiên, hãy tìm số well-known port trong khi tắt phân giải hostname và tên port (-nn), hoặc bỏ (-nn) đi và output sẽ cho bạn biết tên của giao thức.
</details>  


---
#### Nhiệm vụ #5

`Filter out traffic.`

Giờ là lúc dọn bớt dữ liệu. Nạp lại file pcap và lọc bỏ toàn bộ traffic không phải DNS. Bạn thấy được gì?

Ai là DNS server của segment (phân đoạn mạng) này?

Những tên miền nào đã được request trong file pcap?

Có thể thấy những loại DNS record nào?
  
<details>  
  <summary><b>Bấm để xem đáp án</b></summary>
Để lọc bỏ mọi thứ không phải DNS, ta có thể dùng:

```shell-session
[!bash!]$ sudo tcpdump -r (file.pcap) udp and port 53    
```

Lưu ý rằng DNS là giao thức dùng cả UDP lẫn TCP cho các chức năng khác nhau. Nghĩa là ta có thể phải filter cả hai để chắc chắn không bỏ sót gì.

Nếu dùng switch -X, ta sẽ có output dạng Hex và ASCII để xem các tên ở dạng cleartext trong output.

Hiểu các request và response của giao thức DNS sẽ giúp xác định loại record nào đang được request. Field thông tin riêng của giao thức (protocol-specific information) thường chứa câu trả lời.
</details>  
      
Giờ ta chỉ còn thấy traffic DNS và đã nắm rõ hơn packet trông như thế nào, hãy thử trả lời các câu hỏi sau về phân giải tên trong mạng doanh nghiệp:
Ai request A record cho apache.org? (hostname hoặc IP)
  
A record cung cấp thông tin gì?  
  
DNS server trả lời trong pcap là ai? (hostname hoặc IP)  

---
#### Nhiệm vụ #6 

`Filter for TCP traffic.`

Giờ đã biết rõ DNS server, hãy tìm các webserver có mặt trong mạng. Lọc lại góc nhìn để chỉ thấy traffic liên quan đến HTTP hoặc HTTPS.
Những trang web nào đã được request?

Các HTTP request method phổ biến nhất trong PCAP này là gì?

HTTP response phổ biến nhất trong PCAP này là gì?

<details>
  <summary><b>Bấm để xem đáp án</b></summary>
Filter theo port 80 OR 443 là một khởi đầu tốt. Bạn cũng có thể filter theo tên giao thức HTTP OR HTTPS. 
Lưu ý rằng port chỉ mang tính quy ước. Tôi có thể chạy webserver trên bất kỳ port mở nào có thể bind được. (ví dụ 8080 hoặc 8001)
</details>


#### Nhiệm vụ #7

`What can you determine about the server in the first conversation.`

Hãy xem kỹ hơn. Có thể xác định được gì về webserver trong conversation đầu tiên? Có điều gì nổi bật không?
Để nhìn rõ hơn, hãy đảm bảo góc nhìn của ta có cả output Hex và ASCII của pcap.

Ta có xác định được ứng dụng nào đang chạy webserver không? 
  
<details>
  <summary><b>Bấm để xem đáp án</b></summary>
Webserver thường đưa các thông tin liên quan vào response trả về, chẳng hạn hệ điều hành hoặc tên web server. Bạn cũng có thể xác định dịch vụ nào đang chạy webserver dựa trên các response này. Việc này hơi khó thực hiện bằng tcpdump, vì ta phải đọc phần ASCII của các HTTP response. Ở các phần sau, khi chuyển sang Wireshark, việc này sẽ dễ hơn nhiều.
</details>  


----  
## Tóm tắt
Qua bài lab này, ta đã mở rộng hiểu biết khi dùng TCPDump để phân tích traffic trong PCAP. Ta đã học cách dùng capture filter và display filter hiệu quả, mổ xẻ traffic để xác định những giao thức nào đang chạy trong môi trường, và thậm chí thu được một số thông tin quan trọng về các segment, DNS và webserver của doanh nghiệp. Hãy tiếp tục tự thực hành và xem "hang thỏ" sâu đến đâu. Bạn có thể capture traffic trong mạng gia đình mình và trả lời các câu hỏi tương tự không?

----  
## Mẹo phân tích

Dưới đây là danh sách các câu hỏi ta có thể tự đặt ra trong quá trình phân tích để không bị lạc hướng.

||
|-|
|Bạn thấy loại traffic nào? (giao thức, port, v.v.) |
|Có nhiều hơn một conversation không? (bao nhiêu?) |
|Có bao nhiêu host khác nhau? |
|Timestamp của conversation đầu tiên trong pcap (traffic tcp) là gì? |
|Có thể lọc bỏ traffic nào để làm gọn góc nhìn? |
|Ai là server trong PCAP? (trả lời trên các well-known port, 53, 80, v.v.) |
|Những record nào đã được request hoặc method nào đã được dùng? (GET, POST, DNS A record, v.v.) |
