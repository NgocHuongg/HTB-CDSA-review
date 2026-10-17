# Suricata Rule Development Part 2 (Encrypted Traffic)

Trong bối cảnh an ninh mạng không ngừng thay đổi, ta thường phải đối mặt với một thách thức lớn: traffic được mã hoá (encrypted traffic). Traffic mã hoá có thể gây ra những trở ngại đáng kể cho việc phân tích traffic hiệu quả và phát triển các rule Intrusion Detection System (IDS) và Intrusion Prevention System (IPS) đáng tin cậy.

Dù vậy, vẫn còn một số khía cạnh mà ta có thể tận dụng để phát hiện các mối đe doạ bảo mật tiềm ẩn. Cụ thể, ta có thể chú ý đến các thành phần bên trong certificate SSL/TLS và JA3 fingerprint.

Certificate SSL/TLS, được trao đổi trong quá trình handshake ban đầu của một kết nối SSL/TLS, chứa rất nhiều thông tin không bị mã hoá. Những thông tin này có thể gồm bên phát hành (issuer), ngày phát hành, ngày hết hạn và subject (chứa thông tin certificate được cấp cho ai và tên miền). Các tên miền đáng ngờ hoặc độc hại có thể dùng certificate SSL/TLS có những đặc điểm bất thường hoặc khác biệt. Nhận ra những bất thường này trong certificate SSL/TLS có thể là bước đệm để viết các rule Suricata hiệu quả.

