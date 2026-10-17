# Tcpdump Packet Filtering (Lọc packet với Tcpdump)
----  
Tcpdump cung cấp một cách mạnh mẽ và hiệu quả để phân tích (parse) dữ liệu có trong các bản capture thông qua packet filter (bộ lọc packet). Section này sẽ xem xét các filter đó và cho ta thấy sơ lược cách chúng thay đổi output của bản capture.

---
## Lọc và các tuỳ chọn cú pháp nâng cao

Việc dùng các tuỳ chọn lọc nâng cao hơn như những tuỳ chọn được liệt kê bên dưới sẽ cho phép ta thu gọn lượng traffic được in ra output hoặc ghi vào file. Bằng cách giảm lượng thông tin capture và ghi xuống đĩa, ta có thể giúp giảm dung lượng cần để ghi file và giúp buffer xử lý dữ liệu nhanh hơn. Filter có thể rất tiện khi kết hợp với các tuỳ chọn cú pháp tiêu chuẩn của tcpdump. Ta có thể capture rộng tuỳ ý, hoặc cực kỳ cụ thể để chỉ capture packet từ một host nhất định, hay thậm chí packet có một bit cụ thể trong TCP header được bật (on). Rất nên khám phá các filter nâng cao hơn và tìm ra các cách kết hợp khác nhau.
  
Các filter và toán tử (operator) nâng cao này hoàn toàn không phải là danh sách đầy đủ. Chúng được chọn vì là những filter được dùng thường xuyên nhất và sẽ giúp ta nhanh chóng bắt tay vào việc. Khi được áp dụng, các filter này sẽ kiểm tra mọi packet được capture và tìm các giá trị đã cho trong protocol header để so khớp.

#### Các filter hữu ích của TCPDump  

|**Filter**     |**Kết quả**     |
|---  |---  |
|host     |`host` sẽ lọc traffic hiển thị để cho thấy mọi thứ liên quan đến host được chỉ định. Hai chiều (bi-directional)    |
|src / dest     |`src` và `dest` là các modifier (bổ ngữ). Ta có thể dùng chúng để chỉ định host hoặc port nguồn hay đích.    |
|net    |`net` sẽ cho ta thấy mọi traffic xuất phát từ hoặc đi tới network được chỉ định. Nó dùng ký hiệu /.    |
|proto    |sẽ lọc theo một loại protocol cụ thể. (ví dụ: ether, TCP, UDP và ICMP)    |
|port     |`port` là hai chiều. Nó sẽ hiển thị mọi traffic có port được chỉ định là port nguồn hoặc đích.     |
|portrange    |`portrange` cho phép ta chỉ định một dải port. (0-1024)    |
|less / greater "< >"   |`less` và `greater` có thể dùng để tìm packet hoặc tuỳ chọn protocol có kích thước cụ thể.     |
|and / &&     |`and` `&&` có thể dùng để nối hai filter khác nhau lại với nhau. Ví dụ: src host AND port.    |
|or     |`or` cho phép khớp với một trong hai điều kiện. Không cần phải thoả cả hai. Phần này có thể hơi khó nắm.   |
|not    |`not` là modifier mang nghĩa mọi thứ trừ x. Ví dụ: not UDP.    |   
      
Với các filter này, ta có thể lọc network traffic theo hầu hết các thuộc tính để thuận tiện cho việc phân tích. Hãy xem một số ví dụ về các filter này và chúng trông như thế nào khi được sử dụng. Khi dùng filter `host`, bất kỳ IP nào ta nhập vào sẽ được kiểm tra trong field IP nguồn hoặc IP đích. Điều này có thể thấy trong output bên dưới. 

#### Filter theo host

```shell-session
[!bash!]$ ### Syntax: host [IP]
[!bash!]$ sudo tcpdump -i eth0 host 172.16.146.2

tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
14:50:53.072536 IP 172.16.146.2.48738 > ec2-52-31-199-148.eu-west-1.compute.amazonaws.com.https: Flags [P.], seq 3400465007:3400465044, ack 254421756, win 501, options [nop,nop,TS val 220968655 ecr 80852594], length 37
14:50:53.108740 IP 172.16.146.2.55606 > 172.67.1.1.https: Flags [P.], seq 4227143181:4227143273, ack 1980233980, win 21975, length 92
14:50:53.173084 IP 172.67.1.1.https > 172.16.146.2.55606: Flags [.], ack 92, win 69, length 0
14:50:53.175017 IP 172.16.146.2.35744 > 172.16.146.1.domain: 55991+ PTR? 148.199.31.52.in-addr.arpa. (44)
14:50:53.175714 IP 172.16.146.1.domain > 172.16.146.2.35744: 55991 1/0/0 PTR ec2-52-31-199-148.eu-west-1.compute.amazonaws.com. (107) 
```  

Filter này thường được dùng khi ta chỉ muốn xem xét một host hoặc server cụ thể. Với nó, ta có thể xác định host hoặc server này liên lạc với ai và theo cách nào. Dựa trên cấu hình mạng của mình, ta sẽ hiểu được kết nối này có hợp lệ (legitimate) hay không. Nếu việc liên lạc có vẻ bất thường, ta có thể dùng các filter và tuỳ chọn khác để xem nội dung chi tiết hơn. Ngoài từng host riêng lẻ, ta cũng có thể chỉ định host nguồn cũng như host đích. Ta còn có thể chỉ định toàn bộ network và các port của chúng.

#### Filter nguồn/đích (Source/Destination)

