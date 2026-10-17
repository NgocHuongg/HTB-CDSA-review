# Strange Telnet & UDP Connections (Các kết nối Telnet và UDP bất thường)


Khi tìm kiếm traffic lạ, ta luôn nên xem xét traffic telnet và UDP. Suy cho cùng, chúng có thể bị bỏ qua, nhưng lại có thể đặc biệt hữu ích trong việc phát hiện vấn đề khi phân tích traffic.

---
## Telnet

![Sơ đồ hoạt động của Telnet cho thấy terminal và ứng dụng giao tiếp qua Internet, dùng Telnet client và server với network virtual terminal.](images/Internet.png)

Telnet là một giao thức mạng cho phép thiết lập phiên giao tiếp tương tác hai chiều giữa hai thiết bị qua mạng. Giao thức này được phát triển vào những năm 1970 và được định nghĩa trong RFC 854. Những năm gần đây, mức độ sử dụng nó đã giảm đáng kể so với SSH. 

Trong nhiều trường hợp cũ hơn, chẳng hạn các máy kiểu Windows NT, chúng vẫn có thể dùng telnet để cung cấp khả năng điều khiển lệnh từ xa (remote command and control) cho microsoft terminal services.

Tuy nhiên, ta luôn nên để ý các giao tiếp telnet kỳ lạ, bất thường, vì kẻ tấn công cũng có thể dùng nó cho mục đích độc hại như data exfiltration và tunneling.

## Tìm traffic Telnet truyền thống trên cổng 23

**File PCAP liên quan**:
* `telnet_tunneling_23.pcapng`

Giả sử mở Wireshark, ta có thể thấy một số giao tiếp telnet xuất phát từ cổng 23. Trong trường hợp này, ta luôn có thể kiểm tra kỹ hơn traffic này.

![Bản capture Wireshark cho thấy traffic TCP và Telnet giữa 192.168.10.5 và 192.168.10.7, kèm chi tiết sequence và acknowledgment.](images/1-telnet.png)

May mắn cho ta là traffic telnet thường ở dạng không mã hoá và dễ kiểm tra, nhưng giống như ICMP, DNS và các phương thức tunneling khác, kẻ tấn công có thể mã hoá, encode hoặc làm rối (obfuscate) đoạn text này. Vì vậy ta luôn nên cẩn thận.

![Chi tiết gói tin mạng cho thấy dữ liệu Telnet từ 192.168.10.5 tới 192.168.10.7, cho thấy giao tiếp Telnet không mã hoá.](images/2-telnet.png)

## TCP Telnet không được nhận diện trong Wireshark

**File PCAP liên quan**:
* `telnet_tunneling_9999.pcapng`

Telnet chỉ là một giao thức giao tiếp, vì thế kẻ tấn công có thể dễ dàng chuyển nó sang một cổng khác. Để mắt tới các giao tiếp trên cổng lạ này có thể giúp ta tìm ra các hành động có khả năng độc hại. Hãy xem ví dụ sau.

![Bản capture Wireshark cho thấy traffic TCP giữa 192.168.10.5 và 192.168.10.7, kèm chi tiết sequence và acknowledgment.](images/3-telnet.png)

Ta có thể thấy rất nhiều giao tiếp từ một client trên cổng 9999. Ta có thể đi sâu hơn một chút bằng cách xem nội dung của các giao tiếp này.

![Hex dump hiển thị dữ liệu kèm bản dịch ASCII, bao gồm chữ 'Telnet' theo sau là các dấu chấm than.](images/4-telnet.png)

Nếu thấy thứ gì đó như ở trên, ta sẽ muốn follow TCP stream này. 

![TCP stream trong Wireshark hiển thị dữ liệu Telnet với thông điệp: 'telnet!!!!!!!! exfil this why do we exfil? HTB{telnet tunnel pls and thank you}'.](images/5-telnet.png)

Làm vậy có thể giúp ta kiểm tra các hành động có khả năng độc hại.

---
## Giao thức Telnet qua IPv6

