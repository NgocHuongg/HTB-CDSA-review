# Analysis of Insight Nexus Breach (Phân tích vụ xâm nhập Insight Nexus)

## Kịch bản sự cố

Nạn nhân trong sự cố này là `Insight Nexus`, một công ty nghiên cứu thị trường và phân tích dữ liệu quy mô vừa, có trụ sở tại Singapore. Họ cung cấp thông tin tình báo cạnh tranh (competitive intelligence) và phân tích hành vi người tiêu dùng (consumer insights) cho các khách hàng toàn cầu, trong đó có các công ty thuộc Fortune 500 trong lĩnh vực IT và tài chính. Hạ tầng của họ gồm nhiều ứng dụng, server và host, nhưng ta sẽ tập trung vào những thành phần quan trọng, như một stack ứng dụng hướng Internet (internet-facing) dành cho khách hàng, một server ManageEngine dùng cho quản trị IT, và một cổng báo cáo khách hàng (customer reporting portal) viết bằng PHP. Do tính chất công việc, họ trở thành mục tiêu hấp dẫn với những kẻ tấn công nhắm tới việc đánh cắp dữ liệu khách hàng.

Hãy cùng xem xét sự cố này để hiểu một số thách thức mà người xử lý sự cố (incident handler) phải đối mặt. Sự cố này là ví dụ cho những mẫu hình (pattern) được quan sát lặp đi lặp lại trong các sự cố thực tế. Nạn nhân trong kịch bản này là `Insight Nexus`, một công ty nghiên cứu thị trường toàn cầu xử lý dữ liệu cạnh tranh nhạy cảm cho các khách hàng tầm cỡ trong ngành IT. Công ty trở thành mục tiêu của hai nhóm threat actor khác nhau cùng hoạt động đồng thời trong môi trường của mình. Threat actor thứ nhất xâm nhập được khi các quản trị viên hệ thống quên đổi mật khẩu mặc định admin/admin trên một ứng dụng hướng Internet, cụ thể là `ManageEngine ADManager Plus`, sau một lần cập nhật sản phẩm. Lợi dụng điều này, kẻ tấn công đăng nhập thành công, thực hiện trinh sát (reconnaissance), lập bản đồ người dùng và máy tính, và cuối cùng tạo các tài khoản Active Directory đặc quyền mới. Dùng một trong các tài khoản mới tạo, kẻ tấn công pivot sâu hơn vào môi trường và phát hiện một dịch vụ RDP bị lộ ra bên ngoài do cấu hình sai. Khai thác điểm vào đó, chúng mở rộng quyền kiểm soát và cuối cùng dùng Group Policy Object (GPO) để triển khai spyware qua một gói MSI lên nhiều endpoint.

![Sơ đồ luồng giám sát mạng. Bên trái: Internet kết nối tới hai web console — ManageEngine AD Manager và Client Reports Portal (PHP) — nằm trước Firewall. Ở giữa: khối mạng nội bộ gồm Domain Controller, nhiều máy Windows, Database server và các File server. Event log từ AD Manager và các host nội bộ được gửi tới SIEM. Bên phải: SIEM tích hợp với TheHive, TheHive gửi thông báo tới SOC Analyst; analyst thực hiện phân tích, tạo ra Alert và Case.](images/insights.png)

