# Suricata Rule Development Part 1

Về bản chất, một rule trong Suricata đóng vai trò như một chỉ thị, yêu cầu engine chủ động theo dõi những dấu hiệu (marker) nhất định trong lưu lượng mạng (network traffic). Khi những dấu hiệu cụ thể đó xuất hiện, ta sẽ nhận được thông báo.

Rule Suricata không chỉ tập trung vào việc phát hiện các hoạt động độc hại hay traffic có khả năng gây hại. Trong nhiều trường hợp, rule có thể được thiết kế để cung cấp cho người phòng thủ mạng (network defender) hoặc các thành viên blue team những thông tin quan trọng hoặc dữ liệu ngữ cảnh về hoạt động mạng đang diễn ra.

Rule cụ thể hay tổng quát đến mức nào là do ta quyết định. Việc giữ cân bằng là cực kỳ quan trọng, chẳng hạn để nhận diện được các biến thể của một dòng malware nhất định mà vẫn tránh được false positive (cảnh báo nhầm).

Việc phát triển các rule này thường tận dụng những thông tin quan trọng do cộng đồng infosec và threat intelligence cung cấp. Tuy nhiên, cần lưu ý rằng mỗi rule ta triển khai đều tiêu tốn một phần tài nguyên CPU và bộ nhớ của host. Vì vậy, Suricata đưa ra các hướng dẫn cụ thể để viết rule hiệu quả.

## Cấu trúc của một rule Suricata

Dưới đây là một rule Suricata mẫu. Hãy cùng phân tích từng phần của nó.

```shell-session
action protocol from_ip port -> to_ip port (msg:"Known malicious behavior, possible X malware infection"; content:"some thing"; content:"some other thing"; sid:10000001; rev:1;)
```

- **Header** (phần `action protocol from_ip port -> to_ip port`): Phần `header` của rule chứa hành động (action) dự kiến của rule, cùng với giao thức (protocol) mà rule sẽ được áp dụng. Ngoài ra, nó còn gồm địa chỉ IP, thông tin port và một mũi tên chỉ hướng của traffic.
	- `action` cho Suricata biết phải làm gì nếu nội dung khớp. Có thể là tạo alert (`alert`), ghi log traffic mà không tạo alert (`log`), bỏ qua packet (`pass`), drop packet ở chế độ IPS (`drop`), hoặc gửi các packet TCP RST (`reject`).
	- `protocol` có thể khác nhau, gồm `tcp`, `udp`, `icmp`, `ip`, `http`, `tls`, `smb` hoặc `dns`.
	- Hướng của traffic được khai báo bằng `rule host variables` (như `$HOME_NET`, `$EXTERNAL_NET`, v.v. mà ta đã thấy trong `suricata.yaml`) và `rule direction`. Mũi tên chỉ hướng giữa hai cặp IP-Port cho Suricata biết luồng (flow) của traffic.
		- Ví dụ: 
			- Outbound (chiều ra): `$HOME_NET any -> $EXTERNAL_NET 9090`
			- Inbound (chiều vào): `$EXTERNAL_NET any -> $HOME_NET 8443`
			- Bidirectional (hai chiều): `$EXTERNAL_NET any <> $HOME_NET any`
	- `Rule ports` xác định các port mà tại đó traffic sẽ được rule này đánh giá.
		- Ví dụ: 
			- `alert tcp $HOME_NET any -> $EXTERNAL_NET 9443`
			- `alert tcp $HOME_NET any -> $EXTERNAL_NET $UNCOMMON_PORTS`
				- $UNCOMMON_PORTS có thể được định nghĩa trong `suricata.yaml`
			- `alert tcp $HOME_NET any -> $EXTERNAL_NET 
[8443,8080,7001:7002,!8443]`