```shell-session
[!bash!]$ ### Syntax: src/dst [host|net|port] [IP|Network Range|Port]
[!bash!]$ sudo tcpdump -i eth0 src host 172.16.146.2
  
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
14:53:36.199628 IP 172.16.146.2.48766 > ec2-52-31-199-148.eu-west-1.compute.amazonaws.com.https: Flags [P.], seq 1428378231:1428378268, ack 3778572066, win 501, options [nop,nop,TS val 221131782 ecr 80889856], length 37
14:53:36.203166 IP 172.16.146.2.55606 > 172.67.1.1.https: Flags [P.], seq 4227144035:4227144103, ack 1980235221, win 21975, length 68
14:53:36.267059 IP 172.16.146.2.36424 > 172.16.146.1.domain: 40873+ PTR? 148.199.31.52.in-addr.arpa. (44)
14:53:36.267880 IP 172.16.146.2.51151 > 172.16.146.1.domain: 10032+ PTR? 2.146.16.172.in-addr.arpa. (43)
14:53:36.276425 IP 172.16.146.2.46588 > 172.16.146.1.domain: 28357+ PTR? 1.1.67.172.in-addr.arpa. (41)
14:53:36.337722 IP 172.16.146.2.48766 > ec2-52-31-199-148.eu-west-1.compute.amazonaws.com.https: Flags [.], ack 34, win 501, options [nop,nop,TS val 221131920 ecr 80899875], length 0
14:53:36.338841 IP 172.16.146.2.48766 > ec2-52-31-199-148.eu-west-1.compute.amazonaws.com.https: Flags [.], ack 65, win 501, options [nop,nop,TS val 221131921 ecr 80899875], length 0
14:53:36.339273 IP 172.16.146.2.48766 > ec2-52-31-199-148.eu-west-1.compute.amazonaws.com.https: Flags [P.], seq 37:68, ack 66, win 501, options [nop,nop,TS val 221131922 ecr 80899875], length 31
14:53:36.339334 IP 172.16.146.2.48766 > ec2-52-31-199-148.eu-west-1.compute.amazonaws.com.https: Flags [F.], seq 68, ack 66, win 501, options [nop,nop,TS val 221131922 ecr 80899875], length 0
14:53:36.370791 IP 172.16.146.2.32972 > 172.16.146.1.domain: 3856+ PTR? 1.146.16.172.in-addr.arpa. (43)
```  

Source và destination cho phép ta làm việc với chiều của liên lạc. Ví dụ, trong output vừa rồi, ta đã chỉ định host `source` là `172.16.146.2`, và chỉ những packet được gửi từ host này mới bị bắt lại (intercept). Điều này cũng có thể áp dụng cho port và dải network. Một ví dụ dùng `src port #` sẽ trông như sau:

#### Dùng source kết hợp port làm filter

```shell-session
[!bash!]$ sudo tcpdump -i eth0 tcp src port 80

06:17:08.222534 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [S.], seq 290218379, ack 951057940, win 5840, options [mss 1380,nop,nop,sackOK], length 0
06:17:08.783340 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], ack 480, win 6432, length 0
06:17:08.993643 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 1:1381, ack 480, win 6432, length 1380: HTTP: HTTP/1.1 200 OK
06:17:09.123830 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 1381:2761, ack 480, win 6432, length 1380: HTTP
06:17:09.754737 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 2761:4141, ack 480, win 6432, length 1380: HTTP
06:17:09.864896 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [P.], seq 4141:5521, ack 480, win 6432, length 1380: HTTP
06:17:09.945011 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 5521:6901, ack 480, win 6432, length 1380: HTTP
```

Để ý thấy giờ ta chỉ thấy một phía của cuộc hội thoại chứ? Đó là vì ta đang lọc theo source port 80 (HTTP). Khi được dùng theo cách này, `net` sẽ lấy mọi thứ khớp với ký hiệu `/` của một network. Trong ví dụ, ta đang tìm mọi thứ có đích là network `172.16.146.0/24`. 

#### Dùng destination kết hợp với filter net

```shell-session
[!bash!]$ sudo tcpdump -i eth0 dest net 172.16.146.0/24

tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
16:33:14.376003 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [.], ack 1486880537, win 316, options [nop,nop,TS val 2311579424 ecr 263866084], length 0
16:33:14.442123 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [P.], seq 0:385, ack 1, win 316, options [nop,nop,TS val 2311579493 ecr 263866084], length 385
16:33:14.442188 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [P.], seq 385:1803, ack 1, win 316, options [nop,nop,TS val 2311579493 ecr 263866084], length 1418
16:33:14.442223 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [.], seq 1803:4639, ack 1, win 316, options [nop,nop,TS val 2311579494 ecr 263866084], length 2836
16:33:14.443161 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [P.], seq 4639:5817, ack 1, win 316, options [nop,nop,TS val 2311579495 ecr 263866084], length 1178
16:33:14.443199 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [.], seq 5817:8653, ack 1, win 316, options [nop,nop,TS val 2311579495 ecr 263866084], length 2836
16:33:14.444407 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [.], seq 8653:10071, ack 1, win 316, options [nop,nop,TS val 2311579497 ecr 263866084], length 1418
16:33:14.445479 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [.], seq 10071:11489, ack 1, win 316, options [nop,nop,TS val 2311579497 ecr 263866084], length 1418
16:33:14.445531 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [.], seq 11489:12907, ack 1, win 316, options [nop,nop,TS val 2311579498 ecr 263866084], length 1418
16:33:14.446955 IP 64.233.177.103.443 > 172.16.146.2.36050: Flags [.], seq 12907:14325, ack 1, win 316, options [nop,nop,TS val 2311579498 ecr 263866084], length 1418
```
  