**File PCAP liên quan**:
* `telnet_tunneling_ipv6.pcapng`

Suy cho cùng, trừ khi mạng cục bộ của ta được cấu hình để dùng IPv6, việc quan sát thấy traffic IPv6 có thể là một indicator cho thấy có hành động xấu trong môi trường của ta. Ta có thể thấy việc dùng địa chỉ IPv6 cho telnet như sau.

![Bản capture Wireshark cho thấy traffic Telnet và TCP giữa các địa chỉ IPv6, kèm chi tiết sequence và acknowledgment, bao gồm cả ICMPv6 neighbor solicitation và advertisement.](images/6-telnet.png)

Ta có thể thu hẹp filter trong Wireshark để chỉ hiển thị traffic telnet từ các địa chỉ này bằng filter sau.

- `((ipv6.src_host == fe80::c9c8:ed3:1b10:f10b) or (ipv6.dst_host == fe80::c9c8:ed3:1b10:f10b)) and telnet`

![Bản capture Wireshark cho thấy traffic Telnet giữa các địa chỉ IPv6, với các gói dữ liệu Telnet đều đặn.](images/7-telnet.png)

Tương tự, ta có thể kiểm tra nội dung các gói tin này qua field data của chúng, hoặc bằng cách follow TCP stream.

![Chi tiết gói tin mạng cho thấy dữ liệu Telnet từ địa chỉ IPv6 fe80::c9c8:ed3:1b10:f10b tới fe80::46a8:5bff:fe95:682a, cho thấy khả năng Telnet tunneling.](images/8-telnet.png)

## Theo dõi các giao tiếp UDP

**File PCAP liên quan**:
* `udp_tunneling.pcapng`

Mặt khác, kẻ tấn công có thể chọn dùng kết nối UDP thay vì TCP trong các nỗ lực exfiltration.

![Sơ đồ so sánh giao tiếp TCP và UDP. TCP cho thấy three-way handshake với SYN, SYN-ACK và ACK. UDP cho thấy một request đơn giản và nhiều response.](images/udp-tcp.jpg)

Một trong những điểm khác biệt lớn nhất giữa TCP và UDP là UDP không cần kết nối (connectionless) và truyền nhanh. Hãy xem traffic sau làm ví dụ.

![Bản capture Wireshark cho thấy traffic UDP từ 192.168.10.5 tới 192.168.10.7, với độ dài gói và số cổng không đổi.](images/1-udp.png)

Ta sẽ thấy rằng thay vì chuỗi SYN, SYN/ACK, ACK, các giao tiếp được gửi ngay tới bên nhận. Giống như TCP, ta có thể follow traffic UDP trong Wireshark và kiểm tra nội dung của nó.

![UDP stream trong Wireshark hiển thị bảng chữ cái và các con số, kèm thông điệp nói rằng UDP phù hợp cho exfiltration vì ít bị giám sát hơn so với TCP.](images/2-udp.png)

## Các cách dùng phổ biến của UDP

UDP, dù kém tin cậy hơn TCP, lại cung cấp kết nối nhanh hơn nhờ trạng thái connectionless của nó. Vì vậy, ta có thể gặp traffic hợp lệ dùng UDP như sau:


|**Bước**|**Mô tả**|
|-|-|
|`1. Real-time Applications` | Các ứng dụng như streaming media, game online, giao tiếp thoại và video thời gian thực|
|`2. DNS (Domain Name System)` | DNS query và response dùng UDP |
|`3. DHCP (Dynamic Host Configuration Protocol)` | DHCP dùng UDP để cấp phát địa chỉ IP và thông tin cấu hình cho các thiết bị mạng.|
|`4. SNMP (Simple Network Management Protocol)` | SNMP dùng UDP để giám sát và quản lý mạng|
|`5. TFTP (Trivial File Transfer Protocol)` | TFTP dùng UDP cho việc truyền file đơn giản, thường được các hệ thống Windows cũ và một số hệ thống khác sử dụng.|