Trong nhiều ngày, các hoạt động này không bị phát hiện. Sự cố lần đầu được phát hiện vào một ngày khi một analyst của đội SOC điều tra một alert trên `TheHive` (nền tảng ứng phó sự cố bảo mật – Security Incident Response Platform) liên quan đến việc tạo một file đáng ngờ tên `checkme.txt` ở thư mục gốc (root) của một web server. Khi điều tra, họ phát hiện file này được cố tình đặt ở đó như một chữ ký — "SilentJackal was here". Artifact bất thường này đã kích hoạt một cuộc điều tra sâu hơn. Điều khiến tình hình phức tạp hơn là đội SOC sau đó nhận ra có hai nhóm threat actor khác nhau cùng hoạt động trong một môi trường. Trong khi nhóm thứ nhất vẫn đang dò xét và triển khai các cơ chế persistence (duy trì truy cập), một actor thứ hai đã xâm nhập một ứng dụng PHP có lỗ hổng từ trước đó, exfiltrate (tuồn ra ngoài) dữ liệu nghiên cứu thị trường nhạy cảm, và giảm đáng kể hoạt động sau khi đạt được mục tiêu, chỉ để lại những kết nối thỉnh thoảng tới một IP bên ngoài.

## Các threat actor

- `Crimson Fox` (threat actor chính): Một nhóm có liên hệ đã biết với việc nhắm mục tiêu vào chuỗi cung ứng (supply chain) ngành IT, bị nghi là được nhà nước hậu thuẫn (state-backed). Nhóm chuyên đánh cắp thông tin đăng nhập (credential theft) và duy trì truy cập lâu dài (long-term persistence) để exfiltrate dữ liệu. Đây là một nhóm có năng lực và dai dẳng, được biết đến qua nhiều cuộc tấn công thành công trước đây liên quan đến chuỗi cung ứng và tình báo doanh nghiệp (corporate intelligence).
- `Silent Jackal` (actor phụ): Một nhóm tội phạm tổ chức lỏng lẻo, tập trung vào việc deface website mang tính cơ hội (opportunistic) và các vụ xâm nhập kiểu proof-of-concept, không nhất thiết vì động cơ tài chính nhưng có tính phá hoại, gây gián đoạn. Thành viên của nhóm này là những kẻ xâm nhập web trình độ thấp.

---

## Môi trường & tài sản quan trọng

### Internet công cộng

- Ứng dụng web bên ngoài (`manage.insightnexus.com`): Ứng dụng web `ManageEngine ADManager Plus` cung cấp khả năng quản lý Active Directory cho các quản trị viên hệ thống của tổ chức. HTTPS (port 443) có thể truy cập từ Internet (cổng quản trị – management portal).
- Client Reports Portal (`portal.insightnexus.com`): Cổng báo cáo cho khách hàng viết bằng PHP (có bật chức năng upload file cho báo cáo).

### Cấu trúc môi trường nội bộ

- `Domain Controller`: DC01.insight.local
- `File Server`: FS01.insight.local (file share: \fs01\projects)
- `Database Server`: DB01.insight.local chứa các database nhạy cảm.
- `Workstations`: Bao gồm dàn máy của developer (từ DEV-001 đến DEV-120), trong đó có một số workstation được cấp quyền cho phép kết nối RDP đến (incoming). Một máy Windows bị lộ RDP ra bên ngoài đã được phát hiện trong quá trình trinh sát: DEV-021 (cấu hình sai).

### Bảo mật

- `firewall` vành đai (perimeter) với cấu hình logging mặc định (**không tích hợp Threat Intelligence**).
- `IDS` cơ bản với tỷ lệ false positive cao.
- Agent `Wazuh` trên hầu hết các host Windows (độ phủ một phần).
- `SIEM` tập trung (Wazuh) thu nhận log Windows Sysmon, Windows Security, log web server và log firewall (thời gian lưu trữ hạn chế).
- `TheHive` được dùng để quản lý case, có sẵn Cortex để làm giàu dữ liệu (enrichment).

---

## Phân tích sự cố

Một quản trị viên hệ thống nhận thấy các kết nối outbound bất thường từ server ManageEngine tới một địa chỉ IP ở Đông Âu trong lúc làm việc trên server để bảo trì theo lịch. Anh ấy gọi cho đội SOC và phối hợp với họ điều tra các alert để tìm dấu hiệu đáng ngờ. Một analyst SOC bắt đầu điều tra các alert và tìm thấy một alert nhắc tới file đáng ngờ `checkme.txt` trên cùng server đó.

