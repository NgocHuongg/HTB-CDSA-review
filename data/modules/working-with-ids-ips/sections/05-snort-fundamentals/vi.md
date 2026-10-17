# Snort Fundamentals (Kiến thức nền tảng về Snort)

Snort là một công cụ mã nguồn mở, vừa đóng vai trò Intrusion Detection System (IDS – hệ thống phát hiện xâm nhập) vừa là Intrusion Prevention System (IPS – hệ thống ngăn chặn xâm nhập), nhưng cũng có thể hoạt động như một packet logger hoặc sniffer, tương tự Suricata. Nhờ kiểm tra kỹ lưỡng toàn bộ lưu lượng mạng, Snort có khả năng nhận diện và ghi log mọi hoạt động trong lưu lượng đó, mang lại cái nhìn toàn diện về tình hình cùng log chi tiết của mọi giao dịch ở tầng ứng dụng (application layer). Ta cần các bộ rule (rule set) cụ thể để chỉ dẫn Snort cách thực hiện việc kiểm tra và chính xác những gì nó cần nhận diện. Snort được tạo ra để hoạt động hiệu quả trên cả phần cứng đa dụng lẫn phần cứng tuỳ biến.

## Các chế độ hoạt động của Snort

Snort thường hoạt động ở các chế độ sau:
- Inline IDS/IPS
- Passive IDS (IDS thụ động)
- Network-based IDS (IDS dựa trên mạng)
- Host-based IDS (tuy nhiên, Snort không hẳn là một host-based IDS lý tưởng. Chúng tôi khuyến nghị chọn các công cụ chuyên dụng hơn cho mục đích này.)

