# Packet Inception, Dissecting Network Traffic With Wireshark (Mổ xẻ lưu lượng mạng với Wireshark)
----


Mục đích của bài lab này là giúp ta có kinh nghiệm mổ xẻ (dissect) lưu lượng trong Wireshark. Ta sẽ có cơ hội lấy các object ra khỏi lưu lượng mạng đã được capture trước đó, cũng như lấy dữ liệu từ lưu lượng trực tiếp (live traffic).
  
Ta được cung cấp một file packet capture chứa dữ liệu của một phiên web không mã hoá. Trong đó có nhúng một hình ảnh cần được dùng làm bằng chứng cho việc sử dụng mạng sai quy định. Security manager cho rằng người dùng đang gửi các thông điệp được giấu sau hình ảnh đó. Dùng Wireshark, hãy áp dụng các filter để tìm và trích xuất bằng chứng.

<div class="alert alert-primary fade show" role="alert">
  <i class="mdi mdi-information-outline mr-2"></i>
Nếu bạn muốn tiếp cận bài lab này theo hướng tự khám phá nhiều hơn, tôi đã liệt kê các nhiệm vụ tổng thể cần hoàn thành. Để xem hướng dẫn chi tiết hơn về cách hoàn thành từng bước, hãy xem bên dưới mỗi task trong khung lời giải (solution bubble).
</div> 

----
## Các nhiệm vụ (Tasks)  

Sử dụng `Wireshark-lab-2.zip` trong phần optional resources, hãy thực hiện bài lab tốt nhất có thể.

#### Task #1 

`Open a pre-captured file (HTTP extraction)`

Trong Wireshark, chọn File → Open → , rồi duyệt tới Wireshark-lab-2.pcap. Mở file đó.

#### Task #2

`Filter the results.`

Giờ ta đã mở file pcap trong Wireshark, có thể thấy khá nhiều lưu lượng trong file capture này. Tổng cộng có khoảng 1171 packet, và trong số đó, chưa tới 20 packet là HTTP. Hãy dành một phút xem xét file pcap, làm quen với các conversation đang diễn ra trong khi nghĩ về nhiệm vụ cần hoàn thành. Mục tiêu của ta là trích xuất các hình ảnh có khả năng được nhúng để làm bằng chứng. Dựa trên những gì được yêu cầu, hãy làm gọn khung nhìn bằng cách chỉ lọc lưu lượng HTTP.

Áp dụng một filter để chỉ giữ lại các request HTTP (80/TCP).

<details>
  <summary><b>Nhấn để xem đáp án</b></summary>

`Step one`: Nhấp vào thanh công cụ Display Filter ở phía trên màn hình và gõ `HTTP`. Nếu đúng, thanh này sẽ sáng màu xanh lá.

</details>

Hãy để ý cách thao tác này loại bỏ mọi datagram TCP hoặc IP khác khỏi cửa sổ và cho phép ta chỉ tập trung vào giao tiếp HTTP. Từ đây, ta có thể thấy một số datagram HTTP cơ bản chứa method GET và các response 200 OK. Những datagram này đáng chú ý vì giờ ta có thể thấy một client đã yêu cầu nhiều file, và server đã phản hồi OK. Nếu chọn một trong các response OK, ta có thể follow stream đó và xem việc truyền dữ liệu qua TCP. Hãy thử xem.

#### Task #3

`Follow the stream and extract the item(s) found.`

Giờ ta đã xác định được có lưu lượng HTTP trong file capture này, hãy thử lấy một số item bên trong như được yêu cầu. Việc đầu tiên cần làm là follow stream của một trong các lần truyền file. Vẫn giữ filter `http` đang áp dụng, hãy tìm một dòng mà Web Server phản hồi bằng thông điệp “200 OK”, đóng vai trò xác nhận/biên nhận cho request GET của người dùng. Giờ hãy chọn packet đó và follow TCP stream.


<details>
  <summary><b>Nhấn để xem đáp án</b></summary>

`Step one`: Chọn một packet có 200 OK trong trường info. Nhấp chuột phải vào packet đó.  
  
`Step two`: Từ menu hiện ra, chọn Follow → TCP Stream. Thao tác này sẽ mở một cửa sổ mới chứa toàn bộ TCP stream. Nó cũng sẽ áp dụng display filter `tcp.stream eq #`.
  
`Step three`: Dành chút thời gian xem dữ liệu để chắc chắn rằng file có vẻ đã được truyền.