---

`Detection Gap: `Có quá nhiều alert về việc tạo file mới trên các server, và alert này đã không được escalate do alert fatigue (quá tải alert). Họ cần giảm bớt false positive và bổ sung thêm bộ lọc.

---

Đội SOC bắt đầu điều tra sự cố này và phát hiện nhiều nỗ lực trinh sát nhắm vào các ứng dụng web bên ngoài.

![Sơ đồ giám sát mạng. Từ Internet, lưu lượng tới hai web console: ManageEngine AD Manager và PHP Client Reports Portal (ghi chú: threat actor đang thực hiện trinh sát), cả hai nằm sau Firewall. Mạng nội bộ gồm Domain Controller, nhiều máy Windows, Database server và các File server. Event log từ AD Manager và các host nội bộ được chuyển tới SIEM. SIEM tích hợp với TheHive, TheHive gửi thông báo tới SOC Analyst; analyst thực hiện phân tích, tạo ra Alert và Case.](images/insights1.png)

Khi điều tra sâu hơn, đội ứng phó (responder) phát hiện vào lúc `2025-10-01 03:12:02`, threat actor `Crimson Fox` đã có được initial access thông qua ManageEngine. Ban đầu, chúng thực hiện các lần thử đăng nhập có chủ đích vào `manage.insightnexus.com`. Chúng phát hiện thông tin đăng nhập mặc định (tức `admin/admin`) vẫn dùng được, nghĩa là hoặc các quản trị viên hệ thống đã quên đổi thông tin đăng nhập mặc định sau một lần cập nhật, hoặc họ để ứng dụng web cho bất kỳ ai trên Internet công cộng truy cập. Kết quả thật đáng tiếc cho tổ chức: kẻ tấn công đã đăng nhập web tương tác (interactive) qua HTTPS. Báo cáo audit đăng nhập (logon audit report) cho thấy hoạt động đăng nhập thành công này.

---

`Organizational oversight: `Dù nhà cung cấp đã đưa ra khuyến cáo (advisory), thông tin đăng nhập mặc định chưa bao giờ được đổi. Xác thực đa yếu tố (MFA) không được bắt buộc, và không có [WAF](https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/) kiểm tra lưu lượng tới endpoint này. Các event đăng nhập của ứng dụng web cũng không được gửi về SIEM tập trung.

![Luồng mạng – SOC. Từ Internet, kẻ tấn công đăng nhập vào ManageEngine AD Manager bằng thông tin đăng nhập mặc định; Internet cũng truy cập được PHP Client Reports Portal nằm sau Firewall. Mạng nội bộ gồm Domain Controller, nhiều máy Windows, Database server và các File server. Event log từ AD Manager và các host nội bộ được gửi tới SIEM. SIEM tích hợp với TheHive, TheHive gửi thông báo tới SOC analyst; analyst thực hiện phân tích, tạo ra alert và case.](images/insights2.png)

Sản phẩm ManageEngine ADManager Plus có một lỗ hổng web Java cho phép thực thi mã từ xa không cần xác thực (unauthenticated remote code execution). Kẻ tấn công lợi dụng lỗ hổng này và thiết lập kênh C2 outbound qua HTTPS tới `103.112.60.117` (một cloud host do kẻ tấn công kiểm soát), ngụy trang thành lưu lượng cập nhật. Sysmon Event ID 3 (Network Connection detected) sau đây đã được ghi lại:

```cmd
Event 3, Sysmon 

Network Connection detected:
UtcTime: 2025-10-01 03:18:32.557
Image: C:\ManageEngine\jre\bin\java.exe
DestinationIp: 103.112.60.117
DestinationPort: 443
```