**Theo [tài liệu của Snort](https://docs.snort.org/start/inspection)**: 

"Với một số DAQ module nhất định, Snort có thể dùng hai chế độ hoạt động khác nhau: `passive` và `inline`. `Passive mode` cho Snort khả năng quan sát và phát hiện lưu lượng trên một network interface, nhưng không cho phép chặn hẳn lưu lượng. Ngược lại, `Inline mode` cho Snort khả năng chặn lưu lượng nếu một packet cụ thể đáng bị xử lý như vậy.

Snort sẽ tự suy ra chế độ hoạt động dựa trên các option dùng ở dòng lệnh. Ví dụ, đọc từ một file pcap bằng option `-r` hoặc lắng nghe trên một interface bằng `-i` sẽ khiến Snort mặc định chạy ở passive mode. Tuy nhiên, nếu DAQ hỗ trợ inline thì người dùng có thể chỉ định flag `-Q` để chạy Snort ở chế độ inline.

Một DAQ module hỗ trợ inline mode là `afpacket` — module cho phép Snort truy cập các packet nhận được trên các thiết bị mạng của Linux."

## Kiến trúc của Snort

Để Snort chuyển từ một packet sniffer đơn giản thành một IDS mạnh mẽ, một số thành phần then chốt đã được bổ sung: `Preprocessor`, `Detection Engine`, `Logging and Alerting System` và các `Output modules`.

- Packet sniffer (bao gồm cả Packet Decoder) trích xuất lưu lượng mạng, nhận diện cấu trúc của từng packet. Các raw packet thu thập được sau đó được chuyển tiếp tới các `Preprocessors`.
- Các `Preprocessors` trong Snort xác định loại hoặc hành vi của các packet được chuyển tới. Snort có nhiều plugin `Preprocessor`, như plugin HTTP giúp phân biệt các packet liên quan tới HTTP, hay `port_scan Preprocessor` giúp nhận diện các nỗ lực quét cổng (port scanning) tiềm ẩn dựa trên các giao thức, loại scan và ngưỡng (threshold) định sẵn. Sau khi các `Preprocessors` hoàn tất nhiệm vụ, thông tin được chuyển sang `Detection Engine`. Cấu hình của các `Preprocessors` này nằm trong file cấu hình của Snort, `snort.lua`.
- `Detection Engine` so sánh từng packet với một tập Snort rule định sẵn. Nếu tìm thấy kết quả khớp (match), thông tin được chuyển tới `Logging and Alerting System`.
- `Logging and Alerting System` và `Output modules` chịu trách nhiệm ghi lại hoặc kích hoạt alert theo action của từng rule. Log thường được lưu ở định dạng `syslog` hoặc `unified2`, hoặc ghi thẳng vào database. Các `Output modules` được cấu hình trong file cấu hình của Snort, `snort.lua`.

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Bây giờ hãy kéo xuống cuối section này và bấm vào "Click here to spawn the target system!". Sau đó, SSH vào Target IP bằng thông tin đăng nhập được cung cấp. Phần lớn các lệnh được trình bày từ đây tới cuối section đều có thể chạy lại trên target, giúp ta nắm các chủ đề được trình bày một cách toàn diện hơn. </p>
    </div>
</div>

## Cấu hình Snort & kiểm tra (validate) cấu hình của Snort

Snort cung cấp rất nhiều tuỳ chọn cấu hình, và may mắn là Snort 3 mã nguồn mở cung cấp sẵn cho người dùng các file đã được cấu hình trước để bắt đầu nhanh. Các file cấu hình mặc định này, cụ thể là `snort.lua` và `snort_defaults.lua`, là nền tảng để thiết lập Snort và đưa nó vào hoạt động trong thời gian ngắn. Chúng cung cấp một khung cấu hình chuẩn cho người dùng Snort.

File `snort.lua` là file cấu hình chính của Snort. File này gồm các phần sau:
- Biến mạng (network variables)
- Cấu hình decoder
- Cấu hình base detection engine
- Cấu hình dynamic library
- Cấu hình preprocessor
- Cấu hình output plugin
- Tuỳ chỉnh rule set
- Tuỳ chỉnh rule set của preprocessor và decoder
- Tuỳ chỉnh rule set dạng shared object

Hãy xem file `snort.lua` nằm trên target của section này như sau.

```shell-session
[!bash!]$ sudo more /root/snorty/etc/snort/snort.lua
---------------------------------------------------------------------------
-- Snort++ configuration
---------------------------------------------------------------------------

-- there are over 200 modules available to tune your policy.
-- many can be used with defaults w/o any explicit configuration.
-- use this conf as a template for your specific configuration.

-- 1. configure defaults
-- 2. configure inspection
-- 3. configure bindings
-- 4. configure performance
-- 5. configure detection
-- 6. configure filters
-- 7. configure outputs
-- 8. configure tweaks

---------------------------------------------------------------------------
-- 1. configure defaults
---------------------------------------------------------------------------

-- HOME_NET and EXTERNAL_NET must be set now
-- setup the network addresses you are protecting
HOME_NET = 'any'

-- set up the external network addresses.
-- (leave as "any" in most situations)
EXTERNAL_NET = 'any'

include 'snort_defaults.lua'

---------------------------------------------------------------------------
-- 2. configure inspection
---------------------------------------------------------------------------

-- mod = { } uses internal defaults
-- you can see them with snort --help-module mod

-- mod = default_mod uses external defaults
-- you can see them in snort_defaults.lua

-- the following are quite capable with defaults:

stream = { }
stream_ip = { }
stream_icmp = { }
stream_tcp = { }
stream_udp = { }
stream_user = { }
stream_file = { }
---SNIP---
```

Bật và tinh chỉnh các `modules` của Snort là một phần quan trọng của quá trình cấu hình. Để xem danh sách đầy đủ kèm mô tả ngắn gọn của tất cả module trong Snort 3, bạn có thể dùng lệnh sau.

```shell-session
[!bash!]$ snort --help-modules
ack (ips_option): rule option to match on TCP ack numbers
active (basic): configure responses
address_space_selector (policy_selector): configure traffic processing based on address space
alert_csv (logger): output event in csv format
alert_fast (logger): output event with brief text format
alert_full (logger): output event with full packet dump
alert_json (logger): output event in json format
alert_syslog (logger): output event to syslog
alert_talos (logger): output event in Talos alert format
alert_unixsock (logger): output event over unix socket
alerts (basic): configure alerts
appid (inspector): application and service identification
appids (ips_option): detection option for application ids
arp (codec): support for address resolution protocol
arp_spoof (inspector): detect ARP attacks and anomalies
---SNIP---
```

Các module này được bật và cấu hình trong file cấu hình `snort.lua` dưới dạng Lua table literal. Nếu một module được khởi tạo bằng một table rỗng, nghĩa là nó đang dùng các thiết lập "mặc định" (default) định sẵn. Để xem các thiết lập mặc định này, bạn có thể dùng lệnh sau.

```shell-session
[!bash!]$ snort --help-config arp_spoof
ip4 arp_spoof.hosts[].ip: host ip address
mac arp_spoof.hosts[].mac: host mac address
```

Việc truyền (và kiểm tra tính hợp lệ của) file cấu hình cho Snort có thể thực hiện như sau.

```shell-session
[!bash!]$ snort -c /root/snorty/etc/snort/snort.lua --daq-dir /usr/local/lib/daq
--------------------------------------------------
o")~   Snort++ 3.1.64.0
--------------------------------------------------
Loading /root/snorty/etc/snort/snort.lua:
Loading snort_defaults.lua:
Finished snort_defaults.lua:
        output
        ips
        classifications
        references
        binder
        file_id
        ftp_server
        smtp
        port_scan
        gtp_inspect
        dce_smb
        s7commplus
        modbus
        ssh
        active
        alerts
        daq
        decode
        host_cache
        host_tracker
        hosts
        network
        packets
        process
        search_engine
        so_proxy
        stream_icmp
        normalizer
        stream
        stream_ip
        stream_tcp
        stream_udp
        stream_user
        stream_file
        arp_spoof
        back_orifice
        dns
        imap
        netflow
        pop
        rpc_decode
        sip
        ssl
        telnet
        cip
        dnp3
        iec104
        mms
        dce_tcp
        dce_udp
        dce_http_proxy
        dce_http_server
        ftp_client
        ftp_data
        http_inspect
        http2_inspect
        file_policy
        js_norm
        appid
        wizard
        trace
Finished /root/snorty/etc/snort/snort.lua:
Loading file_id.rules_file:
Loading file_magic.rules:
Finished file_magic.rules:
Finished file_id.rules_file:
--------------------------------------------------
ips policies rule stats
              id  loaded  shared enabled    file
               0     208       0     208    /root/snorty/etc/snort/snort.lua
--------------------------------------------------
rule counts
       total rules loaded: 208
               text rules: 208
            option chains: 208
            chain headers: 1
--------------------------------------------------
service rule counts          to-srv  to-cli
                  file_id:      208     208
                    total:      208     208
--------------------------------------------------
fast pattern groups
                to_server: 1
                to_client: 1
--------------------------------------------------
search engine (ac_bnfa)
                instances: 2
                 patterns: 416
            pattern chars: 2508
               num states: 1778
         num match states: 370
             memory scale: KB
             total memory: 68.5879
           pattern memory: 18.6973
        match list memory: 27.3281
        transition memory: 22.3125
appid: MaxRss diff: 3084
appid: patterns loaded: 300
--------------------------------------------------
pcap DAQ configured to passive.

Snort successfully validated the configuration (with 0 warnings).
o")~   Snort exiting
```

**Lưu ý**: `--daq-dir /usr/local/lib/daq` không bắt buộc khi truyền và kiểm tra file cấu hình. Nó được thêm vào để ta có thể chạy lại lệnh này trên target của section.

Nhân tiện nhắc tới `DAQ`, Snort 3 cần biết nơi tìm `LibDAQ` phù hợp. `LibDAQ` là "Data Acquisition Library" (thư viện thu thập dữ liệu); ở mức tổng quát, đây là một lớp trừu tượng (abstraction layer) được các `modules` dùng để giao tiếp với các nguồn dữ liệu mạng, cả phần cứng lẫn phần mềm.

Chúng tôi rất khuyến khích bạn dành thời gian đọc các comment bên trong file `snort.lua` vì chúng cung cấp nhiều thông tin giá trị.

## Đầu vào (input) của Snort

Cách dễ nhất để quan sát Snort hoạt động là chạy nó trên một file packet capture. Khi truyền tên file pcap làm đối số cho option `-r` ở dòng lệnh, Snort sẽ xử lý file đó tương ứng.

```shell-session
[!bash!]$ sudo snort -c /root/snorty/etc/snort/snort.lua --daq-dir /usr/local/lib/daq -r /home/htb-student/pcaps/icmp.pcap
[sudo] password for htb-student:
--------------------------------------------------
o")~   Snort++ 3.1.64.0
--------------------------------------------------
Loading /root/snorty/etc/snort/snort.lua:
Loading snort_defaults.lua:
Finished snort_defaults.lua:
---SNIP---
Finished /root/snorty/etc/snort/snort.lua:
Loading file_id.rules_file:
Loading file_magic.rules:
Finished file_magic.rules:
Finished file_id.rules_file:
--------------------------------------------------
ips policies rule stats
              id  loaded  shared enabled    file
               0     208       0     208    /root/snorty/etc/snort/snort.lua
--------------------------------------------------
rule counts
       total rules loaded: 208
               text rules: 208
            option chains: 208
            chain headers: 1
--------------------------------------------------
service rule counts          to-srv  to-cli
                  file_id:      208     208
                    total:      208     208
--------------------------------------------------
fast pattern groups
                to_server: 1
                to_client: 1
--------------------------------------------------
search engine (ac_bnfa)
                instances: 2
                 patterns: 416
            pattern chars: 2508
               num states: 1778
         num match states: 370
             memory scale: KB
             total memory: 68.5879
           pattern memory: 18.6973
        match list memory: 27.3281
        transition memory: 22.3125
appid: MaxRss diff: 3024
appid: patterns loaded: 300
--------------------------------------------------
pcap DAQ configured to read-file.
Commencing packet processing
++ [0] /home/htb-student/pcaps/icmp.pcap
-- [0] /home/htb-student/pcaps/icmp.pcap
--------------------------------------------------
Packet Statistics
--------------------------------------------------
daq
                    pcaps: 1
                 received: 8
                 analyzed: 8
                    allow: 8
                 rx_bytes: 592
--------------------------------------------------
codec
                    total: 8            (100.000%)
                      eth: 8            (100.000%)
                    icmp4: 8            (100.000%)
                     ipv4: 8            (100.000%)
--------------------------------------------------
Module Statistics
--------------------------------------------------
appid
                  packets: 8
        processed_packets: 8
           total_sessions: 1
--------------------------------------------------
binder
                new_flows: 1
                 inspects: 1
--------------------------------------------------
detection
                 analyzed: 8
--------------------------------------------------
port_scan
                  packets: 8
                 trackers: 2
--------------------------------------------------
stream
                    flows: 1
--------------------------------------------------
stream_icmp
                 sessions: 1
                      max: 1
                  created: 1
                 released: 1
--------------------------------------------------
Summary Statistics
--------------------------------------------------
timing
                  runtime: 00:00:00
                  seconds: 0.033229
                 pkts/sec: 241
o")~   Snort exiting
```

Snort cũng có khả năng lắng nghe trên các network interface đang hoạt động. Để chỉ định hành vi này, bạn có thể dùng option `-i` theo sau là tên các interface mà Snort sẽ chạy trên đó.

```shell-session
[!bash!]$ sudo snort -c /root/snorty/etc/snort/snort.lua --daq-dir /usr/local/lib/daq -i ens160
--------------------------------------------------
o")~   Snort++ 3.1.64.0
--------------------------------------------------
Loading /root/snorty/etc/snort/snort.lua:
Loading snort_defaults.lua:
Finished snort_defaults.lua:
---SNIP---
Finished /root/snorty/etc/snort/snort.lua:
Loading file_id.rules_file:
Loading file_magic.rules:
Finished file_magic.rules:
Finished file_id.rules_file:
--------------------------------------------------
ips policies rule stats
              id  loaded  shared enabled    file
               0     208       0     208    /root/snorty/etc/snort/snort.lua
--------------------------------------------------
rule counts
       total rules loaded: 208
               text rules: 208
            option chains: 208
            chain headers: 1
--------------------------------------------------
service rule counts          to-srv  to-cli
                  file_id:      208     208
                    total:      208     208
--------------------------------------------------
fast pattern groups
                to_server: 1
                to_client: 1
--------------------------------------------------
search engine (ac_bnfa)
                instances: 2
                 patterns: 416
            pattern chars: 2508
               num states: 1778
         num match states: 370
             memory scale: KB
             total memory: 68.5879
           pattern memory: 18.6973
        match list memory: 27.3281
        transition memory: 22.3125
appid: MaxRss diff: 2820
appid: patterns loaded: 300
--------------------------------------------------
pcap DAQ configured to passive.
Commencing packet processing
++ [0] ens160
^C** caught int signal
== stopping
-- [0] ens160
--------------------------------------------------
Packet Statistics
--------------------------------------------------
daq
                 received: 33
                 analyzed: 33
                    allow: 33
                     idle: 9
                 rx_bytes: 2756
--------------------------------------------------
codec
                    total: 33           (100.000%)
                 discards: 2            (  6.061%)
                      arp: 13           ( 39.394%)
                      eth: 33           (100.000%)
                    icmp4: 12           ( 36.364%)
                    icmp6: 3            (  9.091%)
                     ipv4: 17           ( 51.515%)
                     ipv6: 3            (  9.091%)
                      tcp: 5            ( 15.152%)
--------------------------------------------------
Module Statistics
--------------------------------------------------
appid
                  packets: 18
        processed_packets: 16
          ignored_packets: 2
           total_sessions: 3
--------------------------------------------------
arp_spoof
                  packets: 13
--------------------------------------------------
binder
              raw_packets: 15
                new_flows: 3
                 inspects: 18
--------------------------------------------------
detection
                 analyzed: 33
--------------------------------------------------
port_scan
                  packets: 20
                 trackers: 8
--------------------------------------------------
stream
                    flows: 3
--------------------------------------------------
stream_icmp
                 sessions: 2
                      max: 2
                  created: 2
                 released: 2
--------------------------------------------------
stream_tcp
                 sessions: 1
                      max: 1
                  created: 1
                 released: 1
             instantiated: 1
                   setups: 1
            data_trackers: 1
              segs_queued: 1
            segs_released: 1
                 max_segs: 1
                max_bytes: 64
--------------------------------------------------
tcp
        bad_tcp4_checksum: 2
--------------------------------------------------
Appid Statistics
--------------------------------------------------
detected apps and services
              Application: Services   Clients    Users      Payloads   Misc       Referred
                  unknown: 1          0          0          0          0          0
--------------------------------------------------
Summary Statistics
--------------------------------------------------
process
                  signals: 1
--------------------------------------------------
timing
                  runtime: 00:00:25
                  seconds: 25.182182
                 pkts/sec: 1
o")~   Snort exiting
```

## Rule của Snort

Snort rule, vốn giống Suricata rule, gồm `rule header` và `rule options`. Dù Snort rule có nhiều điểm tương đồng với Suricata rule, chúng tôi vẫn đặc biệt khuyên bạn học cách viết Snort rule từ các tài liệu sau: [https://docs.snort.org/](https://docs.snort.org), [https://docs.suricata.io/en/latest/rules/differences-from-snort.html](https://docs.suricata.io/en/latest/rules/differences-from-snort.html). Các Snort rule mới nhất có thể lấy từ website của Snort hoặc website của Emerging Threats. 

Trong các hệ thống triển khai Snort, ta có thể quản lý rule một cách linh hoạt. Có thể đặt rule (ví dụ: `local.rules` nằm tại `/home/htb-student`) trực tiếp trong file cấu hình `snort.lua` bằng module `ips` như sau.

```shell-session
[!bash!]$ sudo vim /root/snorty/etc/snort/snort.lua
```

```shell-session
---SNIP---
ips =
{
    -- use this to enable decoder and inspector alerts
    --enable_builtin_rules = true,

    -- use include for rules files; be sure to set your path
    -- note that rules files can include other rules files
    -- (see also related path vars at the top of snort_defaults.lua)

    { variables = default_variables, include = '/home/htb-student/local.rules' }
}
---SNIP---
```

Khi đó, các rule được "include" sẽ tự động được nạp.

Trong hệ thống Snort của chúng ta, còn có một cách khác để đưa rule vào trực tiếp từ dòng lệnh. Ta có thể truyền thẳng cho Snort một file rule đơn lẻ hoặc đường dẫn tới một thư mục chứa các file rule. Việc này thực hiện được bằng hai option:
- Với một file rule đơn lẻ, ta dùng option `-R` theo sau là đường dẫn tới file rule. Cách này cho phép chỉ định một file rule cụ thể để Snort sử dụng.
- Để đưa vào cả một thư mục chứa các file rule, ta dùng option `--rule-path` theo sau là đường dẫn tới thư mục rule. Cách này cho phép cung cấp cho Snort một thư mục chứa nhiều file rule.

## Đầu ra (output) của Snort

Trong hệ thống Snort của chúng ta, ta có thể gặp một lượng dữ liệu đáng kể. Để tóm tắt các loại output cốt lõi, hãy cùng tìm hiểu các khía cạnh chính:
- `Basic Statistics`: Khi tắt (shutdown), Snort tạo ra nhiều số liệu đếm khác nhau dựa trên cấu hình và lưu lượng đã xử lý. Bao gồm:
	- `Packet Statistics`: Gồm thông tin từ DAQ và các decoder, chẳng hạn số packet đã nhận và số packet UDP.
	- `Module Statistics`: Mỗi module theo dõi hoạt động thông qua các peg count (bộ đếm), cho biết tần suất các hành động được quan sát hoặc được thực hiện. Ví dụ: số HTTP GET request đã xử lý và số packet TCP reset bị cắt bớt (trimmed).
	- `File Statistics`: Phần này cung cấp số liệu chi tiết theo loại file, số byte và signature.
	- `Summary Statistics`: Bao gồm tổng thời gian chạy để xử lý packet, số packet mỗi giây và, nếu được cấu hình, cả dữ liệu profiling.
- `Alerts`: Khi đã cấu hình rule, cần bật alerting (dùng option `-A`) để xem chi tiết các detection event. Có nhiều loại alert output, bao gồm:
	- `-A cmg`: Option này kết hợp `-A fast -d -e` và hiển thị thông tin alert kèm packet header và payload.
	- `-A u2`: Option này tương đương `-A unified2`, ghi log các event và các packet đã kích hoạt chúng vào một file nhị phân, có thể dùng để hậu xử lý (post-processing) bằng các công cụ khác.
	- `-A csv`: Option này xuất các field ở định dạng giá trị phân tách bằng dấu phẩy (comma-separated value), có các tuỳ chọn tuỳ biến và giúp việc phân tích pcap thuận tiện hơn.
	
	Để xem các loại alert hiện có, ta có thể chạy lệnh sau.
```shell-session
[!bash!]$ snort --list-plugins | grep logger
logger::alert_csv v0 static
logger::alert_fast v0 static
logger::alert_full v0 static
logger::alert_json v0 static
logger::alert_syslog v0 static
logger::alert_talos v0 static
logger::alert_unixsock v0 static
logger::log_codecs v0 static
logger::log_hext v0 static
logger::log_pcap v0 static
logger::unified2 v0 static
```
- `Performance Statistics`: Ngoài các output nói trên, còn có thể thu thập thêm dữ liệu khác. Bằng cách cấu hình module `perf_monitor`, ta có thể thu một tập `peg` count tuỳ chỉnh trong lúc chạy. Dữ liệu này có thể đưa vào một chương trình bên ngoài để giám sát hoạt động của Snort mà không làm gián đoạn nó. Module `profiler` cho phép theo dõi lượng thời gian và bộ nhớ (space) mà các module và rule sử dụng. Thông tin này rất có giá trị để tối ưu hiệu năng hệ thống. Output của profiler xuất hiện dưới mục `Summary Statistics` khi Snort tắt.

Hãy xem một ví dụ về output `cmg`.

```shell-session
[!bash!]$ sudo snort -c /root/snorty/etc/snort/snort.lua --daq-dir /usr/local/lib/daq -r /home/htb-student/pcaps/icmp.pcap -A cmg
--------------------------------------------------
o")~   Snort++ 3.1.64.0
--------------------------------------------------
Loading /root/snorty/etc/snort/snort.lua:
Loading snort_defaults.lua:
Finished snort_defaults.lua:
--SNIP---
Finished /root/snorty/etc/snort/snort.lua:
Loading file_id.rules_file:
Loading file_magic.rules:
Finished file_magic.rules:
Finished file_id.rules_file:
Loading /home/htb-student/local.rules:
Finished /home/htb-student/local.rules:
--------------------------------------------------
ips policies rule stats
              id  loaded  shared enabled    file
               0     209       0     209    /root/snorty/etc/snort/snort.lua
--------------------------------------------------
rule counts
       total rules loaded: 209
               text rules: 209
            option chains: 209
            chain headers: 2
--------------------------------------------------
port rule counts
             tcp     udp    icmp      ip
     any       0       0       1       0
   total       0       0       1       0
--------------------------------------------------
service rule counts          to-srv  to-cli
                  file_id:      208     208
                    total:      208     208
--------------------------------------------------
fast pattern groups
                to_server: 1
                to_client: 1
--------------------------------------------------
search engine (ac_bnfa)
                instances: 2
                 patterns: 416
            pattern chars: 2508
               num states: 1778
         num match states: 370
             memory scale: KB
             total memory: 68.5879
           pattern memory: 18.6973
        match list memory: 27.3281
        transition memory: 22.3125
appid: MaxRss diff: 3024
appid: patterns loaded: 300
--------------------------------------------------
pcap DAQ configured to read-file.
Commencing packet processing
++ [0] /home/htb-student/pcaps/icmp.pcap
06/19-08:45:56.838904 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55107 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:8448  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:57.055699 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30433 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:8448  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:57.840049 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55110 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:8704  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:58.044196 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30436 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:8704  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:58.841168 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55113 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:8960  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:59.085428 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30448 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:8960  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:59.841775 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55118 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:9216  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:46:00.042354 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30453 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:9216  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

-- [0] /home/htb-student/pcaps/icmp.pcap
--------------------------------------------------
Packet Statistics
--------------------------------------------------
daq
                    pcaps: 1
                 received: 8
                 analyzed: 8
                    allow: 8
                 rx_bytes: 592
--------------------------------------------------
codec
                    total: 8            (100.000%)
                      eth: 8            (100.000%)
                    icmp4: 8            (100.000%)
                     ipv4: 8            (100.000%)
--------------------------------------------------
Module Statistics
--------------------------------------------------
appid
                  packets: 8
        processed_packets: 8
           total_sessions: 1
--------------------------------------------------
binder
                new_flows: 1
                 inspects: 1
--------------------------------------------------
detection
                 analyzed: 8
               hard_evals: 8
                   alerts: 8
             total_alerts: 8
                   logged: 8
--------------------------------------------------
port_scan
                  packets: 8
                 trackers: 2
--------------------------------------------------
search_engine
         qualified_events: 8
--------------------------------------------------
stream
                    flows: 1
--------------------------------------------------
stream_icmp
                 sessions: 1
                      max: 1
                  created: 1
                 released: 1
--------------------------------------------------
Summary Statistics
--------------------------------------------------
timing
                  runtime: 00:00:00
                  seconds: 0.042473
                 pkts/sec: 188
o")~   Snort exiting
```

Dưới đây là cùng lệnh đó nhưng dùng một file `.rules` có thể chưa được "include" trong `snort.lua`.

 ```shell-session
[!bash!]$ sudo snort -c /root/snorty/etc/snort/snort.lua --daq-dir /usr/local/lib/daq -r /home/htb-student/pcaps/icmp.pcap -R /home/htb-student/local.rules -A cmg
--------------------------------------------------
o")~   Snort++ 3.1.64.0
--------------------------------------------------
Loading /root/snorty/etc/snort/snort.lua:
Loading snort_defaults.lua:
Finished snort_defaults.lua:
--SNIP---
Finished /root/snorty/etc/snort/snort.lua:
Loading file_id.rules_file:
Loading file_magic.rules:
Finished file_magic.rules:
Finished file_id.rules_file:
Loading /home/htb-student/local.rules:
Finished /home/htb-student/local.rules:
--------------------------------------------------
ips policies rule stats
              id  loaded  shared enabled    file
               0     209       0     209    /root/snorty/etc/snort/snort.lua
--------------------------------------------------
rule counts
       total rules loaded: 209
               text rules: 209
            option chains: 209
            chain headers: 2
--------------------------------------------------
port rule counts
             tcp     udp    icmp      ip
     any       0       0       1       0
   total       0       0       1       0
--------------------------------------------------
service rule counts          to-srv  to-cli
                  file_id:      208     208
                    total:      208     208
--------------------------------------------------
fast pattern groups
                to_server: 1
                to_client: 1
--------------------------------------------------
search engine (ac_bnfa)
                instances: 2
                 patterns: 416
            pattern chars: 2508
               num states: 1778
         num match states: 370
             memory scale: KB
             total memory: 68.5879
           pattern memory: 18.6973
        match list memory: 27.3281
        transition memory: 22.3125
appid: MaxRss diff: 3024
appid: patterns loaded: 300
--------------------------------------------------
pcap DAQ configured to read-file.
Commencing packet processing
++ [0] /home/htb-student/pcaps/icmp.pcap
06/19-08:45:56.838904 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55107 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:8448  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:57.055699 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30433 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:8448  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:57.840049 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55110 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:8704  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:58.044196 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30436 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:8704  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:58.841168 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55113 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:8960  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:59.085428 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30448 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:8960  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:45:59.841775 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 192.168.158.139 -> 174.137.42.77
00:0C:29:34:0B:DE -> 00:50:56:E0:14:49 type:0x800 len:0x4A
192.168.158.139 -> 174.137.42.77 ICMP TTL:128 TOS:0x0 ID:55118 IpLen:20 DgmLen:60
Type:8  Code:0  ID:512   Seq:9216  ECHO

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

06/19-08:46:00.042354 [**] [1:1000001:1] "ICMP test" [**] [Classification: Generic ICMP event] [Priority: 3] {ICMP} 174.137.42.77 -> 192.168.158.139
00:50:56:E0:14:49 -> 00:0C:29:34:0B:DE type:0x800 len:0x4A
174.137.42.77 -> 192.168.158.139 ICMP TTL:128 TOS:0x0 ID:30453 IpLen:20 DgmLen:60
Type:0  Code:0  ID:512  Seq:9216  ECHO REPLY

snort.raw[32]:
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -
61 62 63 64 65 66 67 68  69 6A 6B 6C 6D 6E 6F 70  abcdefgh ijklmnop
71 72 73 74 75 76 77 61  62 63 64 65 66 67 68 69  qrstuvwa bcdefghi
- - - - - - - - - - - -  - - - - - - - - - - - -  - - - - - - - - -

-- [0] /home/htb-student/pcaps/icmp.pcap
--------------------------------------------------
Packet Statistics
--------------------------------------------------
daq
                    pcaps: 1
                 received: 8
                 analyzed: 8
                    allow: 8
                 rx_bytes: 592
--------------------------------------------------
codec
                    total: 8            (100.000%)
                      eth: 8            (100.000%)
                    icmp4: 8            (100.000%)
                     ipv4: 8            (100.000%)
--------------------------------------------------
Module Statistics
--------------------------------------------------
appid
                  packets: 8
        processed_packets: 8
           total_sessions: 1
--------------------------------------------------
binder
                new_flows: 1
                 inspects: 1
--------------------------------------------------
detection
                 analyzed: 8
               hard_evals: 8
                   alerts: 8
             total_alerts: 8
                   logged: 8
--------------------------------------------------
port_scan
                  packets: 8
                 trackers: 2
--------------------------------------------------
search_engine
         qualified_events: 8
--------------------------------------------------
stream
                    flows: 1
--------------------------------------------------
stream_icmp
                 sessions: 1
                      max: 1
                  created: 1
                 released: 1
--------------------------------------------------
Summary Statistics
--------------------------------------------------
timing
                  runtime: 00:00:00
                  seconds: 0.042473
                 pkts/sec: 188
o")~   Snort exiting
```

## Các tính năng chính của Snort

Các tính năng chính giúp tăng cường hiệu quả của Snort gồm:
- Deep packet inspection (kiểm tra sâu gói tin), packet capture và ghi log
- Phát hiện xâm nhập (intrusion detection)
- Network Security Monitoring (giám sát an ninh mạng)
- Phát hiện bất thường (anomaly detection)
- Hỗ trợ nhiều tenant (multi-tenant)
- Hỗ trợ cả IPv6 và IPv4