</details>

  
Giờ ta đã xác nhận việc truyền đã diễn ra, Wireshark có thể giúp trích xuất file từ lưu lượng HTTP cực kỳ dễ dàng. Ta có thể kiểm tra xem có file hình ảnh nào được tải xuống không bằng cách tìm định dạng `JFIF` trong các packet. JPEG File Interchange Format `JFIF` sẽ báo cho ta biết sự hiện diện của bất kỳ file ảnh JPEG nào. Ta tìm định dạng này vì đây là loại file phổ biến nhất cho hình ảnh, bên cạnh định dạng png. Với suy nghĩ đó, nhiều khả năng ta sẽ thấy một hình ảnh ở định dạng này trong cuộc điều tra. 

Kiểm tra sự hiện diện của các file JFIF trong lưu lượng HTTP.

<details>
  <summary><b>Nhấn để xem đáp án</b></summary>

Xoá display filter đang dùng trước đó và áp dụng `http && image-jfif` làm display filter. 
Áp dụng filter “http && image-jfif” để chỉ giữ lại các packet HTTP (80/TCP) kèm một filter chỉ giữ lại các file JPEG sẽ thu gọn kết quả xuống chỉ còn vài packet. Khoảng `3` packet.

</details>
  

Giờ ta đã chắc chắn các file ảnh đã được truyền giữa host đáng ngờ và server, hãy lấy chúng ra khỏi bản capture. Để làm vậy, ta cần export các object ra khỏi lưu lượng HTTP.


<details>
  <summary><b>Nhấn để xem đáp án</b></summary>

Để export các hình ảnh: 
Chọn “File → Export Objects → HTTP → `file.JPG`.   
Thao tác này sẽ yêu cầu Wireshark lấy các object được request ra khỏi lưu lượng HTTP. Ta có thể lưu một bản sao của file trên máy.
</details>

Tới đây, lẽ ra ta đã có các file ảnh mà security manager yêu cầu thu thập, nếu chúng tồn tại. Giờ họ có thể kiểm tra file để xác định có dữ liệu nào được giấu bên trong hay không.
   
----
## Capture và phân tích trực tiếp (Live Capture and Analysis) 
Trong kịch bản trên, ta đã thực hành lọc trên một file đã capture sẵn. Giờ là lúc thực hiện capture packet trực tiếp. Ta sẽ kết nối tới lab của Academy và sniff lưu lượng trực tiếp từ một host trong mạng để hoàn thành phần này.

Sau khi ta phân tích lưu lượng pcap, Security Manager đã quay lại và xác nhận người dùng đang tuồn (smuggle) dữ liệu ra khỏi mạng thông qua các hình ảnh. Anh ấy yêu cầu ta giờ capture lưu lượng để xác định có điều gì khác đang diễn ra từ host của người dùng `172.16.10.2` hay không. Ta sẽ cần bắt đầu một phiên capture, phân loại và lọc dữ liệu, rồi trích xuất bất cứ thứ gì quan trọng cho cuộc điều tra. 

----
## Kết nối tới lab