Filter này có thể dùng tên protocol thông dụng hoặc số hiệu protocol (protocol number) cho bất kỳ protocol IP, IPv6 hay Ethernet nào. Các ví dụ phổ biến là `tcp[6], udp[17], or icmp[1]`. Trong các output dưới đây, ta sẽ dùng cả tên thông dụng (ở trên) lẫn số hiệu protocol (ở dưới). Có thể thấy cả hai cho ra cùng một output. Phần lớn trường hợp, hai cách này có thể thay thế cho nhau, nhưng dùng `proto` sẽ hữu ích hơn khi bạn bắt đầu mổ xẻ (dissect) một phần cụ thể của IP header hoặc header của các protocol khác. Điều này sẽ rõ hơn ở phần sau của section khi ta nói về việc tìm các TCP flag. Ta có thể xem [tài liệu này](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml) để có danh sách hữu ích về các số hiệu protocol.

#### Filter theo protocol - Tên thông dụng

```shell-session
[!bash!]$ ### Syntax: [tcp/udp/icmp]
[!bash!]$ sudo tcpdump -i eth0 udp

06:17:09.864896 IP dialin-145-254-160-237.pools.arcor-ip.net.3009 > 145.253.2.203.domain: 35+ A? pagead2.googlesyndication.com. (47)
06:17:10.225414 IP 145.253.2.203.domain > dialin-145-254-160-237.pools.arcor-ip.net.3009: 35 4/0/0 CNAME pagead2.google.com., CNAME pagead.google.akadns.net., A 216.239.59.104, A 216.239.59.99 (146)
```

#### Filter theo protocol - Số hiệu

```shell-session
[!bash!]$ ### Syntax: proto [protocol number]
[!bash!]$ sudo tcpdump -i eth0 proto 17

06:17:09.864896 IP dialin-145-254-160-237.pools.arcor-ip.net.3009 > 145.253.2.203.domain: 35+ A? pagead2.googlesyndication.com. (47)
06:17:10.225414 IP 145.253.2.203.domain > dialin-145-254-160-237.pools.arcor-ip.net.3009: 35 4/0/0 CNAME pagead2.google.com., CNAME pagead.google.akadns.net., A 216.239.59.104, A 216.239.59.99 (146)
```

Khi dùng filter `port`, ta nên nhớ mình đang tìm gì và protocol đó hoạt động ra sao. Một số protocol tiêu chuẩn như HTTP hay HTTPS chỉ dùng port 80 và 443 với transport protocol là TCP. Với suy nghĩ đó, hãy hình dung port như một cách đơn giản để thiết lập kết nối, còn các protocol như TCP và UDP để xác định xem chúng có dùng một phương thức đã được thiết lập (established) hay không. Bản thân port có thể được dùng cho bất cứ thứ gì, nên lọc theo port 80 sẽ hiển thị mọi traffic qua số port đó. Tuy nhiên, nếu muốn capture toàn bộ traffic HTTP, dùng `tcp port 80` sẽ đảm bảo ta chỉ thấy traffic HTTP. 

Với các protocol dùng cả TCP và UDP cho các chức năng khác nhau, như DNS, ta có thể lọc theo một trong hai, `TCP/UDP port 53`, hoặc lọc theo `port 53`. Làm vậy, ta sẽ thấy mọi traffic dùng port đó, bất kể transport protocol là gì.
  
#### Filter theo port

```shell-session
[!bash!]$ ### Syntax: port [port number]
[!bash!]$ sudo tcpdump -i eth0 tcp port 443

06:17:07.311224 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [S], seq 951057939, win 8760, options [mss 1460,nop,nop,sackOK], length 0
06:17:08.222534 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [S.], seq 290218379, ack 951057940, win 5840, options [mss 1380,nop,nop,sackOK], length 0
06:17:08.222534 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 1, win 9660, length 0
06:17:08.222534 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [P.], seq 1:480, ack 1, win 9660, length 479: HTTP: GET /download.html HTTP/1.1
06:17:08.783340 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], ack 480, win 6432, length 0
06:17:08.993643 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 1:1381, ack 480, win 6432, length 1380: HTTP: HTTP/1.1 200 OK
06:17:09.123830 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 1381, win 9660, length 0
06:17:09.123830 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 1381:2761, ack 480, win 6432, length 1380: HTTP
06:17:09.324118 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 2761, win 9660, length 0
06:17:09.754737 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 2761:4141, ack 480, win 6432, length 1380: HTTP
06:17:09.864896 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [P.], seq 4141:5521, ack 480, win 6432, length 1380: HTTP
06:17:09.864896 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 5521, win 9660, length 0
06:17:09.945011 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 5521:6901, ack 480, win 6432, length 1380: HTTP
06:17:10.125270 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 6901, win 9660, length 0
06:17:10.205385 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], seq 6901:8281, ack 480, win 6432, length 1380: HTTP
06:17:10.295515 IP dialin-145-254-160-237.pools.arcor-ip.net.3371 > 216.239.59.99.http: Flags [P.], seq 918691368:918692089, ack 778785668, win 8760, length 721: HTTP: GET /pagead/ads?client=ca-pub-2309191948673629&random=1084443430285&lmt=1082467020&format=468x60_as&output=html&url=http%3A%2F%2Fwww.ethereal.com%2Fdownload.html&color_bg=FFFFFF&color_text=333333&color_link=000000&color_url=666633&color_border=666633 HTTP/1.1
```

Ngoài từng port riêng lẻ, ta cũng có thể chỉ định các dải port cụ thể để TCPdump lắng nghe. Lắng nghe trên một dải port có thể đặc biệt hữu ích khi ta thấy network traffic từ những port không khớp với các dịch vụ đang chạy trên server của mình. Ví dụ, nếu ta có một web server chạy TCP port 80 và 443 ở một segment nhất định trong mạng, rồi đột nhiên xuất hiện network traffic đi ra từ TCP port 10000 hoặc các port khác, thì điều đó rất đáng ngờ.

