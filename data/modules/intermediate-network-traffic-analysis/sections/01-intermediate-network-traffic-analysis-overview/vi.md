# Intermediate Network Traffic Analysis Overview (Tổng quan về phân tích lưu lượng mạng trung cấp)


Không thể nói quá về tầm quan trọng của việc thành thạo phân tích lưu lượng mạng (network traffic analysis) trong các môi trường mạng vận động nhanh, liên tục thay đổi và phức tạp như hiện nay. Đối mặt với khối lượng traffic khổng lồ đi qua hạ tầng mạng, ta dễ cảm thấy nản lòng. Khả năng ta cảm thấy mình chưa đủ trang bị, thậm chí bị quá tải, là một thách thức cố hữu mà ta phải vượt qua.

Trong module này, ta sẽ tập trung vào một loạt rộng các cuộc tấn công trải khắp những thành phần quan trọng của hạ tầng mạng. Ta sẽ đi sâu vào các cuộc tấn công diễn ra ở tầng liên kết (link layer), tầng IP, cũng như tầng giao vận (transport) và tầng mạng (network). Phạm vi tìm hiểu thậm chí còn bao gồm cả các cuộc tấn công nhắm vào tầng ứng dụng (application layer). Mục tiêu là nhận ra các mẫu (pattern) và xu hướng trong những cuộc tấn công này. Nhận diện được các pattern đó sẽ trang bị cho ta những kỹ năng thiết yếu để phát hiện và phản ứng với các mối đe doạ này một cách hiệu quả.

Hơn nữa, ta sẽ bàn thêm một số kỹ năng bổ trợ để nâng cao năng lực. Ta sẽ đề cập đến các kỹ thuật phát hiện bất thường (anomaly detection), đi sâu vào một số khía cạnh của phân tích log, và tìm hiểu một vài Indicators of Compromise (IOC – dấu hiệu xâm nhập). Cách tiếp cận toàn diện này không chỉ củng cố khả năng chủ động nhận diện mối đe doạ mà còn tăng cường các biện pháp phản ứng. Rốt cuộc, điều này sẽ giúp ta xác định, báo cáo và phản ứng với các mối đe doạ hiệu quả hơn và trong khoảng thời gian ngắn hơn.

---

**Lưu ý**: Để tham gia module này và hoàn thành các bài thực hành, hãy tải `pcap_files.zip` từ mục `Resources` (góc trên bên phải).

Bạn có thể tải và giải nén `pcaps.zip` vào một thư mục tên `pcaps` bên trong Pwnbox như sau.

```shell-session
[!bash!]$ wget -O file.zip 'https://cdn.services-k8s.prod.aws.htb.systems/content/optional_resources/file/4c953c39-abbd-4673-abba-43e137861663.zip' && mkdir tempdir && unzip file.zip -d tempdir && mkdir -p pcaps && mv tempdir/Intermediate_Network_Traffic_Analysis/* pcaps/ && rm -r tempdir file.zip

--2026-10-14 01:39:08--  https://cdn.services-k8s.prod.aws.htb.systems/content/optional_resources/file/4c953c39-abbd-4673-abba-43e137861663.zip
Resolving cdn.services-k8s.prod.aws.htb.systems (cdn.services-k8s.prod.aws.htb.systems)... 109.176.239.0
Connecting to cdn.services-k8s.prod.aws.htb.systems (cdn.services-k8s.prod.aws.htb.systems)|109.176.239.0|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 19078200 (18M) [application/zip]
Saving to: ‘file.zip’

file.zip                                        100%[=====================================================================================================>]  18.19M  --.-KB/s    in 0.08s   

2026-10-14 01:39:08 (242 MB/s) - ‘file.zip’ saved [19078200/19078200]

Archive:  file.zip
   creating: tempdir/Intermediate_Network_Traffic_Analysis/
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/ARP_Poison.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/ARP_Scan.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/ARP_Spoof.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/basic_fuzzing.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/CRLF_and_host_header_manipulation.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/deauthandbadauth.cap  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/decoy_scanning_nmap.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/dns_enum_detection.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/dns_tunneling.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/funky_dns.pcap  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/funky_icmp.pcap  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/icmp_frag.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/ICMP_rand_source.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/ICMP_rand_source_larg_data.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/ICMP_smurf.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/icmp_tunneling.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/ip_ttl.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/LAND-DoS.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/nmap_ack_scan.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/nmap_fin_scan.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/nmap_frag_fw_bypass.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/nmap_null_scan.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/nmap_syn_scan.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/nmap_xmas_scan.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/number_fuzzing.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/rogueap.cap  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/RST_Attack.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/SSL_renegotiation_edited.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/SSL_renegotiation_original.pcap  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/TCP-hijacking.pcap  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/TCP_rand_source_attacks.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/telnet_tunneling_23.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/telnet_tunneling_9999.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/telnet_tunneling_ipv6.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/udp_tunneling.pcapng  
  inflating: tempdir/Intermediate_Network_Traffic_Analysis/XSS_Simple.pcapng 
  ```