Vào lúc `2025-10-02 04:02:11`, kẻ tấn công liệt kê (enumerate) người dùng và máy tính trong domain bằng các truy vấn từ console ManageEngine. Tận dụng chỗ đứng (foothold) trên ManageEngine, chúng còn tạo một tài khoản Domain Administrator mới. Trong quá trình enumerate Active Directory, chúng phát hiện một máy Windows 10 (`DEV-021`) có port RDP bị lộ ra Internet công cộng. Máy desktop này thỉnh thoảng được các developer dùng để thực hiện các tác vụ phát triển và release bằng cách RDP trực tiếp vào IP public của nó khi làm việc tại nhà. Kẻ tấn công đã RDP trực tiếp vào máy này bằng tài khoản Domain Administrator vừa tạo.

![Sơ đồ luồng bảo mật mạng. Từ Internet, kẻ tấn công thiết lập C2 và dùng RDP vào một host nội bộ qua Firewall (không tích hợp threat intel). Các web console bị lộ: ManageEngine AD Manager và PHP Client Reports Portal. Bên trong mạng: Domain Controller, nhiều máy Windows (một máy được ghi nhãn DEV-021), Database server và các File server. Event log từ AD Manager và các host nội bộ được gửi tới SIEM. SIEM tích hợp với TheHive, TheHive gửi thông báo tới SOC Analyst; analyst thực hiện phân tích, tạo ra alert và case.](images/insights3.png)

Với hoạt động này, event log sau đã được tạo trong Windows Event Logs với Event ID `4624`.

```cmd
An account was successfully logged on.

 Subject:
    Security ID: SYSTEM
    Account Name: DEV-021$
    Account Domain: INSIGHT
    Time: 2025-10-04T02:03:12Z

 Logon Information:
    Logon Type: 10

 Network Information:
    Workstation Name: DEV-021
    Source Network Address: 103.112.60.117

 New Logon:
    SubjectUserName: insight\svc_deployer
    SourceNetworkAddress: 103.112.60.117
```

Sau khi đăng nhập thành công, kẻ tấn công tiến hành một số hoạt động trinh sát domain. Chúng tìm thấy một số file share đáng chú ý trên file server và đã cố truy cập nhiều lần. Trên file server, chúng tìm được các thư mục dự án của khách hàng chứa báo cáo nháp, dữ liệu khảo sát và dự báo thị trường.

![Luồng tấn công và giám sát mạng. Từ Internet, kẻ tấn công thiết lập C2 và dùng VPN/RDP qua Firewall (không tích hợp threat intel) vào host nội bộ DEV‑021. Các web console bị lộ: ManageEngine AD Manager và PHP Client Reports Portal. Mạng nội bộ gồm Domain Controller, nhiều máy Windows, Database Server và các File Server; dữ liệu nhạy cảm bị truy cập trên các network share. Event log từ AD Manager và các host nội bộ được gửi tới SIEM, SIEM tích hợp với TheHive để gửi thông báo tới SOC Analyst, người thực hiện phân tích và tạo ra alert và case.](images/insights0.png)

Trên file server, nhiều event log đã được tạo, chẳng hạn `5140(S, F): A network share object was accessed`. Tuy nhiên, không có rule nào được tạo để sinh alert riêng cho các event RDP từ IP public này.

Các loại event log này có thể được phát hiện bằng [Sigma rule](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/builtin/security/account_management/win_security_successful_external_remote_rdp_login.yml) sau, ví dụ:

```sigma
title: External Remote RDP Logon from Public IP
id: 259a9cdf-c4dd-4fa2-b243-2269e5ab18a2
related:
    - id: 78d5cab4-557e-454f-9fb9-a222bd0d5edc
      type: derived
status: test
description: Detects successful logon from public IP address via RDP. This can indicate a publicly-exposed RDP port.
references:
    - https://www.inversecos.com/2020/04/successful-4624-anonymous-logons-to.html
    - https://twitter.com/Purp1eW0lf/status/1616144561965002752
author: Micah Babinski (@micahbabinski), Zach Mathis (@yamatosecurity)
date: 2023-01-19
modified: 2024-03-11
tags:
    - attack.initial-access
    - attack.credential-access
    - attack.t1133
    - attack.t1078
    - attack.t1110
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4624
        LogonType: 10
    filter_main_local_ranges:
        IpAddress|cidr:
            - '::1/128'  # IPv6 loopback
            - '10.0.0.0/8'
            - '127.0.0.0/8'
            - '172.16.0.0/12'
            - '192.168.0.0/16'
            - '169.254.0.0/16'
            - 'fc00::/7'  # IPv6 private addresses
            - 'fe80::/10'  # IPv6 link-local addresses
    filter_main_empty:
        IpAddress: '-'
    condition: selection and not 1 of filter_main_*
falsepositives:
    - Legitimate or intentional inbound connections from public IP addresses on the RDP port.
level: medium
```

Sau khi dò xét và quan sát trong một tuần, chúng bắt đầu nén và exfiltrate các dữ liệu đã chọn. Kẻ tấn công đóng gói tài liệu khách hàng bị đánh cắp vào một file tên `diagnostics_data.zip`, một cái tên được chọn để trông giống dữ liệu telemetry thông thường. Archive này sau đó được upload lên host do kẻ tấn công kiểm soát qua HTTPS. Vì tên file giống dữ liệu chẩn đoán (diagnostics) hợp lệ và việc upload dùng HTTPS tiêu chuẩn, nó không lập tức gây báo động. Chiến thuật này làm tăng khả năng kẻ tấn công exfiltrate được dữ liệu trước khi bên phòng thủ kịp escalate.

![Luồng tấn công và giám sát mạng. Từ Internet, kẻ tấn công thiết lập C2 và dùng VPN/RDP qua Firewall vào host nội bộ DEV‑021. Các web console bị lộ: ManageEngine AD Manager và PHP Client Reports Portal. Mạng nội bộ gồm Domain Controller, nhiều máy Windows, Database server và các File server — nơi dữ liệu bị exfiltrate. Event log từ AD Manager và các host nội bộ được gửi tới SIEM, SIEM tích hợp với TheHive để thông báo cho SOC analyst, người thực hiện phân tích và tạo ra alert và case.](images/insights6.png)

Sau đó, vào lúc `2025-10-04 02:10:45`, từ `DEV-021`, chúng thực thi một số script PowerShell dùng thông tin đăng nhập domain administrator để tạo một Group Policy Object (GPO) đẩy một gói MSI (`java-update.msi`) ra toàn domain. Gói MSI này tạo một scheduled task để chạy một tiến trình thực hiện việc theo dõi (spying) và exfiltrate dữ liệu trên các máy.

Các event này cũng được ghi lại trong event log, chẳng hạn việc tạo file `.msi` mới dưới dạng Sysmon Event ID 11.

```cmd
Sysmon Event 11: TargetFilename: C:\Windows\Temp\java-update.msi
```

Ngoài ra, Sysmon Event ID 1 ghi lại command line của việc thực thi file `.msi` ở chế độ nền (background).

```cmd
Sysmon Event 1: Image: C:\Windows\System32\msiexec.exe CommandLine: "msiexec /i C:\Windows\Temp\java-update.msi /quiet"
```

Malware này, với khả năng theo dõi và exfiltrate dữ liệu, được triển khai lên tất cả các máy trong domain bằng GPO.

![Luồng tấn công và giám sát mạng. Từ Internet, kẻ tấn công thiết lập C2 và cài spyware thông qua web console ManageEngine AD Manager bị lộ; spyware sau đó được đẩy ra toàn domain bằng GPO. PHP Client Reports Portal cũng bị lộ. Qua Firewall, VPN/RDP tới host nội bộ DEV‑021 và phần còn lại của mạng: Domain Controller, nhiều máy Windows, Database server và các File server (có thể hiện đường truy cập/exfil dữ liệu). Event log từ AD Manager và các host nội bộ được gửi tới SIEM, SIEM tích hợp với TheHive để gửi thông báo tới SOC Analyst, người thực hiện phân tích và tạo ra alert và case.](images/insights4.png)