Filter `portrange`, như bên dưới, cho phép ta thấy mọi thứ nằm trong dải port. Trong ví dụ, ta thấy một ít traffic DNS cùng với một số web request HTTP. 
   
#### Filter theo dải port
```shell-session
[!bash!]$ ### Syntax: portrange [portrange 0-65535]
[!bash!]$ sudo tcpdump -i eth0 portrange 0-1024

tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
13:10:35.092477 IP 172.16.146.1.domain > 172.16.146.2.32824: 47775 1/0/0 CNAME autopush.prod.mozaws.net. (81)
13:10:35.093217 IP 172.16.146.2.48078 > 172.16.146.1.domain: 30234+ A? ocsp.pki.goog. (31)
13:10:35.093334 IP 172.16.146.2.48078 > 172.16.146.1.domain: 32024+ AAAA? ocsp.pki.goog. (31)
13:10:35.136255 IP 172.16.146.1.domain > 172.16.146.2.48078: 32024 2/0/0 CNAME pki-goog.l.google.com., AAAA 2607:f8b0:4002:c09::5e (94)
13:10:35.137348 IP 172.16.146.1.domain > 172.16.146.2.48078: 30234 2/0/0 CNAME pki-goog.l.google.com., A 172.217.164.67 (82)
13:10:35.137989 IP 172.16.146.2.55074 > atl26s18-in-f3.1e100.net.http: Flags [S], seq 1146136517, win 64240, options [mss 1460,sackOK,TS val 1337520268 ecr 0,nop,wscale 7], length 0
13:10:35.174443 IP atl26s18-in-f3.1e100.net.http > 172.16.146.2.55074: Flags [S.], seq 345110814, ack 1146136518, win 65535, options [mss 1430,sackOK,TS val 1000152427 ecr 1337520268,nop,wscale 8], length 0
13:10:35.174481 IP 172.16.146.2.55074 > atl26s18-in-f3.1e100.net.http: Flags [.], ack 1, win 502, options [nop,nop,TS val 1337520304 ecr 1000152427], length 0
13:10:35.174716 IP 172.16.146.2.55074 > atl26s18-in-f3.1e100.net.http: Flags [P.], seq 1:379, ack 1, win 502, options [nop,nop,TS val 1337520305 ecr 1000152427], length 378: HTTP: POST /gts1o1core HTTP/1.1
13:10:35.208007 IP atl26s18-in-f3.1e100.net.http > 172.16.146.2.55074: Flags [.], ack 379, win 261, options [nop,nop,TS val 1000152462 ecr 1337520305], length 0
```  

Tiếp theo, ta tìm mọi packet nhỏ hơn 64 byte. Từ output sau, có thể thấy trong bản capture này, các packet đó chủ yếu là packet `SYN`, `FIN` hoặc `KeepAlive`. Less than và greater than có thể là một bộ modifier hữu ích. Ví dụ, giả sử ta muốn capture traffic có chứa việc truyền một file hoặc một nhóm file. Ta biết các file này sẽ lớn hơn traffic thông thường. Để minh hoạ, ta có thể dùng `greater 500` (hoặc `'>500'`), filter này sẽ chỉ hiển thị các packet có kích thước lớn hơn 500 byte. Việc này sẽ loại bỏ khỏi khung nhìn tất cả các packet thừa mà ta đã biết là không cần quan tâm.


#### Filter less/greater 

```shell-session
[!bash!]$ ### Syntax: less/greater [size in bytes]
[!bash!]$ sudo tcpdump -i eth0 less 64

06:17:07.311224 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [S], seq 951057939, win 8760, options [mss 1460,nop,nop,sackOK], length 0
06:17:08.222534 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [S.], seq 290218379, ack 951057940, win 5840, options [mss 1380,nop,nop,sackOK], length 0
06:17:08.222534 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 1, win 9660, length 0
06:17:08.783340 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], ack 480, win 6432, length 0
06:17:09.123830 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 1381, win 9660, length 0
06:17:09.324118 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 2761, win 9660, length 0
06:17:09.864896 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 5521, win 9660, length 0
06:17:10.125270 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 6901, win 9660, length 0
06:17:10.325558 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 8281, win 9660, length 0
06:17:10.806249 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 11041, win 9660, length 0
06:17:10.956465 IP 216.239.59.99.http > dialin-145-254-160-237.pools.arcor-ip.net.3371: Flags [.], ack 918692089, win 31460, length 0
06:17:11.126710 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 12421, win 9660, length 0
06:17:11.266912 IP dialin-145-254-160-237.pools.arcor-ip.net.3371 > 216.239.59.99.http: Flags [.], ack 1590, win 8760, length 0
06:17:11.527286 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 13801, win 9660, length 0
06:17:11.667488 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 16561, win 9660, length 0
06:17:11.807689 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 17941, win 9660, length 0
06:17:12.088092 IP dialin-145-254-160-237.pools.arcor-ip.net.3371 > 216.239.59.99.http: Flags [.], ack 1590, win 8760, length 0
06:17:12.328438 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 18365, win 9236, length 0
06:17:25.216971 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [F.], seq 18365, ack 480, win 6432, length 0
06:17:25.216971 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [.], ack 18366, win 9236, length 0
06:17:37.374452 IP dialin-145-254-160-237.pools.arcor-ip.net.3372 > 65.208.228.223.http: Flags [F.], seq 480, ack 18366, win 9236, length 0
06:17:37.704928 IP 65.208.228.223.http > dialin-145-254-160-237.pools.arcor-ip.net.3372: Flags [.], ack 481, win 6432, length 0
```  