Việc truy cập môi trường lab để hoàn thành phần này của bài lab sẽ hơi khác một chút. Ta dùng [XfreeRDP](https://manpages.ubuntu.com/manpages/trusty/man1/xfreerdp.1.html) để có quyền truy cập desktop vào máy ảo của lab, nhằm sử dụng Wireshark từ bên trong môi trường.

Ta sẽ kết nối tới lab của Academy như bình thường, dùng VM của riêng bạn với VPN key của HTB Academy hoặc Pwnbox tích hợp sẵn trong phần module. Bạn có thể khởi động FreeRDP client trên Pwnbox bằng cách gõ lệnh sau vào shell khi target đã được khởi tạo (spawn):

```bash
xfreerdp /v:<target IP> /u:htb-student /p:HTB_@cademy_stdnt!
```  

Bạn có thể tìm `target IP`, `Username` và `Password` cần thiết ở bên dưới:

* Nhấp vào phần Questions bên dưới để spawn target host và lấy địa chỉ IP.
  * `IP` == <span class="targetIp"></span>
  * `Username` ==  htb-student
  * `Password` == HTB_@cademy_stdnt!

 

#### Bắt đầu capture bằng Wireshark
Ta sẽ sniff lưu lượng từ host mà ta đã đăng nhập vào từ VM riêng hoặc Pwnbox. Dùng interface `ENS224` trong Wireshark, để phiên capture chạy vài phút rồi mới dừng. Mục tiêu của ta là xác định xem có điều gì đang diễn ra giữa host của người dùng và một máy khác trong mạng công ty hoặc mạng bên ngoài không.

#### Tự phân tích
Trước khi làm theo các task bên dưới, hãy dành thời gian tự đi qua lưu lượng pcap mà không cần hướng dẫn. Sử dụng các kỹ năng đã thực hành trước đó, như follow stream, phân tích conversation và các kỹ năng khác để xác định điều gì đang diễn ra. Hãy ghi nhớ các câu hỏi sau khi thực hiện phân tích:

* Có thể thấy bao nhiêu conversation?
* Ta có xác định được đâu là client và đâu là server không?
* Những giao thức nào đang được sử dụng?
* Có điều gì đáng chú ý đang diễn ra không? ( cổng bị dùng sai mục đích, lưu lượng hoặc thông tin đăng nhập dạng clear text, v.v.)

Trong lab này, ta quan tâm tới các host 172.16.10.2 và 172.16.10.20 khi thực hiện các bước sau. Trong quá trình phân tích, lẽ ra ta đã nhận thấy có lưu lượng web giữa các host này và một số lưu lượng FTP. Hãy đào sâu hơn một chút. 

#### Phân tích FTP
Khi xem xét lưu lượng đã capture, ta có nhận thấy lưu lượng nào liên quan tới FTP không?
Ai là server của lưu lượng đó? 

Ta có xác định được đó là một người dùng đã xác thực đang thực hiện các hành động này, hay họ là anonymous không?  

#### Lọc kết quả

Giờ ta đã thấy một số lưu lượng đáng chú ý, hãy thử lấy file ra khỏi đường truyền (off the wire). 
  
Xem xét các lệnh FTP để xác định cần kiểm tra gì, rồi trích xuất các file từ ftp-data và ráp lại

<details>
  <summary><b>Nhấn để xem đáp án</b></summary>

1. Xác định mọi lưu lượng FTP bằng display filter `ftp`.
2. Xem các lệnh điều khiển được gửi giữa server và các host để xác định có gì được truyền hay không và ai đã làm việc đó, bằng filter `ftp.request.command`.
3. Chọn một file, rồi lọc theo `ftp-data`. Chọn một packet tương ứng với file ta quan tâm và follow TCP stream liên quan tới nó.
4. Khi xong, đổi "Show and save data as" thành "Raw" và lưu nội dung với tên file gốc.
5. Xác minh việc trích xuất bằng cách kiểm tra loại file.
   
</details>

#### Phân tích HTTP
Lẽ ra ta cũng đã thấy một ít lưu lượng HTTP. Bạn có thấy như vậy không?

Nếu có, ta có xác định được đâu là webserver không?

Ứng dụng nào đang chạy webserver?

Những method request phổ biến nhất mà bạn thấy là gì?


#### Follow stream và trích xuất (các) item tìm được

Giờ hãy thử follow HTTP stream và xác định xem có gì để trích xuất không.

<details>
  <summary><b>Nhấn để xem đáp án</b></summary>

Áp dụng filter “http && image-jfif” để chỉ giữ lại các packet HTTP (80/TCP) kèm một filter chỉ giữ lại JPEG File Interchange Format (các file JPEG).

Tìm dòng mà Web Server phản hồi bằng thông điệp “200 OK”, đóng vai trò xác nhận/biên nhận cho request GET của người dùng.

Chọn “File > Export Objects > HTTP > `file.JPG`

</details>

---
## Tóm tắt
Kết thúc bài lab này, ta sẽ có thể mở các file .pcap đã capture trước đó, áp dụng display filter, follow stream và trích xuất item từ file capture. Hãy thử nghiệm các cách capture lưu lượng mới và áp dụng filter để tìm lưu lượng cụ thể. Để kiểm tra mức độ hiểu bài, hãy trả lời các câu hỏi dưới đây với lưu lượng mà bạn tự capture.

Kiểm tra mức độ hiểu bài:

• Bạn đã dùng những filter hoặc expression nào? Chúng có hiệu quả không?

• Các filter này ảnh hưởng thế nào tới lưu lượng mà bạn có thể thấy trong bản capture?

• Việc tận dụng các tính năng này có thể mang lại lợi ích gì cho bạn và nhiệm vụ của bạn?

• Bạn sẽ dùng filter nào nếu chỉ muốn xem lưu lượng TCP từ client?
