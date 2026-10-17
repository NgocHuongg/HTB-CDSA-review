# Familiarity With Wireshark (Làm quen với Wireshark)
----

Bài lab này nhằm giúp làm quen cơ bản với Wireshark và sử dụng giao diện đồ họa của nó để capture traffic. Ta sẽ dành thời gian dùng capture filter và display filter, đồng thời làm quen với các loại output khác nhau mà công cụ hiển thị.  
  
Một người dùng mang laptop đến helpdesk, phàn nàn rằng thời gian tải trang lâu bất thường khi lướt web. Họ nói cứ như thể mạng bị nghẽn và máy tính đang tạo rất nhiều kết nối khác nhau. Ta được giao nhiệm vụ kiểm tra xem máy có hoạt động bình thường không. Để làm vậy, ta kết nối máy vào mạng và bắt đầu capture packet trong khi lướt web. Hãy phân tích những gì thấy được trong output để xác định có gì bất thường không. Lúc này ta chỉ quan tâm đến chiếc laptop đang xét, nên hãy lọc bỏ mọi traffic không đi tới hoặc không xuất phát từ nó.  
  
<div class="alert alert-primary fade show" role="alert">
    <i class="mdi mdi-information-outline mr-2"></i>
Nếu bạn muốn làm bài lab này theo hướng tự khám phá, tôi đã liệt kê các nhiệm vụ tổng quát cần hoàn thành. Để xem hướng dẫn chi tiết cách hoàn thành từng bước, hãy xem phần lời giải bên dưới mỗi nhiệm vụ.
</div>  

----    
## Các nhiệm vụ  
  
#### Nhiệm vụ #1 

`Validate Wireshark is installed, then open Wireshark and familiarize yourself with the GUI windows and toolbars.`

Hãy dành một phút khám phá Wireshark GUI. Đảm bảo ta biết tùy chọn nào nằm dưới tab nào trong các menu lệnh. Hãy đặc biệt chú ý đến tab Capture và những gì nằm trong đó.   

---
#### Nhiệm vụ #2

`Select an interface to run a capture on and create a capture filter to show only traffic to and from your host IP.`
    
Chọn interface đang hoạt động (eth0, hoặc card Wifi của bạn) để capture.  
<details>
  <summary><b>Bấm để xem đáp án</b></summary>

Từ màn hình chính, chọn interface bạn muốn capture từ menu thả xuống. Bạn cũng có thể bấm vào tab Capture → options → interface → rồi chọn interface phù hợp.

</details>

---
#### Nhiệm vụ #3

`Create a capture filter.`

Tiếp theo, ta muốn tạo một capture filter chỉ hiển thị traffic xuất phát từ hoặc đi tới địa chỉ IP của ta, rồi áp dụng nó.

<details>
  <summary><b>Bấm để xem đáp án</b></summary>

Để làm vậy, từ màn hình chính, chọn capture options và gõ filter host X.X.X.X (hoặc IP trên interface của bạn)  
Khi capture filter đã đúng, chọn Start.

</details>

---        
#### Nhiệm vụ #4

`Navigate to a webpage to generate some traffic.`

Mở trình duyệt web và truy cập pepsi.com. Lặp lại bước này với http://apache.org. Trong khi trang đang tải, chuyển lại cửa sổ Wireshark. Ta sẽ thấy traffic chạy qua cửa sổ capture. Khi trang đã tải xong, dừng capture bằng cách bấm vào ô vuông màu đỏ có nhãn Stop trên action bar.     

---
#### Nhiệm vụ #5

`Use the capture results to answer the following questions.`

Có nhiều session được thiết lập giữa máy và webserver không? Làm sao bạn biết?  
  
Những giao thức tầng ứng dụng (application-level) nào được hiển thị trong kết quả?  
  
Ta có nhận ra được gì ở dạng clear text không? Đó là gì?    
    
<details>
  <summary><b>Bấm để xem đáp án</b></summary>

Khi truy cập pepsi.com và http://apache.org, bạn sẽ thấy nhiều stream khác nhau và nhiều giao thức khác nhau: DNS để request các record cho các trang, HTTP cho trang apache.org, HTTPS cho Pepsi.com, cùng với mọi traffic khác đang diễn ra trong network segment của bạn lúc đó.
Nếu bạn nhận thấy sự khác biệt giữa các traffic, bạn đang đi đúng hướng. Nếu nhìn vào output từ apache.org, nó sẽ ở dạng plain text. Điều này xảy ra vì HTTP không được mã hóa. Tuy nhiên, traffic HTTPS sẽ trông khác hẳn.

</details>
       
Đừng dừng ở đây. Hãy dành thời gian làm quen với output mà Wireshark cung cấp và cách ta có thể thay đổi góc nhìn. Ta cũng có thể dùng các file PCAP mẫu tại https://wiki.wireshark.org/SampleCaptures để phân tích các giao thức khác nhau, thậm chí cả traffic ICS SCADA và virus. Nếu bạn đang kết nối vào mạng Academy để làm lab này, hãy dành thời gian capture traffic trên interface được cung cấp. Nếu chịu khó tìm, bạn có thể thấy một số network traffic thú vị. 

----  
## Tóm tắt   
    
Kết thúc bài lab này, ta đã quen với Wireshark cũng như giao diện GUI trông và hoạt động như thế nào. Ta đã làm quen với command bar, action bar và những gì nằm trong từng tab tương ứng. Bạn cần hiểu cách chọn interface để capture và bắt đầu thành công một capture có áp dụng filter. Hãy thử nghiệm với một vài filter do chính bạn thiết kế để xem có thể dùng những tổ hợp nào và chúng định hình kết quả ra sao.