Ở trên là một ví dụ tuyệt vời về cách dùng `less`. Ta có thể dùng modifier `greater 500` để chỉ hiển thị các packet có từ 500 byte trở lên. Kết quả trả về có một phản hồi đặc biệt trong phần ASCII. Ta có thể nói được chuyện gì đã xảy ra ở đây không?

#### Dùng greater

```shell-session
[!bash!]$ sudo tcpdump -i eth0 greater 500

21:12:43.548353 IP 192.168.0.1.telnet > 192.168.0.2.1550: Flags [P.], seq 401695766:401696254, ack 2579866052, win 17376, options [nop,nop,TS val 2467382 ecr 10234152], length 488
E...;...@.................d.......C........
.%.6..)(Warning: no Kerberos tickets issued.
OpenBSD 2.6-beta (OOF) #4: Tue Oct 12 20:42:32 CDT 1999

Welcome to OpenBSD: The proactively secure Unix-like operating system.

Please use the sendbug(1) utility to report bugs in the system.
Before reporting a bug, please try to reproduce it with the latest
version of the code.  With bug reports, please try to ensure that
enough information to reproduce the problem is enclosed, and if a
known fix for it exists, include that as well.
```

`AND` với vai trò modifier sẽ cho ta thấy mọi thứ thoả mãn cả hai yêu cầu đã đặt ra. Ví dụ, `host 10.12.1.122 and tcp port 80` sẽ tìm mọi thứ từ host nguồn có chứa TCP port 80, hoặc ta có thể lọc traffic UDP trên một port cụ thể. Cả hai tiêu chí đều phải được thoả mãn thì filter mới capture packet đó. Ta có thể thấy điều này trong thực tế ở bên dưới. Ở đây ta dùng `host 192.168.0.1 and port 23` làm filter. Vì vậy ta sẽ chỉ thấy traffic đến từ host cụ thể này và chỉ là traffic port 23.


#### Filter AND

```shell-session
[!bash!]$ ### Syntax: and [requirement]
[!bash!]$ sudo tcpdump -i eth0 host 192.168.0.1 and port 23

21:12:38.387203 IP 192.168.0.2.1550 > 192.168.0.1.telnet: Flags [S], seq 2579865836, win 32120, options [mss 1460,sackOK,TS val 10233636 ecr 0,nop,wscale 0], length 0
21:12:38.389728 IP 192.168.0.1.telnet > 192.168.0.2.1550: Flags [S.], seq 401695549, ack 2579865837, win 17376, options [mss 1448,nop,wscale 0,nop,nop,TS val 2467372 ecr 10233636], length 0
21:12:38.389775 IP 192.168.0.2.1550 > 192.168.0.1.telnet: Flags [.], ack 1, win 32120, options [nop,nop,TS val 10233636 ecr 2467372], length 0
21:12:38.391363 IP 192.168.0.2.1550 > 192.168.0.1.telnet: Flags [P.], seq 1:28, ack 1, win 32120, options [nop,nop,TS val 10233636 ecr 2467372], length 27 [telnet DO SUPPRESS GO AHEAD, WILL TERMINAL TYPE, WILL NAWS, WILL TSPEED, WILL LFLOW, WILL LINEMODE, WILL NEW-ENVIRON, DO STATUS, WILL XDISPLOC]
21:12:38.537538 IP 192.168.0.1.telnet > 192.168.0.2.1550: Flags [P.], seq 1:4, ack 28, win 17349, options [nop,nop,TS val 2467372 ecr 10233636], length 3 [telnet DO AUTHENTICATION]
```  

Các modifier còn lại, `OR` và `NOT`, cung cấp cho ta cách chỉ định nhiều điều kiện hoặc phủ định một điều gì đó. Giờ hãy thử nghịch với chúng một chút. Ta nhận thấy gì ở output này? 

#### Capture cơ bản không dùng filter

```shell-session
[!bash!]$ sudo tcpdump -i eth0

tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
14:39:51.224071 IP 172.16.146.2 > dns.google: ICMP echo request, id 19623, seq 72, length 64
14:39:51.251635 IP dns.google > 172.16.146.2: ICMP echo reply, id 19623, seq 72, length 64
14:39:51.329340 IP 172.16.146.2.39003 > 172.16.146.1.domain: 8231+ PTR? 8.8.8.8.in-addr.arpa. (38)
14:39:51.330334 IP 172.16.146.1.domain > 172.16.146.2.39003: 8231 1/0/0 PTR dns.google. (62)
14:39:51.330613 IP 172.16.146.2.50633 > 172.16.146.1.domain: 65266+ PTR? 2.146.16.172.in-addr.arpa. (43)
14:39:51.331461 IP 172.16.146.1.domain > 172.16.146.2.50633: 65266 NXDomain* 0/0/0 (43)
14:39:51.399970 IP 172.16.146.2.54742 > 72.21.91.29.http: Flags [.], ack 358742210, win 501, options [nop,nop,TS val 1924174236 ecr 1068405332], length 0
14:39:51.420559 IP 72.21.91.29.http > 172.16.146.2.54742: Flags [.], ack 1, win 131, options [nop,nop,TS val 1068415563 ecr 1924143536], length 0
14:39:51.432107 IP 172.16.146.2.41928 > 172.16.146.1.domain: 7232+ PTR? 1.146.16.172.in-addr.arpa. (43)
14:39:51.432795 IP 172.16.146.1.domain > 172.16.146.2.41928: 7232 NXDomain* 0/0/0 (43)
14:39:51.433048 IP 172.16.146.2.47075 > 172.16.146.1.domain: 18932+ PTR? 29.91.21.72.in-addr.arpa. (42)
14:39:51.434374 IP 172.16.146.1.domain > 172.16.146.2.47075: 18932 NXDomain 0/1/0 (113)
14:39:52.225941 IP 172.16.146.2 > dns.google: ICMP echo request, id 19623, seq 73, length 64
14:39:52.252523 IP dns.google > 172.16.146.2: ICMP echo reply, id 19623, seq 73, length 64
14:39:52.683881 IP 172.16.146.2.47004 > 151.139.128.14.http: Flags [.], ack 2006616877, win 501, options [nop,nop,TS val 1585722998 ecr 2103316650], length 0
14:39:52.712283 IP 151.139.128.14.http > 172.16.146.2.47004: Flags [.], ack 1, win 507, options [nop,nop,TS val 2103326900 ecr 1585692473], length 0
```