Cùng khoảng thời gian đó, một threat actor khác, `Silent Jackal`, cũng thực hiện một số hoạt động trên một cổng báo cáo viết bằng PHP riêng biệt. Server này có một lỗ hổng upload file chưa được vá, và threat actor đã khai thác nó để giành quyền truy cập vào server. Silent Jackal upload một file vào thư mục gốc của web server. Hoạt động của chúng dường như chỉ giới hạn ở việc để lại file đánh dấu (marker file) `checkme.txt`. Điều này tạo ra nhiễu (noise) trong môi trường và cung cấp cho bên phòng thủ manh mối đầu tiên về việc bị xâm nhập.

![Sơ đồ luồng tấn công và giám sát. Kẻ tấn công từ Internet lạm dụng một lỗ hổng upload file đã bị khai thác trong PHP Client Reports Portal (web console) và có thể tiếp cận mạng nội bộ qua Firewall. Mạng nội bộ gồm Domain Controller, nhiều máy Windows, Database Server và các File Server. ManageEngine AD Manager (web console) và các host nội bộ gửi event log tới SIEM. SIEM tích hợp với TheHive, TheHive gửi thông báo tới SOC analyst, người thực hiện phân tích và tạo ra alert và case.](images/insights5.png)

Tuy nhiên, threat actor này không tiến xa hơn bước initial access. Đây nhiều khả năng là một vụ xâm nhập trình độ thấp nhằm báo hiệu sự hiện diện hơn là gây thiệt hại ngay lập tức.

`Organizational oversight: `Không có giám sát bằng web application firewall và không đánh giá lỗ hổng (vulnerability assessment) định kỳ cho các portal hướng Internet.

Crimson Fox giảm bớt các hoạt động cường độ cao, chỉ thỉnh thoảng gửi beacon tần suất thấp tới 103.112.60.117 để kiểm tra lệnh mới. Silent Jackal cũng giảm hoạt động tương tự.

---

## Các hành động ứng phó sự cố tức thời

Phát hiện cụ thể đầu tiên là file `checkme.txt` do một analyst SOC tìm ra. Riêng file này bình thường sẽ chỉ có mức ưu tiên thấp, nhưng analyst SOC khi thực hiện correlation (tương quan dữ liệu) đã thấy trong cùng khung thời gian có các event ManageEngine với lưu lượng outbound bất thường và nhiều event đăng nhập từ một IP nước ngoài lạ.

Việc correlation được thực hiện trên các dữ liệu sau:

- Các lần đăng nhập admin ManageEngine thành công từ IP nước ngoài.
- Sysmon ghi nhận process creation của `msiexec` cài đặt một MSI trên nhiều host.
- Log LDAP enumeration và các thay đổi GPO.
- Log nén file và upload trên file server.
- HTTPS outbound tới một địa chỉ IP bất thường.

Sau khi correlation, analyst SOC lập tức escalate sự cố lên đội ứng phó sự cố (incident response team) và mở một case trong `TheHive`. Các hành động và phát hiện sau đã hoàn tất quá trình điều tra và ứng phó:

1. `Case creation and triage`
   - SOC tạo một case TheHive với tiêu đề “Insight Nexus — ManageEngine Compromise,” liên kết tất cả các alert liên quan (đăng nhập admin ManageEngine, event Sysmon msiexec, LDAP enumeration, upload trên file server, và event `checkme.txt` trên portal), và phân công vai trò: Triage Analyst, Forensics Lead, Containment Lead và Communications Lead.
   - Mức ưu tiên được đặt là Critical do đã xác nhận có data exfiltration.