Hơn nữa, ta cũng có thể tận dụng hash [JA3](https://github.com/salesforce/ja3) — một phương pháp lấy dấu (fingerprinting) cung cấp một dạng biểu diễn riêng cho từng SSL/TLS client. Hash JA3 kết hợp các thông tin từ packet client hello trong quá trình SSL/TLS handshake, tạo ra một digest có thể là duy nhất đối với những họ malware cụ thể hoặc phần mềm đáng ngờ. Một lần nữa, các hash này có thể là công cụ mạnh mẽ để xây dựng rule phát hiện cho traffic mã hoá.

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Giờ hãy kéo xuống cuối section này và bấm vào "Click here to spawn the target system!". Sau đó, SSH vào Target IP bằng thông tin đăng nhập được cung cấp. Phần lớn các lệnh được đề cập từ đây đến cuối section này đều có thể thực hiện lại bên trong target, giúp nắm các chủ đề được trình bày một cách toàn diện hơn. </p>
    </div>
</div>

## Ví dụ phát triển rule Suricata 5: Phát hiện Dridex (mã hoá TLS)

```shell-session
alert tls $EXTERNAL_NET any -> $HOME_NET any (msg:"ET MALWARE ABUSE.CH SSL Blacklist Malicious SSL certificate detected (Dridex)"; flow:established,from_server; content:"|16|"; content:"|0b|"; within:8; byte_test:3,<,1200,0,relative; content:"|03 02 01 02 02 09 00|"; fast_pattern; content:"|30 09 06 03 55 04 06 13 02|"; distance:0; pcre:"/^[A-Z]{2}/R"; content:"|55 04 07|"; distance:0; content:"|55 04 0a|"; distance:0; pcre:"/^.{2}[A-Z][a-z]{3,}\s(?:[A-Z][a-z]{3,}\s)?(?:[A-Z](?:[A-Za-z]{0,4}?[A-Z]|(?:\.[A-Za-z]){1,3})|[A-Z]?[a-z]+|[a-z](?:\.[A-Za-z]){1,3})\.?[01]/Rs"; content:"|55 04 03|"; distance:0; byte_test:1,>,13,1,relative; content:!"www."; distance:2; within:4; pcre:"/^.{2}(?P<CN>(?:(?:\d?[A-Z]?|[A-Z]?\d?)(?:[a-z]{3,20}|[a-z]{3,6}[0-9_][a-z]{3,6})\.){0,2}?(?:\d?[A-Z]?|[A-Z]?\d?)[a-z]{3,}(?:[0-9_-][a-z]{3,})?\.(?!com|org|net|tv)[a-z]{2,9})[01].*?(?P=CN)[01]/Rs"; content:!"|2a 86 48 86 f7 0d 01 09 01|"; content:!"GoDaddy"; sid:2023476; rev:5;)
```

Rule ở trên tạo alert khi phát hiện một phiên TLS từ mạng bên ngoài tới mạng nội bộ (home network), trong đó payload của phiên chứa các pattern byte cụ thể và thoả mãn một số điều kiện. Các pattern và điều kiện này tương ứng với những certificate SSL đã được liên kết với một số biến thể của trojan Dridex, theo SSL blacklist trên `abuse.ch`.

Không cần hiểu toàn bộ rule, nhưng hãy cùng phân tích các phần quan trọng của nó.
- `content:"|16|"; content:"|0b|"; within:8;`: Rule tìm các giá trị hex 16 và 0b trong 8 byte đầu của payload. Chúng đại diện cho handshake message (0x16) và kiểu certificate (0x0b) trong TLS record.
- `content:"|03 02 01 02 02 09 00|"; fast_pattern;`: Rule tìm pattern byte cụ thể này trong packet, có thể là đặc trưng của các certificate mà Dridex sử dụng.
- `content:"|30 09 06 03 55 04 06 13 02|"; distance:0; pcre:"/^[A-Z]{2}/R"`;: Phần này kiểm tra field 'countryName' trong subject của certificate. Phép so khớp content ở đây tương ứng với một chuỗi ASN.1 chỉ định kiểu thuộc tính (attribute type) và giá trị cho 'countryName' (OID 2.5.4.6). PCRE theo sau kiểm tra rằng giá trị của 'countryName' bắt đầu bằng hai chữ cái in hoa, đây là định dạng chuẩn của mã quốc gia.
- `content:"|55 04 07|"; distance:0;`: Phần này kiểm tra field 'localityName' trong subject của certificate (OID 2.5.4.7).
- `content:"|55 04 0a|"; distance:0;`: Phần này kiểm tra field `organizationName` trong subject của certificate (OID 2.5.4.10).
- `content:"|55 04 03|"; distance:0; byte_test:1,>,13,1,relative;`: Phần này kiểm tra field `commonName` trong subject của certificate (OID 2.5.4.3). byte_test theo sau kiểm tra rằng độ dài của field `commonName` lớn hơn 13.
- Hãy xem thêm [tài liệu rất thú vị về certificate SSL của Dridex](https://unit42.paloaltonetworks.com/wireshark-tutorial-dridex-infection-traffic/) này. 

Các OID (Object Identifier) được nhắc đến ở trên là một phần của chuẩn X.509 dành cho PKI và được dùng để định danh duy nhất các loại field chứa trong certificate.

Rule trên đã có sẵn trong file `local.rules` nằm ở thư mục `/home/htb-student` trên target của section này. Để kiểm thử, trước tiên bạn cần bỏ comment (uncomment) rule. Sau đó, chạy Suricata trên file `dridex.pcap` nằm trong thư mục `/home/htb-student/pcaps`.

```shell-session
[!bash!]$ sudo suricata -r /home/htb-student/pcaps/dridex.pcap -l . -k none
15/7/2023 -- 20:34:11 - <Notice> - This is Suricata version 6.0.13 RELEASE running in USER mode
15/7/2023 -- 20:34:11 - <Notice> - all 3 packet processing threads, 4 management threads initialized, engine started.
15/7/2023 -- 20:34:11 - <Notice> - Signal Received.  Stopping engine.
15/7/2023 -- 20:34:11 - <Notice> - Pcap-file module read 1 files, 3683 packets, 3276706 bytes
```

```shell-session
[!bash!]$ cat fast.log
07/09/2019-18:26:31.480302  [**] [1:2023476:5] ET MALWARE ABUSE.CH SSL Blacklist Malicious SSL certificate detected (Dridex) [**] [Classification: (null)] [P             riority: 3] {TCP} 188.166.156.241:443 -> 10.7.9.101:49206
07/09/2019-18:26:33.937036  [**] [1:2023476:5] ET MALWARE ABUSE.CH SSL Blacklist Malicious SSL certificate detected (Dridex) [**] [Classification: (null)] [P             riority: 3] {TCP} 188.166.156.241:443 -> 10.7.9.101:49207
07/09/2019-18:26:39.373287  [**] [1:2023476:5] ET MALWARE ABUSE.CH SSL Blacklist Malicious SSL certificate detected (Dridex) [**] [Classification: (null)] [P             riority: 3] {TCP} 188.166.156.241:443 -> 10.7.9.101:49208
07/09/2019-18:26:29.628847  [**] [1:2023476:5] ET MALWARE ABUSE.CH SSL Blacklist Malicious SSL certificate detected (Dridex) [**] [Classification: (null)] [P             riority: 3] {TCP} 188.166.156.241:443 -> 10.7.9.101:49205
07/09/2019-18:30:08.787378  [**] [1:2023476:5] ET MALWARE ABUSE.CH SSL Blacklist Malicious SSL certificate detected (Dridex) [**] [Classification: (null)] [P             riority: 3] {TCP} 72.205.170.179:443 -> 10.7.9.101:49212
---SNIP---
```

## Ví dụ phát triển rule Suricata 6: Phát hiện Sliver (mã hoá TLS)


```shell-session
alert tls any any -> any any (msg:"Sliver C2 SSL"; ja3.hash; content:"473cd7cb9faa642487833865d516e578"; sid:1002; rev:1;)
```

Rule Suricata ở trên được thiết kế để phát hiện một số biến thể của [Sliver](https://github.com/BishopFox/sliver) mỗi khi nó nhận diện được một kết nối TLS có hash JA3 cụ thể. 

Một file PCAP tên `sliverenc.pcap` chứa traffic Sliver đã mã hoá nằm trong thư mục `/home/htb-student/pcaps` trên target của section này.

Có thể tính hash JA3 như sau.

```shell-session
[!bash!]$ ja3 -a --json /home/htb-student/pcaps/sliverenc.pcap
[
    {
        "destination_ip": "23.152.0.91",
        "destination_port": 443,
        "ja3": "771,49195-49199-49196-49200-52393-52392-49161-49171-49162-49172-156-157-47-53-49170-10-4865-4866-4867,0-5-10-11-13-65281-18-43-51,29-23-24-25,0",
        "ja3_digest": "473cd7cb9faa642487833865d516e578",
        "source_ip": "10.10.20.101",
        "source_port": 53222,
        "timestamp": 1634749464.600896
    },
    {
        "destination_ip": "23.152.0.91",
        "destination_port": 443,
        "ja3": "771,49195-49199-49196-49200-52393-52392-49161-49171-49162-49172-156-157-47-53-49170-10-4865-4866-4867,0-5-10-11-13-65281-18-43-51,29-23-24-25,0",
        "ja3_digest": "473cd7cb9faa642487833865d516e578",
        "source_ip": "10.10.20.101",
        "source_port": 53225,
        "timestamp": 1634749465.069819
    },
    {
        "destination_ip": "23.152.0.91",
        "destination_port": 443,
        "ja3": "771,49195-49199-49196-49200-52393-52392-49161-49171-49162-49172-156-157-47-53-49170-10-4865-4866-4867,0-5-10-11-13-65281-18-43-51,29-23-24-25,0",
        "ja3_digest": "473cd7cb9faa642487833865d516e578",
        "source_ip": "10.10.20.101",
        "source_port": 53229,
        "timestamp": 1634749585.240773
    },
---SNIP---
```

Rule trên đã có sẵn trong file `local.rules` nằm ở thư mục `/home/htb-student` trên target của section này. Để kiểm thử, trước tiên bạn cần bỏ comment (uncomment) rule. Sau đó, chạy Suricata trên file `sliverenc.pcap` nằm trong thư mục `/home/htb-student/pcaps`. 

```shell-session
[!bash!]$ sudo suricata -r /home/htb-student/pcaps/sliverenc.pcap -l . -k none
15/7/2023 -- 22:30:37 - <Notice> - This is Suricata version 6.0.13 RELEASE running in USER mode
15/7/2023 -- 22:30:37 - <Notice> - all 3 packet processing threads, 4 management threads initialized, engine started.
15/7/2023 -- 22:30:37 - <Notice> - Signal Received.  Stopping engine.
15/7/2023 -- 22:30:37 - <Notice> - Pcap-file module read 1 files, 15547 packets, 11904606 bytes
```

```shell-session
[!bash!]$ cat fast.log
10/20/2021-17:04:25.166658  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53225 -> 23.152.0.91:443
10/20/2021-17:07:25.315183  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53231 -> 23.152.0.91:443
10/20/2021-17:04:24.700690  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53222 -> 23.152.0.91:443
10/20/2021-17:06:25.328173  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53229 -> 23.152.0.91:443
10/20/2021-17:10:25.311929  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53234 -> 23.152.0.91:443
10/20/2021-17:08:25.312485  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53232 -> 23.152.0.91:443
10/20/2021-17:09:25.210256  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53233 -> 23.152.0.91:443
10/20/2021-17:14:25.235711  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53243 -> 23.152.0.91:443
10/20/2021-17:11:25.213759  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53240 -> 23.152.0.91:443
10/20/2021-17:12:25.302237  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53241 -> 23.152.0.91:443
10/20/2021-17:13:25.236776  [**] [1:1002:1] Sliver C2 SSL [**] [Classification: (null)] [Priority: 3] {TCP} 10.10.20.101:53242 -> 23.152.0.91:443
---SNIP---
```