Ta có một hỗn hợp các nguồn và đích khác nhau cùng với nhiều loại protocol. Nếu dùng modifier `OR` (hoặc `||`), ta có thể yêu cầu, chẳng hạn, traffic từ một host cụ thể hoặc chỉ traffic ICMP. Hãy chạy lại và thêm `OR` vào.


#### Filter OR

```shell-session
[!bash!]$ ### Syntax: or/|| [requirement]
[!bash!]$ sudo tcpdump -r sus.pcap icmp or host 172.16.146.1

reading from file sus.pcap, link-type EN10MB (Ethernet), snapshot length 262144
14:54:03.659163 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 21, length 64
14:54:03.691278 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 21, length 64
14:54:03.879882 ARP, Request who-has 172.16.146.1 tell 172.16.146.2, length 28
14:54:03.880266 ARP, Reply 172.16.146.1 is-at 8a:66:5a:11:8d:64 (oui Unknown), length 46
14:54:04.661179 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 22, length 64
14:54:04.687120 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 22, length 64
14:54:05.663097 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 23, length 64
14:54:05.686092 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 23, length 64
14:54:06.664174 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 24, length 64
14:54:06.697469 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 24, length 64
14:54:07.666273 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 25, length 64
14:54:07.701475 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 25, length 64
14:54:08.668364 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 26, length 64
14:54:08.694948 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 26, length 64
14:54:09.670523 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 27, length 64
14:54:09.694974 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 27, length 64
14:54:10.672858 IP 172.16.146.2 > dns.google: ICMP echo request, id 51661, seq 28, length 64
14:54:10.697834 IP dns.google > 172.16.146.2: ICMP echo reply, id 51661, seq 28, length 64
```  

Traffic của ta giờ trông hơi khác. Đó là vì nhiều packet khớp với biến ICMP, trong khi một số khớp với biến host. Vì vậy trong output này, ta có thể thấy một ít traffic ARP và traffic ICMP. Filter đã hoạt động vì 172.16.146.2 khớp với biến còn lại và xuất hiện như một host trong field nguồn hoặc đích. Giờ, chuyện gì sẽ xảy ra nếu ta dùng modifier `NOT` (hoặc `!`).

#### Filter NOT

```shell-session
[!bash!]$ ### Syntax: not/! [requirement]
[!bash!]$ sudo tcpdump -r sus.pcap not icmp

14:54:03.879882 ARP, Request who-has 172.16.146.1 tell 172.16.146.2, length 28
14:54:03.880266 ARP, Reply 172.16.146.1 is-at 8a:66:5a:11:8d:64 (oui Unknown), length 46
14:54:16.541657 IP 172.16.146.2.55592 > ec2-52-211-164-46.eu-west-1.compute.amazonaws.com.https: Flags [P.], seq 3569937476:3569937513, ack 2948818703, win 501, options [nop,nop,TS val 713252991 ecr 12282469], length 37
14:54:16.568659 IP 172.16.146.2.53329 > 172.16.146.1.domain: 24866+ A? app.hackthebox.eu. (35)
14:54:16.616032 IP 172.16.146.1.domain > 172.16.146.2.53329: 24866 3/0/0 A 172.67.1.1, A 104.20.66.68, A 104.20.55.68 (83)
14:54:16.616396 IP 172.16.146.2.56204 > 172.67.1.1.https: Flags [S], seq 2697802378, win 64240, options [mss 1460,sackOK,TS val 533261003 ecr 0,nop,wscale 7], length 0
14:54:16.637895 IP 172.67.1.1.https > 172.16.146.2.56204: Flags [S.], seq 752000032, ack 2697802379, win 65535, options [mss 1400,nop,nop,sackOK,nop,wscale 10], length 0
14:54:16.637937 IP 172.16.146.2.56204 > 172.67.1.1.https: Flags [.], ack 1, win 502, length 0
14:54:16.644551 IP 172.16.146.2.56204 > 172.67.1.1.https: Flags [P.], seq 1:514, ack 1, win 502, length 513
14:54:16.667236 IP 172.67.1.1.https > 172.16.146.2.56204: Flags [.], ack 514, win 66, length 0
14:54:16.668307 IP 172.67.1.1.https > 172.16.146.2.56204: Flags [P.], seq 1:2766, ack 514, win 66, length 2765
14:54:16.668319 IP 172.16.146.2.56204 > 172.67.1.1.https: Flags [.], ack 2766, win 496, length 0
14:54:16.670536 IP ec2-52-211-164-46.eu-west-1.compute.amazonaws.com.https > 172.16.146.2.55592: Flags [P.], seq 1:34, ack 37, win 114, options [nop,nop,TS val 12294021 ecr 713252991], length 33
14:54:16.670559 IP 172.16.146.2.55592 > ec2-52-211-164-46.eu-west-1.compute.amazonaws.com.https: Flags [.], ack 34, win 501, options [nop,nop,TS val 713253120 ecr 12294021], length 0
```  

