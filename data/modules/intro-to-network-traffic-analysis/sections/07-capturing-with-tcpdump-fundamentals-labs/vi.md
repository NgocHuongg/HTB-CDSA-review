# Fundamentals Lab (Lab cơ bản)
----

Mục đích của lab này là giúp ta làm quen với tcpdump, đồng thời có thời gian làm quen với terminal và cách sử dụng các công cụ trong đó. Ta sẽ thực hành nhiều thao tác cơ bản của tcpdump như đọc và ghi file, dùng các switch (tuỳ chọn dòng lệnh) cơ bản và tìm vị trí file trong terminal. Trong lúc làm các lab này, ta có thể khám phá và thực hành dùng các switch và chức năng khác nhau của tcpdump. Khi đã quen tay, hãy dành chút thời gian thử xem ta có nhận ra được traffic nào đang hiển thị với mình trên mạng hay không. 
  
Hãy nhớ rằng kiểu công việc này thường được dùng để xem xét chi tiết hơn các host và server cụ thể, và tìm ra tất cả những ai mà chúng tương tác. Quy trình này cũng có thể dùng để phát hiện cái gọi là backdoor hoặc các vụ xâm nhập (breach) tiềm ẩn khác. Nó có thể được dùng để giám sát và ghi log toàn bộ liên lạc từ một server nhằm phân tích các packet được gửi đi và nhận về. Đối với bản thân việc phân tích, ta sẽ dùng nhiều filter và mẫu (pattern) khác nhau để lọc ra các packet đáng ngờ. Ta sẽ tìm hiểu phần này trong một section khác.

Với vai trò network administrator (quản trị mạng) mới của Corporation, ta được giao nhiệm vụ capture (bắt) một phần traffic mạng để giúp xây dựng baseline (đường cơ sở) và kiểm chứng mạng của Corporation. Để thử nghiệm, ta bắt đầu dùng tcpdump để capture một lượng nhỏ traffic trong broadcast domain cục bộ, nhằm đảm bảo thiết bị capture của ta hoạt động được cho nhiệm vụ này. Ta cần đảm bảo các công cụ và dependency (thành phần phụ thuộc) cần thiết đã được cài đặt, đồng thời kiểm tra khả năng đọc traffic và capture nó vào file. 

<div class="card bg-light">
    <div class="card-body">
        <p class="mb-0">Nếu bạn muốn tiếp cận lab này theo hướng tự khám phá, tôi đã đăng các nhiệm vụ tổng quát cần hoàn thành. Để xem hướng dẫn chi tiết hơn về cách hoàn thành từng bước, hãy xem phần lời giải bên dưới mỗi nhiệm vụ.</p>
    </div></div>  

----
## Các nhiệm vụ

#### Nhiệm vụ #1

`Validate Tcpdump is installed on our machine.`

Trước khi bắt đầu, hãy đảm bảo ta đã cài tcpdump. Ta dùng lệnh nào để xác định tcpdump đã được cài trên Linux hay chưa?  

<details>
  <summary><b>Bấm để xem đáp án</b></summary>
Để xác định ta đã cài tcpdump hay chưa, ta có thể dùng lệnh dưới đây trên Linux, hoặc nhấn phím Windows rồi bắt đầu gõ tcpdump trên Windows.
  
```shell-session
[!bash!]$ which tcpdump
```

</details>  
  
---
#### Nhiệm vụ #2

`Start a capture.`

Khi đã biết tcpdump được cài đặt, ta sẵn sàng bắt đầu lần capture đầu tiên. Nếu không chắc mình có những interface nào để lắng nghe, ta có thể dùng một switch có sẵn để liệt kê tất cả cho ta. 

Switch nào của tcpdump được dùng để hiển thị tất cả các interface mà ta có thể lắng nghe?

<details>
  <summary><b>Bấm để xem đáp án</b></summary>

`Step one`: Liệt kê các interface có thể capture.
```shell-session
[!bash!]$ tcpdump -D 
```    

`Step two`: Bắt đầu capture.
```shell-session
[!bash!]$ tcpdump -i [interface name or #]
```    

</details>
    
---  
#### Nhiệm vụ #3

`Utilize Basic Capture Filters.`

Giờ ta đã capture được traffic, hãy thay đổi cách thông tin đó được trình bày. Ta sẽ làm điều này bằng cách tăng độ chi tiết (verbosity) của output và hiển thị nội dung dưới dạng ASCII và Hex. Khi hoàn thành nhiệm vụ này, hãy thử lại với các switch khác. 

Thử thách thêm: tắt phân giải tên (name resolution) và hiển thị sequence number tương đối (relative).

<details>
  <summary><b>Bấm để xem đáp án</b></summary>

```shell-session
[!bash!]$ tcpdump -i [interface name or #] -vX
```

</details>

---
#### Nhiệm vụ #4

`Save a Capture to a .PCAP file.`

Giờ thì tuỳ ta muốn capture và xem output theo cách nào. Hãy nhớ rằng khi dùng capture filter, nó sẽ thay đổi những gì ta thu được. Hãy lấy bản capture đầy đủ đầu tiên từ đường truyền (wire) và lưu vào một file PCAP. Đây sẽ là mẫu để xây dựng baseline cho mạng doanh nghiệp.

<details>
  <summary><b>Bấm để xem đáp án</b></summary>

```shell-session
[!bash!]$ tcpdump -i [interface name or #] -nvw [/path/of/filename.pcap]
``` 

</details>

---  
#### Nhiệm vụ #5

`Read the Capture from a .PCAP file.`

Các thành viên trong nhóm đã đưa cho ta một file PCAP họ capture được khi khảo sát một khu vực khác của doanh nghiệp. Hãy đọc file PCAP đó bằng tcpdump và điều chỉnh cách hiển thị PCAP để giúp ta xác định chuyện gì đang xảy ra. Để cho đơn giản, ta có thể tắt phân giải hostname và port, đồng thời đảm bảo thấy mọi sequence number và acknowledgment number của TCP ở dạng giá trị tuyệt đối (absolute). Để phục vụ lab, hãy dùng file PCAP mà ta đã tạo ở bước trước cho nhiệm vụ này.

<details>
  <summary><b>Bấm để xem đáp án</b></summary>

```shell-session
[!bash!]$ tcpdump -nnSXr [file/to/read.pcap]
```  

  Các switch dùng ở trên sẽ không phân giải hostname hay số port, áp dụng sequence number tuyệt đối, và hiển thị nội dung ở dạng Hex và ASCII khi đọc từ file PCAP.

</details>


Khi đã hoàn thành các nhiệm vụ trên, hãy trả lời các câu hỏi ở cuối section để kiểm tra mức độ hiểu bài.