2. `Containment — network controls`
   - Chặn lưu lượng outbound tới `103.112.60.117` tại firewall vành đai và trên các host-based firewall. Bổ sung các rule chặn egress tạm thời cho các IP của kẻ tấn công.
   - Thêm một IDS signature để cảnh báo khi có kết nối tới `103.112.60.117` và các endpoint tương tự.
3. `Containment — credential & account actions`
   - Vô hiệu hoá tài khoản admin ManageEngine và rotate (thay mới) toàn bộ thông tin đăng nhập đặc quyền cao bị lộ trong log (service account, tài khoản deployer, và bất kỳ tài khoản nào có hoạt động đáng ngờ).
   - Giới hạn web console ManageEngine chỉ cho phép truy cập nội bộ.
   - Bắt buộc đổi mật khẩu và thu hồi ngay các session đang hoạt động khi có thể.
4. `Host isolation`
   - Cô lập `manage.insightnexus.com`, `DEV-021` và mọi máy có dấu hiệu đã cài MSI khỏi mạng production để thu thập dữ liệu forensic (chặn truy cập mạng, nhưng vẫn bảo toàn theo cách cho phép phân tích).
   - Tạm dừng các scheduled task và vô hiệu hoá các đợt triển khai khởi tạo từ GPO cho tới khi xác nhận đã khắc phục (remediation) xong.
5. `Collect forensic artifacts`
   - Trên các host đã cô lập, thu thập bộ nhớ volatile (volatile memory), danh sách tiến trình, registry hive và disk image. Export log audit của ManageEngine và access log của web server với đầy đủ timestamp.
   - Lưu giữ bản sao của file MSI (`java-update.msi`), gói dữ liệu nén đã bị exfiltrate (`diagnostics_data.zip`), và mọi file web shell tìm thấy trong các thư mục của ứng dụng quản trị.

## Mapping sang MITRE ATT&CK

- `Reconnaissance`: Quét các tài sản public; MITRE `T1595` (Active Scanning).
- `Weaponization / Initial Access`: Thông tin đăng nhập mặc định của ManageEngine (`T1078.004` - Valid Accounts), khai thác chức năng upload của PHP (`T1190` - Exploit Public-Facing Application).
- `Delivery / Exploitation`: Upload web shell, thực thi lệnh qua console; (`T1505` - Server Software Component).
- `Installation / Persistence`: Scheduled task, service, MSI triển khai qua GPO (`T1547`, `T1543`, `T1069`).
- `Command & Control`: HTTPS tới IP do kẻ tấn công kiểm soát (`T1071.001` - Web Protocols).
- `Action on Objective / Exfiltration`: Nén và upload dữ liệu dự án (`T1560`/`T1041`).

## Bài học rút ra (Lessons Learned)

Các bài học rút ra như sau:

- `Default credentials` (thông tin đăng nhập mặc định) trên các ứng dụng hướng Internet vẫn là một trong những sơ suất đơn giản nhất nhưng gây thiệt hại nặng nề nhất.
- `Multiple concurrent threat actors` (nhiều threat actor hoạt động đồng thời) có thể cùng hiện diện trong một môi trường, với động cơ khác nhau — một bên mang tính cơ hội, một bên nhắm mục tiêu rất cụ thể. Điều này khiến việc ứng phó phức tạp hơn vì bên phòng thủ có thể đánh giá thấp mức độ nghiêm trọng nếu chỉ nhìn thấy kẻ xâm nhập “ồn ào”.
- `Failure to correlate alerts` (không correlate alert) giữa các đội làm chậm containment, cho các actor cao cấp thêm thời gian để đạt mục tiêu.
- `Post-incident monitoring` (giám sát sau sự cố) phải bao gồm việc quét tìm các cơ chế persistence, vì xoá file đánh dấu của kẻ tấn công không loại bỏ được nguyên nhân gốc (root cause).