Giờ nó trông khác hẳn. Ta chỉ thấy một ít traffic ARP, rồi thấy một số traffic HTTPS mà trước đó ta chưa thấy được. Đó là vì ta đã phủ định, không cho hiển thị mọi traffic ICMP bằng `not icmp`.

---
## Filter trước khi capture và xử lý sau khi capture  

Khi dùng filter, ta có thể áp dụng chúng trực tiếp lúc capture hoặc áp dụng khi đọc một file capture. Nếu áp dụng lúc capture, mọi traffic không khớp với filter sẽ bị loại bỏ (drop). Điều này sẽ làm giảm lượng dữ liệu trong bản capture và có thể loại mất traffic mà sau này ta cần, vì vậy chỉ nên dùng khi đang tìm một thứ cụ thể, chẳng hạn khi xử lý sự cố kết nối mạng. Khi áp dụng filter cho bản capture mà ta đọc từ file, filter sẽ phân tích file và loại bỏ khỏi output trên terminal mọi thứ không khớp với filter đã chỉ định. Dùng filter theo cách này có thể giúp ta điều tra mà vẫn giữ lại những dữ liệu có thể có giá trị trong bản capture. Nó sẽ không thay đổi vĩnh viễn file capture, và để thay đổi hoặc xoá filter khỏi output, ta cần chạy lại lệnh với cú pháp đã thay đổi.  
  
---
## Mẹo và thủ thuật khi đọc kết quả

Dùng switch `-S` sẽ hiển thị sequence number tuyệt đối (absolute), vốn có thể cực kỳ dài. Thông thường, tcpdump hiển thị sequence number tương đối (relative), dễ theo dõi và dễ đọc hơn. Tuy nhiên, nếu ta tìm các giá trị này trong một công cụ hoặc log khác, ta sẽ chỉ tìm được packet dựa trên sequence number tuyệt đối. Ví dụ: 13245768092588 so với 100.  
   
Các switch `-v`, `-X` và `-e` có thể giúp bạn tăng lượng dữ liệu được capture, trong khi các switch `-c`, `-n`, `-s`, `-S` và `-q` có thể giúp giảm bớt và điều chỉnh lượng dữ liệu được ghi và được hiển thị.

Nhiều tuỳ chọn tiện dụng có thể dùng nhưng không phải lúc nào cũng trực tiếp hữu ích với tất cả mọi người là các switch `-A` và `-l`. A sẽ chỉ hiển thị phần text ASCII sau dòng packet, thay vì cả ASCII lẫn Hex. `L` sẽ bảo tcpdump xuất packet theo một chế độ khác. `L` sẽ dùng line buffer (đệm theo từng dòng) thay vì gom lại rồi đẩy ra theo từng khối (chunk). Nó cho phép ta gửi output trực tiếp sang một công cụ khác như `grep` bằng pipe `|`. 

#### Mẹo và thủ thuật

```shell-session
[!bash!]$sudo tcpdump -Ar telnet.pcap

21:12:43.528695 IP 192.168.0.1.telnet > 192.168.0.2.1550: Flags [P.], seq 157:217, ack 216, win 17376, options [nop,nop,TS val 2467382 ecr 10234022], length 60
E..p;...@..p..............c.......C........
.%.6..(.Last login: Sat Nov 27 20:11:43 on ttyp2 from bam.zing.org

21:12:43.546441 IP 192.168.0.2.1550 > 192.168.0.1.telnet: Flags [.], ack 217, win 32120, options [nop,nop,TS val 10234152 ecr 2467382], length 0
E..4FP@.@.s...................d...}x.......
..)(.%.6
21:12:43.548353 IP 192.168.0.1.telnet > 192.168.0.2.1550: Flags [P.], seq 217:705, ack 216, win 17376, options [nop,nop,TS val 2467382 ecr 10234152], length 488
E...;...@.................d.......C........
.%.6..)(Warning: no Kerberos tickets issued.
OpenBSD 2.6-beta (OOF) #4: Tue Oct 12 20:42:32 CDT 1999

Welcome to OpenBSD: The proactively secure Unix-like operating system.

Please use the sendbug(1) utility to report bugs in the system.
Before reporting a bug, please try to reproduce it with the latest
version of the code.  With bug reports, please try to ensure that
enough information to reproduce the problem is enclosed, and if a
known fix for it exists, include that as well.


21:12:43.566442 IP 192.168.0.2.1550 > 192.168.0.1.telnet: Flags [.], ack 705, win 32120, options [nop,nop,TS val 10234154 ecr 2467382], length 0
E..4FQ@.@.s...................e...}x.0.....
..)*.%.6
```

Để ý rằng giá trị ASCII được hiển thị bên dưới mỗi dòng output là do ta dùng `-A`. Điều này có thể hữu ích khi cần nhanh chóng tìm thứ gì đó mà con người đọc được (human-readable) trong output. 