- **Rule message & content** (phần `(msg:"Known malicious behavior, possible X malware infection"; content:"some thing"; content:"some other thing";`): Phần `rule message & content` chứa thông điệp mà ta muốn hiển thị cho analyst hoặc cho chính mình khi phát hiện một hoạt động mà ta muốn được thông báo. `content` là những đoạn traffic mà ta cho là thiết yếu cho việc phát hiện đó.
	- `Rule message (msg)` là một đoạn văn bản tuỳ ý được hiển thị khi rule được kích hoạt (trigger). Lý tưởng nhất, message của rule ta tạo nên chứa thông tin chi tiết về kiến trúc, họ (family) và hành động của malware.
		-   `flow` xác định bên khởi tạo (originator) và bên phản hồi (responder). Khi viết rule, luôn nhớ cho engine giám sát các phiên tcp ở trạng thái "established".
			- Ví dụ:
				- `alert tcp any any -> 192.168.1.0/24 22 (msg:"SSH connection attempt"; flow:to_server; sid:1001;)`
  				- `alert udp 10.0.0.0/24 any -> any 53 (msg:"DNS query"; flow:from_client; sid:1002;)`
				- `alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"Potential HTTP-based attack"; flow:established,to_server; sid:1003;)`
		- `dsize` so khớp dựa trên kích thước payload của packet. Nó dựa vào độ dài TCP segment, không phải tổng độ dài của packet.
			- Ví dụ: `alert http any any -> any any (msg:"Large HTTP response"; dsize:>10000; content:"HTTP/1.1 200 OK"; sid:2003;)`
	- `Rule content` gồm các giá trị đặc trưng (unique) giúp nhận diện traffic hoặc hoạt động mạng cụ thể. Suricata so khớp các giá trị content đặc trưng này trong packet để phát hiện.
		- Ví dụ: `content:"User-Agent|3a 20|Go-http-client/1.1|0d 0a|Accept-Encoding|3a 20|gzip";`
			- `|3a 20|`: Đây là dạng biểu diễn hexadecimal của ký tự ":", theo sau là một ký tự khoảng trắng. Nó được dùng để so khớp chính xác chuỗi byte trong payload của packet.
			- `|0d 0a|`: Đây là dạng biểu diễn hexadecimal của các ký tự "\r\n", biểu thị kết thúc một dòng trong HTTP header.
		-  Nhờ dùng `Rule Buffers`, ta không phải tìm trong toàn bộ packet cho mỗi lần so khớp content. Điều này giúp tiết kiệm thời gian và tài nguyên. Xem thêm chi tiết tại đây: [https://suricata.readthedocs.io/en/latest/rules/http-keywords.html](https://suricata.readthedocs.io/en/latest/rules/http-keywords.html)
			- Ví dụ: `alert http any any -> any any (http.accept; content:"image/gif"; sid:1;)`
				- `http.accept`: Sticky buffer dùng để so khớp trên header HTTP Accept. Chỉ chứa giá trị của header. Các ký tự `\r\n` sau header không thuộc buffer.
		-  `Rule options` đóng vai trò như các bộ bổ trợ (modifier) bổ sung để hỗ trợ phát hiện, giúp Suricata xác định đúng vị trí của content.
			- `nocase` đảm bảo rule không bị vượt qua (bypass) bằng cách thay đổi chữ hoa/chữ thường.
				- Ví dụ: `alert tcp any any -> any any (msg:"Detect HTTP traffic with user agent Mozilla"; content:"User-Agent: Mozilla"; nocase; sid:8001;)`
			- `offset` cho Suricata biết vị trí bắt đầu so khớp bên trong packet.
				- Ví dụ: `alert tcp any any -> any any (msg:"Detect specific protocol command"; content:"|01 02 03|"; offset:0; depth:5; sid:3003;)`
					-  Rule này tạo alert khi Suricata phát hiện một lệnh giao thức cụ thể được biểu diễn bằng chuỗi byte `|01 02 03|` trong TCP payload. Keyword `offset:0` đặt điểm bắt đầu so khớp content tại đầu payload, còn `depth:5` chỉ định độ dài năm byte được xét để so khớp.
			- `distance` chỉ định vị trí Suricata bắt đầu tìm pattern `content` tiếp theo, tính từ điểm kết thúc của lần khớp `content` trước đó. Nó chỉ áp dụng khi có nhiều keyword `content` được khai báo trong cùng một rule; nếu chỉ có một câu lệnh `content` thì nó không có tác dụng. Trong hầu hết trường hợp, nó được dùng kèm keyword `within` để tạo một cửa sổ tìm kiếm có giới hạn.
				- Ví dụ: `alert http any any -> any any (msg:"Detect suspicious URL path after HTTP method"; content:"GET"; offset:0; depth:4; content:"/admin"; distance:10; within:80; sid:3001;)`
					- Rule này yêu cầu Suricata trước tiên so khớp chuỗi "GET" trong bốn byte đầu tiên của payload HTTP request (`offset:0; depth:4`). Khi đã khớp, `distance:10` buộc phải cách tối thiểu 10 byte rồi mới tìm content tiếp theo. Từ điểm neo (anchor) đó, `within:80` giới hạn việc tìm kiếm trong 80 byte kế tiếp. Do đó, chuỗi "/admin" phải bắt đầu cách điểm kết thúc của "GET" ít nhất 10 byte và không muộn hơn 80 byte tính từ đó. Nếu `/admin` xuất hiện gần hơn 10 byte hoặc xa hơn 80 byte so với lần khớp trước, rule sẽ không được kích hoạt.
					
- **Rule metadata** (phần `sid:10000001; rev:1;`):
	- `reference` cho ta một manh mối, một dấu vết dẫn ngược về nguồn thông tin gốc đã khơi gợi việc tạo ra rule.
	- `sid` (signature ID). Tính duy nhất của định danh dạng số này khiến nó trở nên thiết yếu để người viết rule quản lý và phân biệt các rule với nhau.
	- `revision` cho biết phiên bản của rule. Nó là chỉ dấu về quá trình phát triển của rule theo thời gian, làm nổi bật các thay đổi và cải tiến đã thực hiện.

Sau khi đã bàn về phần cốt lõi của rule Suricata, giờ là lúc làm rõ một công cụ mạnh mẽ trong phát triển rule: `PCRE` hay `Perl Compatible Regular Expression`. Sử dụng PCRE có thể tạo ra khác biệt lớn khi viết rule. Để dùng PCRE, ta dùng câu lệnh `pcre`, theo sau là một biểu thức chính quy (regular expression). Lưu ý rằng PCRE phải được bao bởi dấu gạch chéo (forward slash) ở đầu và ở cuối, các flag (nếu có) đặt sau dấu gạch chéo cuối cùng.

Ngoài ra, lưu ý rằng các anchor được đặt sau và trước các dấu gạch chéo bao quanh, và một số ký tự cần được escape bằng dấu gạch ngược (backslash). Một lời khuyên từ kinh nghiệm thực chiến - tránh viết rule chỉ dựa duy nhất vào PCRE.
- Ví dụ: `alert http any any -> $HOME_NET any (msg: "ATTACK [PTsecurity] Apache Continuum <= v1.4.2 CMD Injection"; content: "POST"; http_method; content: "/continuum/saveInstallation.action"; offset: 0; depth: 34; http_uri; content: "installation.varValue="; nocase; http_client_body; pcre: !"/^\$?[\sa-z\\_0-9.-]*(\&|$)/iRP"; flow: to_server, established;sid: 10000048; rev: 1;)`
	- Đầu tiên, rule kích hoạt trên traffic HTTP (`alert http`) từ bất kỳ nguồn và đích nào tới bất kỳ port nào trên mạng nội bộ (home network) (`any any -> $HOME_NET any`).
	- Field msg đưa ra mô tả dễ đọc về mục đích của alert, cụ thể là `ATTACK [PTsecurity] Apache Continuum <= v1.4.2 CMD Injection`.
	- Tiếp theo, rule kiểm tra chuỗi `POST` trong HTTP method bằng các keyword `content` và `http_method`. Rule sẽ khớp nếu HTTP method được dùng là một POST request.
	- Sau đó, keyword `content` được dùng cùng `http_uri` để so khớp URI `/continuum/saveInstallation.action`, bắt đầu tại `offset 0` và kéo dài tới `depth` `34` byte. Điều này chỉ định endpoint bị nhắm tới, trong trường hợp này là action `saveInstallation` của ứng dụng Apache Continuum.
	- Tiếp đó, một keyword content khác tìm `installation.varValue=` trong HTTP client body, không phân biệt hoa thường (`nocase`). Chuỗi này có thể là một phần của payload command injection mà kẻ tấn công đang cố gửi tới.
	- Tiếp theo, ta thấy keyword `pcre`, được dùng để áp dụng Perl Compatible Regular Expressions.
		- `!` ở đầu biểu thị rằng rule sẽ kích hoạt khi việc so khớp không xảy ra.
		- `^` đánh dấu đầu dòng.
		- `\$?` kiểm tra một dấu đô la tuỳ chọn (có thể có hoặc không) ở đầu.
		- `[\sa-z\\_0-9.-]*` khớp với không hoặc nhiều (`*`) ký tự thuộc tập hợp. Tập hợp gồm:
			- `\s` một khoảng trắng
			- `a-z` bất kỳ chữ cái thường nào
			- `\\` một dấu gạch ngược
			- `_` một dấu gạch dưới
			- `0-9` bất kỳ chữ số nào
			- `.` một dấu chấm
			- `-` một dấu gạch nối
			- `(\&|$)` kiểm tra hoặc dấu & (ampersand) hoặc cuối dòng.
			- `/iRP` ở cuối cho biết đây là phép so khớp đảo ngược (inverted match), không phân biệt hoa thường (`i`), và tương đối so với vị trí trong buffer (`RP`).
	- Cuối cùng, keyword `flow` được dùng để chỉ định rằng rule kích hoạt trên traffic inbound đi tới server ở trạng thái `established`.

Với những ai muốn mở rộng hiểu biết về rule Suricata và đi sâu hơn vào việc phát triển rule, tài liệu sau là một hướng dẫn toàn diện: [https://docs.suricata.io/en/latest/rules/index.html](https://docs.suricata.io/en/latest/rules/index.html).

<div class="card bg-light">
    <div class="card-body">
	  <p class="mb-0">Tại thời điểm viết bài, phiên bản Suricata được cài trong môi trường là 4.0.0. Khi có các phiên bản mới hơn ra đời, một số keyword có thể đã thay đổi; hãy luôn tham khảo tài liệu chính thức của phiên bản đang cài khi phát triển rule.</p>
    </div>
</div>

## Các cách tiếp cận phát triển rule IDS/IPS

Khi nói đến việc tạo rule cho Intrusion Detection System (IDS – hệ thống phát hiện xâm nhập) và Intrusion Prevention System (IPS – hệ thống ngăn chặn xâm nhập), đằng sau đó vừa là nghệ thuật vừa là khoa học. Việc này đòi hỏi hiểu biết toàn diện về các giao thức mạng, hành vi của malware, lỗ hổng hệ thống và bức tranh mối đe doạ (threat landscape) nói chung.

Một chiến lược then chốt mà ta áp dụng khi viết các rule này là phát hiện những thành phần cụ thể trong network traffic chỉ có ở malware. Cách này thường được gọi là signature-based detection (phát hiện dựa trên chữ ký), và là cách tiếp cận kinh điển mà hầu hết IDS/IPS dựa vào. Signature có thể là những pattern đơn giản trong payload của packet, chẳng hạn như phát hiện một lệnh cụ thể hoặc một chuỗi đặc trưng gắn với một malware cụ thể, cho đến những pattern phức tạp khớp với một chuỗi packet hoặc các đặc điểm của packet. Signature-based detection rất hiệu quả khi xử lý các mối đe doạ đã biết vì nó có thể nhận diện chúng với độ chính xác cao; tuy nhiên, nó gặp khó khăn trong việc phát hiện các mối đe doạ mới chưa có signature.

Một cách tiếp cận khác tập trung vào việc nhận diện các hành vi cụ thể đặc trưng cho malware. Cách này thường được gọi là anomaly-based detection (phát hiện dựa trên bất thường) hoặc behavior-based detection (phát hiện dựa trên hành vi). Ví dụ, một kích thước HTTP response nhất định liên tục xuất hiện trong một ngưỡng, hoặc một khoảng thời gian beaconing cụ thể, có thể là dấu hiệu của một kiểu giao tiếp của malware. Các hành vi khác có thể gồm khối lượng truyền dữ liệu cao bất thường và việc sử dụng các port không phổ biến. Ưu điểm của cách tiếp cận này là khả năng nhận diện các cuộc tấn công zero-day hoặc các mối đe doạ mới mà hệ thống signature-based không phát hiện được. Tuy nhiên, nó cũng thường có tỷ lệ false positive cao hơn do bản chất luôn biến động của hành vi mạng.

Cách tiếp cận thứ ba mà ta dùng khi viết rule IDS/IPS là stateful protocol analysis (phân tích giao thức có trạng thái). Kỹ thuật này đòi hỏi hiểu và theo dõi trạng thái của các giao thức mạng, rồi so sánh hành vi quan sát được với các chuyển đổi trạng thái (state transition) kỳ vọng của các giao thức đó. Bằng cách theo dõi trạng thái của từng kết nối, ta có thể nhận ra những sai lệch so với hành vi kỳ vọng, có thể là dấu hiệu của hoạt động độc hại.

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Giờ hãy kéo xuống cuối section này và bấm vào "<code>Click here to spawn the target system!</code>". Sau đó, SSH (hoặc RDP) vào Target IP bằng thông tin đăng nhập được cung cấp. Phần lớn các lệnh được đề cập từ đây đến cuối section này đều có thể thực hiện lại bên trong target, giúp nắm các chủ đề được trình bày một cách toàn diện hơn. </p>
    </div>
</div>

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Vui lòng đợi khoảng 5-6 phút trước khi bắt đầu kết nối bằng Remote Desktop Protocol (RDP). Có thể bạn phải thử 2-3 lần mới kết nối RDP thành công! </p>
    </div>
</div>

```shell-session
[!bash!]$ xfreerdp /u:htb-student /p:'HTB_@cademy_stdnt!' /v:[Target IP] /dynamic-resolution /relax-order-checks +glyph-cache
```

Bây giờ, ta sẽ xem qua một số ví dụ về phát triển rule Suricata để hiểu vững các cách tiếp cận khác nhau mà ta có thể áp dụng cũng như cấu trúc của một rule.

## Ví dụ phát triển rule Suricata 1: Phát hiện PowerShell Empire

```shell-session
alert http $HOME_NET any -> $EXTERNAL_NET any (msg:"ET MALWARE Possible PowerShell Empire Activity Outbound"; flow:established,to_server; content:"GET"; http_method; content:"/"; http_uri; depth:1; pcre:"/^(?:login\/process|admin\/get|news)\.php$/RU"; content:"session="; http_cookie; pcre:"/^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=|[A-Z0-9+/]{4})$/CRi"; content:"Mozilla|2f|5.0|20 28|Windows|20|NT|20|6.1"; http_user_agent; http_start; content:".php|20|HTTP|2f|1.1|0d 0a|Cookie|3a 20|session="; fast_pattern; http_header_names; content:!"Referer"; content:!"Cache"; content:!"Accept"; sid:2027512; rev:1;)
```

Rule Suricata ở trên được thiết kế để phát hiện hoạt động outbound có thể đến từ [PowerShell Empire](https://github.com/EmpireProject/Empire), một framework post-exploitation phổ biến được kẻ tấn công sử dụng. Hãy phân tích các phần quan trọng của rule này để hiểu cách nó hoạt động.
- `alert`: Đây là action của rule, cho biết Suricata sẽ tạo alert bất cứ khi nào các điều kiện được chỉ định trong rule options được thoả mãn.
- `http`: Đây là protocol của rule. Nó chỉ định rằng rule áp dụng cho traffic HTTP.
- `$HOME_NET any -> $EXTERNAL_NET any`: Đây là phần chỉ định địa chỉ IP nguồn và đích. Rule sẽ được kích hoạt khi traffic HTTP xuất phát từ bất kỳ port nào (any) trên một host thuộc `$HOME_NET` (mạng nội bộ) và đi tới bất kỳ port nào (any) trên một host thuộc `$EXTERNAL_NET` (mạng bên ngoài).
- `msg:"ET MALWARE Possible PowerShell Empire Activity Outbound"`: Đây là message sẽ được đưa vào alert để mô tả rule đang tìm gì.
- `flow:established,to_server`: Phần này chỉ định hướng của traffic. Rule tìm các kết nối đã thiết lập (established) có dữ liệu đi tới server.
- `content:"GET"; http_method;`: Phần này khớp với method HTTP GET trong HTTP request.
- `content:"/"; http_uri; depth:1;`: Phần này khớp với thư mục gốc ("/") trong URI.
- `pcre:"/^(?:login\/process|admin\/get|news)\.php$/RU";`: Biểu thức Perl Compatible Regular Expression (PCRE) này tìm các URI kết thúc bằng login/process.php, admin/get.php hoặc news.php.
	- `PowerShell Empire` là một framework Command and Control (C2) mã nguồn mở. Có thể tìm hiểu agent của nó qua repository sau.[https://github.com/EmpireProject/Empire/blob/master/data/agent/agent.ps1#L78](https://github.com/EmpireProject/Empire/blob/master/data/agent/agent.ps1#L78)
	- Dùng Wireshark kiểm tra file `psempire.pcap` nằm trong thư mục `/home/htb-student/pcaps` trên target của section này để xác định chính xác các request liên quan.
- `content:"session="; http_cookie;`: Phần này tìm chuỗi "session=" trong HTTP cookie.
- `pcre:"/^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=|[A-Z0-9+/]{4})$/CRi";`: PCRE này kiểm tra dữ liệu được mã hoá base64 trong Cookie.
	- Có rất nhiều bài viết phân tích `PowerShell Empire`, đây là một bài chỉ ra rằng các cookie mà PowerShell Empire sử dụng tuân theo chuẩn mã hoá Base64. [https://www.keysight.com/blogs/tech/nwvs/2021/06/16/empire-c2-networking-into-the-dark-side](https://www.keysight.com/blogs/tech/nwvs/2021/06/16/empire-c2-networking-into-the-dark-side)
- `content:"Mozilla|2f|5.0|20 28|Windows|20|NT|20|6.1"; http_user_agent; http_start;`: Phần này khớp với một chuỗi User-Agent cụ thể có chứa "Mozilla/5.0 (Windows NT 6.1".
	-  [https://github.com/EmpireProject/Empire/blob/master/data/agent/agent.ps1#L78](https://github.com/EmpireProject/Empire/blob/master/data/agent/agent.ps1#L78)
- `content:".php|20|HTTP|2f|1.1|0d 0a|Cookie|3a 20|session="; fast_pattern; http_header_names;`: Phần này khớp với một pattern trong HTTP header bắt đầu bằng ".php HTTP/1.1\r\nCookie: session=".
- `content:!"Referer"; content:!"Cache"; content:!"Accept";`: Đây là các phép so khớp content phủ định (negative). Rule chỉ kích hoạt nếu HTTP header không chứa "Referer", "Cache" và "Accept".

Rule Suricata này tạo alert khi phát hiện một HTTP GET request trên kết nối đã thiết lập (established) đi từ mạng của ta tới mạng bên ngoài, có pattern cụ thể trong các field URI, cookie và user-agent, đồng thời loại trừ một số header nhất định.

Rule trên đã có sẵn trong file `local.rules` nằm ở thư mục `/home/htb-student` trên target của section này. Để kiểm thử, trước tiên bạn cần bỏ comment (uncomment) rule. Sau đó, chạy Suricata trên file `psempire.pcap` nằm trong thư mục `/home/htb-student/pcaps`.

```shell-session
[!bash!]$ sudo suricata -r /home/htb-student/pcaps/psempire.pcap -l . -k none
 15/7/2023 -- 03:57:42 - <Notice> - This is Suricata version 4.0.0-beta1 RELEASE
15/7/2023 -- 03:57:42 - <Notice> - all 5 packet processing threads, 4 management threads initialized, engine started.
15/7/2023 -- 03:57:42 - <Notice> - Signal Received.  Stopping engine.
15/7/2023 -- 03:57:42 - <Notice> - Pcap-file module read 511 packets, 101523 bytes
```

```shell-session
[!bash!]$ cat fast.log
11/21/2017-05:04:53.950737  [**] [1:2027512:1] ET MALWARE Possible PowerShell Empire Activity Outbound [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.56.14:50447 -> 51.15.197.127:80
11/21/2017-05:04:01.308390  [**] [1:2027512:1] ET MALWARE Possible PowerShell Empire Activity Outbound [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.56.14:50436 -> 51.15.197.127:80
11/21/2017-05:05:20.249515  [**] [1:2027512:1] ET MALWARE Possible PowerShell Empire Activity Outbound [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.56.14:50452 -> 51.15.197.127:80
11/21/2017-05:05:56.849190  [**] [1:2027512:1] ET MALWARE Possible PowerShell Empire Activity Outbound [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.56.14:50459 -> 51.15.197.127:80
11/21/2017-05:06:02.062235  [**] [1:2027512:1] ET MALWARE Possible PowerShell Empire Activity Outbound [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.56.14:50460 -> 51.15.197.127:80
11/21/2017-05:06:17.750895  [**] [1:2027512:1] ET MALWARE Possible PowerShell Empire Activity Outbound [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.56.14:50463 -> 51.15.197.127:80
11/21/2017-05:04:11.988856  [**] [1:2027512:1] ET MALWARE Possible PowerShell Empire Activity Outbound [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.56.14:50439 -> 51.15.197.127:80
---SNIP---
```

File `local.rules` còn chứa một rule khác để phát hiện `PowerShell Empire`, nằm ngay bên dưới rule ta vừa xem xét. Hãy dành chút thời gian xem kỹ cả file `psempire.pcap` bằng `Wireshark` lẫn rule mới này để hiểu cách nó hoạt động. 

## Ví dụ phát triển rule Suricata 2: Phát hiện Covenant

```shell-session
alert tcp any any -> $HOME_NET any (msg:"detected by body"; content:"<title>Hello World!</title>"; detection_filter: track by_src, count 4 , seconds 10; priority:1; sid:3000011;)
```

**Nguồn rule**: [Signature-based IDS for Encrypted C2
Traffic Detection - Eduardo Macedo](https://repositorio-aberto.up.pt/bitstream/10216/142718/2/572020.pdf)

Rule Suricata (kém hiệu quả) ở trên được thiết kế để phát hiện một số biến thể của [Covenant](https://github.com/cobbr/Covenant), một framework post-exploitation phổ biến khác được kẻ tấn công sử dụng. Hãy phân tích các phần quan trọng của rule này để hiểu cách nó hoạt động.
- `alert`: Đây là action của rule. Khi các điều kiện trong rule options được thoả mãn, Suricata sẽ tạo alert.
- `tcp`: Đây là protocol của rule. Rule áp dụng cho traffic TCP.
- `any any -> $HOME_NET any`: Đây là phần chỉ định địa chỉ IP và port nguồn, đích. Rule theo dõi traffic TCP xuất phát từ bất kỳ IP và bất kỳ port nào (`any any`) và đi tới bất kỳ port nào (`any`) trên một host thuộc `$HOME_NET` (mạng nội bộ).
- `content:"<title>Hello World!</title>";`: Phần này yêu cầu Suricata tìm chuỗi `<title>Hello World!</title>` trong TCP payload.
	- `Covenant` là một framework Command and Control (C2) mã nguồn mở. Có thể tìm hiểu nền tảng bên dưới của nó qua repository sau.[https://github.com/cobbr/Covenant/blob/master/Covenant/Data/Profiles/DefaultHttpProfile.yaml#L35](https://github.com/cobbr/Covenant/blob/master/Covenant/Data/Profiles/DefaultHttpProfile.yaml#L35)
	- Dùng Wireshark kiểm tra file `covenant.pcap` nằm trong thư mục `/home/htb-student/pcaps` trên target của section này để xác định chính xác các request liên quan.
- `detection_filter: track by_src, count 4, seconds 10;`: Đây là một bộ lọc sau phát hiện (post-detection filter). Nó chỉ định rằng rule sẽ theo dõi địa chỉ IP nguồn (`by_src`) và chỉ tạo alert nếu cùng một phát hiện này xảy ra ít nhất 4 lần (`count 4`) trong khung thời gian 10 giây (`seconds 10`).
	- Dùng Wireshark kiểm tra file `covenant.pcap` nằm trong thư mục `/home/htb-student/pcaps` trên target của section này để xác định chính xác các request liên quan.
	
Rule Suricata này được thiết kế để tạo alert có độ ưu tiên cao nếu phát hiện ít nhất bốn lần traffic TCP trong vòng mười giây có chứa chuỗi `<title>Hello World!</title>` trong payload, xuất phát từ cùng một IP nguồn và đi tới bất kỳ host nào trong mạng nội bộ của ta.
	
Rule trên đã có sẵn trong file `local.rules` nằm ở thư mục `/home/htb-student` trên target của section này. Để kiểm thử, trước tiên bạn cần bỏ comment (uncomment) rule. Sau đó, chạy Suricata trên file `covenant.pcap` nằm trong thư mục `/home/htb-student/pcaps`. 

```shell-session
[!bash!]$ sudo suricata -r /home/htb-student/pcaps/covenant.pcap -l . -k none
15/7/2023 -- 04:47:15 - <Notice> - This is Suricata version 4.0.0-beta1 RELEASE
15/7/2023 -- 04:47:15 - <Notice> - all 5 packet processing threads, 4 management threads initialized, engine started.
15/7/2023 -- 04:47:16 - <Notice> - Signal Received.  Stopping engine.
15/7/2023 -- 04:47:16 - <Notice> - Pcap-file module read 27384 packets, 3125549 bytes
```

```shell-session
[!bash!]$ cat fast.log
01/21/2021-06:38:51.250048  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50366
01/21/2021-06:40:55.021993  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50375
01/21/2021-06:36:21.280144  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50358
01/21/2021-06:41:53.395248  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50378
01/21/2021-06:42:21.582624  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50379
01/21/2021-06:41:25.215525  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50377
01/21/2021-07:17:01.778365  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50462
01/21/2021-07:12:55.294094  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50454
01/21/2021-07:14:27.846352  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50457
01/21/2021-07:17:29.981168  [**] [1:3000011:0] detected by body [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:50463
---SNIP---
```

File `local.rules` còn chứa ba (3) rule khác để phát hiện `Covenant`, nằm ngay bên dưới rule ta vừa xem xét. Hãy dành chút thời gian xem kỹ [https://github.com/cobbr/Covenant/blob/master/Covenant/Data/Profiles/DefaultHttpProfile.yaml](https://github.com/cobbr/Covenant/blob/master/Covenant/Data/Profiles/DefaultHttpProfile.yaml), file `covenant.pcap` bằng `Wireshark`, và các rule mới này để hiểu cách chúng hoạt động. Các rule này có thể cho ra kết quả false positive, vì vậy để đạt hiệu quả tối ưu, nên kết hợp chúng với các rule phát hiện khác.

## Ví dụ phát triển rule Suricata 3: Phát hiện Covenant (dùng analytics)

```shell-session
alert tcp $HOME_NET any -> any any (msg:"detected by size and counter"; dsize:312; detection_filter: track by_src, count 3 , seconds 10; priority:1; sid:3000001;)
```

File `local.rules` cũng chứa rule trên để phát hiện `Covenant`. Hãy phân tích các phần quan trọng của rule này để hiểu cách nó hoạt động.
- `dsize:312;`: Phần này yêu cầu Suricata tìm traffic TCP có kích thước payload dữ liệu đúng bằng 312 byte.
- `detection_filter: track by_src, count 3 , seconds 10;`: Đây là một post-detection filter. Nó cho biết rule sẽ theo dõi địa chỉ IP nguồn (`by_src`), và chỉ tạo alert nếu phát hiện cùng một rule hit (lần khớp rule) ít nhất 3 lần (`count 3`) trong khung thời gian 10 giây (`seconds 10`).

Rule Suricata này được thiết kế để tạo alert có độ ưu tiên cao nếu phát hiện ít nhất ba lần traffic TCP trong vòng mười giây, mỗi lần có payload dữ liệu đúng 312 byte, tất cả xuất phát từ cùng một IP nguồn trong mạng của ta và đi tới bất kỳ đâu.

Rule trên đã có sẵn trong file `local.rules` nằm ở thư mục `/home/htb-student` trên target của section này. Để kiểm thử, trước tiên bạn cần bỏ comment (uncomment) rule. Sau đó, chạy Suricata trên file `covenant.pcap` nằm trong thư mục `/home/htb-student/pcaps`. 

```shell-session
[!bash!]$ sudo suricata -r /home/htb-student/pcaps/covenant.pcap -l . -k none
15/7/2023 -- 05:29:19 - <Notice> - This is Suricata version 4.0.0-beta1 RELEASE
15/7/2023 -- 05:29:19 - <Notice> - all 5 packet processing threads, 4 management threads initialized, engine started.
15/7/2023 -- 05:29:20 - <Notice> - Signal Received.  Stopping engine.
15/7/2023 -- 05:29:20 - <Notice> - Pcap-file module read 27384 packets, 3125549 bytes
```

```shell-session
[!bash!]$ cat fast.log
01/21/2021-06:45:21.609212  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50386
01/21/2021-06:48:49.965761  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50395
01/21/2021-06:42:49.682887  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50380
01/21/2021-06:49:20.143398  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50396
01/21/2021-06:50:49.706170  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50400
01/21/2021-06:51:21.905950  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50401
01/21/2021-06:50:18.527587  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50399
01/21/2021-06:52:52.484676  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50406
01/21/2021-06:51:51.090923  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50404
01/21/2021-06:55:56.650678  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50413
01/21/2021-06:53:22.680676  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50407
01/21/2021-06:54:25.067327  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50409
01/21/2021-06:54:55.275951  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50410
01/21/2021-06:57:25.201284  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50416
01/21/2021-06:57:53.387489  [**] [1:3000001:0] detected by size and counter [**] [Classification: (null)] [Priority: 1] {TCP} 157.230.93.100:80 -> 10.0.0.61:
50417
---SNIP---
```

Hãy dành chút thời gian xem kỹ cả file `covenant.pcap` bằng `Wireshark` lẫn rule mới này để hiểu cách nó hoạt động.

## Ví dụ phát triển rule Suricata 4: Phát hiện Sliver

```shell-session
alert tcp any any -> any any (msg:"Sliver C2 Implant Detected"; content:"POST"; pcre:"/\/(php|api|upload|actions|rest|v1|oauth2callback|authenticate|oauth2|oauth|auth|database|db|namespaces)(.*?)((login|signin|api|samples|rpc|index|admin|register|sign-up)\.php)\?[a-z_]{1,2}=[a-z0-9]{1,10}/i"; sid:1000007; rev:1;)
```

**Nguồn rule**: [https://www.bilibili.com/read/cv19510951/](https://www.bilibili.com/read/cv19510951/)

Rule Suricata ở trên được thiết kế để phát hiện một số biến thể của [Sliver](https://github.com/BishopFox/sliver), thêm một framework post-exploitation phổ biến khác được kẻ tấn công sử dụng. Hãy phân tích các phần quan trọng của rule này để hiểu cách nó hoạt động.
- `content:"POST";`: Option này yêu cầu Suricata tìm traffic TCP có chứa chuỗi "POST". 
- `pcre:"/\/(php|api|upload|actions|rest|v1|oauth2callback|authenticate|oauth2|oauth|auth|database|db|namespaces)(.*?)((login|signin|api|samples|rpc|index|admin|register|sign-up)\.php)\?[a-z_]{1,2}=[a-z0-9]{1,10}/i";`: Biểu thức chính quy này được dùng để nhận diện các pattern URI cụ thể trong traffic. Nó sẽ khớp với các URI chứa những tên thư mục nhất định, theo sau là tên file có phần mở rộng PHP.
	- `Sliver` là một framework Command and Control (C2) mã nguồn mở. Có thể tìm hiểu nền tảng bên dưới của nó qua repository sau.[https://github.com/BishopFox/sliver/blob/master/server/configs/http-c2.go#L294](https://github.com/BishopFox/sliver/blob/master/server/configs/http-c2.go#L294)
	- Dùng Wireshark kiểm tra file `sliver.pcap` nằm trong thư mục `/home/htb-student/pcaps` trên target của section này để xác định chính xác các request liên quan.

Rule trên đã có sẵn trong file `local.rules` nằm ở thư mục `/home/htb-student` trên target của section này. Để kiểm thử, trước tiên bạn cần bỏ comment (uncomment) rule. Sau đó, chạy Suricata trên file `sliver.pcap` nằm trong thư mục `/home/htb-student/pcaps`.

```shell-session
[!bash!]$ sudo suricata -r /home/htb-student/pcaps/sliver.pcap -l . -k none
16/7/2023 -- 02:27:50 - <Notice> - This is Suricata version 4.0.0-beta1 RELEASE
16/7/2023 -- 02:27:50 - <Notice> - all 5 packet processing threads, 4 management threads initialized, engine started.
16/7/2023 -- 02:27:50 - <Notice> - Signal Received.  Stopping engine.
16/7/2023 -- 02:27:50 - <Notice> - Pcap-file module read 36 packets, 18851 bytes
```

```shell-session
[!bash!]$ cat fast.log
01/23/2023-15:14:46.988537  [**] [1:1000002:1] Sliver C2 Implant Detected - POST [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.4.90:50681 -> 192.168.4.85:80
01/23/2023-15:14:47.321224  [**] [1:1000002:1] Sliver C2 Implant Detected - POST [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.4.90:50684 -> 192.168.4.85:80
01/23/2023-15:14:48.074797  [**] [1:1000002:1] Sliver C2 Implant Detected - POST [**] [Classification: (null)] [Priority: 3] {TCP} 192.168.4.90:50687 -> 192.168.4.85:80
```

File `local.rules` còn chứa một rule khác để phát hiện `Sliver`, nằm ngay bên dưới rule ta vừa xem xét.

```shell-session
alert tcp any any -> any any (msg:"Sliver C2 Implant Detected - Cookie"; content:"Set-Cookie"; pcre:"/(PHPSESSID|SID|SSID|APISID|csrf-state|AWSALBCORS)\=[a-z0-9]{32}\;/"; sid:1000003; rev:1;)
```

Hãy phân tích các phần quan trọng của rule này để hiểu cách nó hoạt động.
- `content:"Set-Cookie";`: Option này yêu cầu Suricata tìm traffic TCP có chứa chuỗi `Set-Cookie`.
- `pcre:"/(PHPSESSID|SID|SSID|APISID|csrf-state|AWSALBCORS)\=[a-z0-9]{32}\;/";`: Đây là biểu thức chính quy dùng để nhận diện các pattern thiết lập cookie cụ thể trong traffic. Nó khớp với header `Set-Cookie` khi header này thiết lập các tên cookie cụ thể (PHPSESSID, SID, SSID, APISID, csrf-state, AWSALBCORS) với giá trị là một chuỗi chữ-số (alphanumeric) dài 32 ký tự.

Hãy dành chút thời gian xem kỹ file `sliver.pcap` bằng `Wireshark` để xác định các request liên quan.