#### Pipe bản capture sang grep
```shell-session
[!bash!]$ sudo tcpdump -Ar http.cap -l | grep 'mailto:*'

reading from file http.cap, link-type EN10MB (Ethernet), snapshot length 65535
  <a href="mailto:ethereal-web[AT]ethereal.com">ethereal-web[AT]ethereal.com</a>
  <a href="mailto:free-support[AT]thewrittenword.com">free-support[AT]thewrittenword.com</a>
  <a href="mailto:ethereal-users[AT]ethereal.com">ethereal-users[AT]ethereal.com</a>
  <a href="mailto:ethereal-web[AT]ethereal.com">ethereal-web[AT]ethereal.com</a>
```
Dùng `-l` theo cách này cho phép ta xem xét bản capture nhanh chóng và grep tìm các từ khoá hoặc định dạng mà ta nghi là có thể xuất hiện. Trong trường hợp này, ta dùng `-l` để chuyển output sang `grep` và tìm mọi lần xuất hiện của cụm `mailto:*`. Kết quả cho ta thấy mọi dòng có chứa chuỗi tìm kiếm, như ta thấy ở trên. Dùng modifier và chuyển hướng output có thể là cách nhanh để thu thập (scrape) từ website các địa chỉ email, quy ước đặt tên (naming standard) và nhiều thứ khác.

Ta có thể đào sâu tuỳ ý vào các packet đã capture. Tuy nhiên, việc này đòi hỏi một chút kiến thức về cấu trúc của các protocol. Ví dụ, nếu chỉ muốn xem các packet có TCP SYN flag được bật, ta có thể dùng lệnh sau:

#### Tìm các flag của TCP protocol

```shell-session
[!bash!]$ tcpdump -i eth0 'tcp[13] &2 != 0'
```

Lệnh này đếm tới byte thứ 13 trong cấu trúc và xem bit thứ 2. Nếu bit đó được đặt là 1 hay ON, SYN flag đang được bật. 
  
#### Truy tìm SYN flag

```shell-session
[!bash!]$ sudo tcpdump -i eth0 'tcp[13] &2 != 0'

tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
15:18:14.630993 IP 172.16.146.2.56244 > 172.67.1.1.https: Flags [S], seq 122498858, win 64240, options [mss 1460,sackOK,TS val 534699017 ecr 0,nop,wscale 7], length 0
15:18:14.654698 IP 172.67.1.1.https > 172.16.146.2.56244: Flags [S.], seq 3728841459, ack 122498859, win 65535, options [mss 1400,nop,nop,sackOK,nop,wscale 10], length 0
15:18:15.017464 IP 172.16.146.2.60202 > a23-54-168-81.deploy.static.akamaitechnologies.com.https: Flags [S], seq 777468939, win 64240, options [mss 1460,sackOK,TS val 1348555130 ecr 0,nop,wscale 7], length 0
15:18:15.021329 IP 172.16.146.2.49652 > 104.16.88.20.https: Flags [S], seq 1954080833, win 64240, options [mss 1460,sackOK,TS val 274098564 ecr 0,nop,wscale 7], length 0
15:18:15.022640 IP 172.16.146.2.45214 > 104.18.22.52.https: Flags [S], seq 1072203471, win 64240, options [mss 1460,sackOK,TS val 1445124063 ecr 0,nop,wscale 7], length 0
15:18:15.042399 IP 104.18.22.52.https > 172.16.146.2.45214: Flags [S.], seq 215464563, ack 1072203472, win 65535, options [mss 1400,nop,nop,sackOK,nop,wscale 10], length 0
15:18:15.043646 IP a23-54-168-81.deploy.static.akamaitechnologies.com.https > 172.16.146.2.60202: Flags [S.], seq 1390108870, ack 777468940, win 28960, options [mss 1460,sackOK,TS val 3405787409 ecr 1348555130,nop,wscale 7], length 0
15:18:15.044764 IP 104.16.88.20.https > 172.16.146.2.49652: Flags [S.], seq 2086758283, ack 1954080834, win 65535, options [mss 1400,nop,nop,sackOK,nop,wscale 10], length 0
15:18:16.131983 IP 172.16.146.2.45684 > ec2-34-255-145-175.eu-west-1.compute.amazonaws.com.https: Flags [S], seq 4017793011, win 64240, options [mss 1460,sackOK,TS val 933634389 ecr 0,nop,wscale 7], length 0
15:18:16.261855 IP ec2-34-255-145-175.eu-west-1.compute.amazonaws.com.https > 172.16.146.2.45684: Flags [S.], seq 106675091, ack 4017793012, win 26847, options [mss 1460,sackOK,TS val 12653884 ecr 933634389,nop,wscale 8], length 0
```

Từ những gì thấy ở trên, kết quả của ta chỉ gồm các packet có TCP flag `SYN` được bật.

TCPDump có thể là một công cụ mạnh nếu ta hiểu mạng của mình và cách các host tương tác với nhau. Hãy dành thời gian tìm hiểu cấu trúc header điển hình của các protocol để phát hiện điểm bất thường (anomaly) khi cần. Dưới đây là một vài link giúp ta học thêm về các protocol tiêu chuẩn và cấu trúc của chúng. Ngoại trừ link Wikipedia, mỗi link sẽ đưa ta thẳng tới RFC đặt ra tiêu chuẩn cho từng protocol.  

#### Link RFC của các protocol  
| **Link** | **Mô tả** |    
|---  |---  |    
|[IP Protocol](https://tools.ietf.org/html/rfc791)  | `RFC 791` mô tả IP và chức năng của nó.  |  
|[ICMP Protocol](https://tools.ietf.org/html/rfc792)  | `RFC 792` mô tả ICMP và chức năng của nó.  |  
|[TCP Protocol](https://tools.ietf.org/html/rfc793)  | `RFC 793` mô tả TCP protocol và cách nó hoạt động.  |  
|[UDP Protocol](https://tools.ietf.org/html/rfc768)  | `RFC 768` mô tả UDP và cách nó vận hành.  |  
|[RFC Quick Links](https://en.wikipedia.org/wiki/List_of_RFCs#Topical_list)  | Bài viết Wikipedia này chứa một danh sách lớn các protocol gắn với RFC giải thích cách triển khai của chúng.  |
