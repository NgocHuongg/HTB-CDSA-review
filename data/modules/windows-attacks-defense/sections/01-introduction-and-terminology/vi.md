# Introduction and Terminology (Giới thiệu và thuật ngữ)


## Active Directory là gì?

`Active Directory` (`AD`) là một directory service (dịch vụ thư mục) dành cho môi trường doanh nghiệp Windows, được Microsoft chính thức phát hành năm 2000 cùng Windows Server 2000. Microsoft liên tục cải tiến AD qua mỗi phiên bản hệ điều hành server mới. Dựa trên các giao thức x.500 và LDAP ra đời trước nó (đến nay vẫn được dùng dưới một dạng nào đó), AD là một cấu trúc phân tán, phân cấp, cho phép quản lý tập trung tài nguyên của tổ chức, bao gồm user, máy tính, group, thiết bị mạng và file share, group policy, thiết bị và trust. AD cung cấp các chức năng xác thực (authentication), ghi nhận (accounting) và phân quyền (authorization) trong môi trường doanh nghiệp Windows. AD cũng cho phép quản trị viên quản lý quyền hạn và quyền truy cập vào các tài nguyên mạng.

Active Directory phổ biến đến mức nó là giải pháp quản lý định danh và truy cập (Identity and Access management – `IAM`) được dùng nhiều nhất thế giới, bỏ xa các giải pháp khác. Vì vậy, phần lớn ứng dụng doanh nghiệp đều tích hợp và vận hành trơn tru với Active Directory. Active Directory là dịch vụ quan trọng nhất trong bất kỳ doanh nghiệp nào. Một môi trường Active Directory bị xâm nhập đồng nghĩa với việc kẻ tấn công có quyền truy cập không giới hạn vào toàn bộ hệ thống và dữ liệu của nó, vi phạm bộ ba `CIA` (`Confidentiality` – tính bảo mật, `Integrity` – tính toàn vẹn, và `Availability` – tính sẵn sàng). Các nhà nghiên cứu liên tục phát hiện và công bố lỗ hổng trong AD.
Thông qua các lỗ hổng này, kẻ tấn công có thể dùng loại malware gọi là ransomware để "bắt cóc" dữ liệu của tổ chức đòi tiền chuộc bằng cách thực hiện các thao tác mật mã (`encryption`) lên dữ liệu, khiến dữ liệu trở nên vô dụng cho tới khi tổ chức trả tiền để mua khoá giải mã (`not advised` – không khuyến khích) hoặc lấy được khoá giải mã nhờ sự trợ giúp của các chuyên gia bảo mật IT. Tuy nhiên, nếu nghĩ lại, việc Active Directory bị xâm nhập có nghĩa là mọi ứng dụng, hệ thống và dữ liệu đều bị xâm nhập, chứ không chỉ một hệ thống hay dịch vụ đơn lẻ.

Hãy cùng xem các lỗ hổng được công bố công khai trong ba năm qua (2020 đến 2022). Microsoft có hơn 3000 lỗ hổng, và khoảng 9000 kể từ năm 1999, cho thấy sự tăng trưởng đáng kinh ngạc về nghiên cứu và lỗ hổng trong những năm gần đây. Cách rõ ràng nhất để giữ Active Directory an toàn là đảm bảo có quy trình `Patch Management` (quản lý bản vá) đúng đắn, vì hiện nay quản lý bản vá đang là thách thức với các tổ chức trên toàn thế giới. Trong module này, ta sẽ giả định Patch Management đã được làm đúng (Patch Management đúng đắn là yếu tố then chốt để có thể chống chịu được một vụ xâm nhập) và tập trung vào các cuộc tấn công và lỗ hổng khác mà ta có thể gặp.  Ta sẽ tập trung trình bày các cuộc tấn công lạm dụng những cấu hình sai (misconfiguration) phổ biến và các tính năng của Active Directory, đặc biệt là những thứ rất phổ biến/quen thuộc nhưng lại cực kỳ khó loại bỏ. Ngoài ra, các biện pháp bảo vệ được bàn ở đây nhằm trang bị cho ta trong tương lai, giúp ta xây dựng "vệ sinh" an ninh mạng (cyber hygiene) đúng đắn. Nếu bạn đang nghĩ tới `Defence in depth` (phòng thủ theo chiều sâu), `Network segmentation` (phân đoạn mạng) và những thứ tương tự, thì bạn đang đi đúng hướng.

Nếu đây là lần đầu bạn tìm hiểu về Active Directory hoặc nghe những thuật ngữ này, hãy xem module [Intro to Active Directory](https://academy.hackthebox.com/module/details/74) để tìm hiểu sâu hơn về cấu trúc và chức năng của AD, các AD object, v.v. Và cả module [Active Directory - Enumeration and Attacks](https://academy.hackthebox.com/module/details/143) để củng cố kiến thức và có cái nhìn tổng quan về một số cuộc tấn công phổ biến.

---

## Ôn lại kiến thức

Để chắc chắn ta đã quen với các khái niệm cơ bản, hãy cùng ôn nhanh lại các thuật ngữ.

`domain` là một nhóm các object dùng chung một cơ sở dữ liệu AD, chẳng hạn như user hoặc thiết bị.

`tree` là một hoặc nhiều domain được nhóm lại. Hãy hình dung các domain `test.local`, `staging.test.local` và `preprod.test.local` sẽ nằm trong cùng một tree dưới `test.local`. Theo cách gọi này, có thể tồn tại nhiều tree.

`forest` là một nhóm gồm nhiều tree. Đây là cấp cao nhất, bao gồm tất cả các domain.

`Organizational Units` (`OU`) là các container (vùng chứa) của Active Directory, chứa các group user, máy tính (Computer) và các OU khác.

`Trust` có thể được định nghĩa là quan hệ truy cập giữa các tài nguyên, cho phép giành quyền/quyền truy cập vào tài nguyên ở một domain khác.
  
`Domain Controller` (nhìn chung) là "Admin" của Active Directory, được dùng để thiết lập toàn bộ Directory. Vai trò của Domain Controller là cung cấp xác thực (Authentication) và phân quyền (Authorization) cho các dịch vụ và user khác nhau. Trong Active Directory, Domain Controller có mức ưu tiên cao nhất và có nhiều thẩm quyền/đặc quyền nhất.

`Active Directory Data Store` chứa các file cơ sở dữ liệu và các process lưu trữ, quản lý thông tin thư mục cho user, dịch vụ và ứng dụng. Active Directory Data Store chứa file `NTDS.DIT` — file quan trọng nhất trong một môi trường AD; các domain controller lưu nó trong thư mục `%SystemRoot%\NTDS`.

Một `regular AD user account` (tài khoản user AD thông thường) không có thêm đặc quyền nào vẫn có thể dùng để enumerate (liệt kê) phần lớn các object trong AD, bao gồm nhưng không giới hạn:
- `Domain Computers`
- `Domain Users`
- `Domain Group Information`
- `Default Domain Policy`
- `Domain Functional Levels`
- `Password Policy`
- `Group Policy Objects` (GPO)
- `Kerberos Delegation`
- `Domain Trusts`
- `Access Control Lists` (ACL)

Mặc dù cài đặt của AD cho phép sửa đổi/chặn hành vi mặc định này, hệ quả của việc đó có thể khiến ứng dụng, dịch vụ và chính Active Directory ngừng hoạt động hoàn toàn.

`LDAP` là giao thức mà các hệ thống trong môi trường mạng dùng để giao tiếp với Active Directory. (Các) Domain Controller chạy LDAP và liên tục lắng nghe các request từ mạng.

`Authentication` (xác thực) trong môi trường Windows:
- Username/Password, được lưu trữ hoặc truyền đi dưới dạng password hash (`LM`, `NTLM`, `NetNTLMv1`/`NetNTLMv2`).
- Ticket `Kerberos` (bản triển khai giao thức Kerberos của Microsoft). Kerberos đóng vai trò bên thứ ba tin cậy, phối hợp với domain controller (DC) để xác thực các client đang muốn truy cập dịch vụ. Luồng xác thực Kerberos xoay quanh các ticket — đóng vai trò bằng chứng định danh dạng mật mã mà client trao đổi với nhau, với các dịch vụ và với DC.
- `Authentication over LDAP` (xác thực qua LDAP). Có thể xác thực bằng username/password truyền thống hoặc bằng certificate của user hay máy tính.

`Key Distribution Center` (`KDC`): một dịch vụ Kerberos được cài trên DC, có nhiệm vụ tạo ticket. Các thành phần của KDC là authentication server (AS) và ticket-granting server (TGS).

`Kerberos Tickets` là các token đóng vai trò bằng chứng định danh (do KDC tạo ra):
- `TGT` là bằng chứng cho thấy client đã gửi thông tin user hợp lệ tới KDC.
- `TGS` được tạo cho từng dịch vụ mà client (có TGT hợp lệ) muốn truy cập.

`KDC key` là khoá mã hoá chứng minh TGT là hợp lệ. AD tạo KDC key từ password đã hash của tài khoản `KRBTGT` — tài khoản đầu tiên được tạo trong một AD domain. Dù là một user bị vô hiệu hoá (disabled), KRBTGT có mục đích sống còn là lưu trữ các secret — những khoá được sinh ngẫu nhiên dưới dạng password hash. Không ai có thể biết giá trị password thực sự là gì (kể cả khi ta cố cấu hình nó thành một giá trị đã biết, AD sẽ tự động ghi đè bằng một giá trị ngẫu nhiên).

Mỗi domain đều chứa các group `Domain admins` và `Administrators` — những group có đặc quyền cao nhất với phạm vi truy cập rộng. Theo mặc định, AD thêm thành viên của Domain admins vào làm Administrator trên tất cả các máy đã join domain, và do đó cấp cho họ quyền đăng nhập vào các máy đó. Trong khi group 'Administrators' của domain theo mặc định chỉ có thể đăng nhập vào các Domain Controller, họ có thể quản lý bất kỳ object nào trong Active Directory (ví dụ: tất cả các server, và do đó có thể tự cấp cho mình quyền đăng nhập vào chúng). Domain cao nhất trong một forest còn chứa một object là group `Enterprise Admins`, có quyền trên tất cả các domain trong forest. 

Các group mặc định trong Active Directory có đặc quyền rất cao và tiềm ẩn rủi ro. Ví dụ, xét group `Account Operators`. Khi hỏi các admin AD lý do gán group này cho user/super user, họ sẽ trả lời rằng nó giúp công việc của 'Service Desk' dễ dàng hơn vì khi đó họ có thể reset password của user. Thay vì tạo một group mới và ủy quyền (delegate) đúng quyền cụ thể đó cho các Organizational Unit chứa tài khoản user, họ vi phạm nguyên tắc đặc quyền tối thiểu (principle of least privilege) và đặt tất cả user vào vòng nguy hiểm. Kéo theo đó là một đường leo thang (escalation path) từ Account Operators lên Domain Admins, phổ biến nhất là thông qua các tài khoản user 'MSOL_' mà Azure AD Connect tạo ra khi cài đặt. Các tài khoản này được đặt trong container mặc định 'Users', nơi 'Account operators' có thể sửa đổi các user object. 

Cần nhấn mạnh rằng Windows có nhiều logon type (kiểu đăng nhập): là 'cách' user đăng nhập vào một máy, ví dụ có thể là interactive khi user có mặt trực tiếp tại thiết bị, hoặc từ xa qua RDP. Cần biết về các logon type vì chúng sẽ để lại 'dấu vết' trên (các) hệ thống được truy cập. Dấu vết này chính là username và password đã dùng. Theo kinh nghiệm chung, các logon type ngoại trừ 'Network logon, type 3' đều để lại thông tin đăng nhập (credential) trên hệ thống được xác thực và kết nối tới. Microsoft cung cấp danh sách đầy đủ các logon type [tại đây](https://learn.microsoft.com/en-us/windows-server/identity/securing-privileged-access/reference-tools-logon-types).

Để tương tác với Active Directory — vốn nằm trên các Domain Controller — ta phải nói ngôn ngữ của nó, tức LDAP. Mọi truy vấn đều diễn ra bằng cách gửi một thông điệp LDAP được tạo đặc biệt tới Domain Controller, chẳng hạn để lấy thông tin user hay danh sách thành viên của một group. Ngay từ những ngày đầu, Microsoft đã nhận ra LDAP không phải là một ngôn ngữ 'đẹp đẽ', và họ phát hành các công cụ đồ hoạ có thể trình bày dữ liệu trên giao diện thân thiện và chuyển các 'cú click chuột' thành LDAP query. Microsoft phát triển `Remote Server Administration Tools` (RSAT), cho phép tương tác với Active Directory cục bộ trên Domain Controller hoặc từ xa từ một computer object khác. Các công cụ phổ biến nhất là `Active Directory Users and Computers` (cho phép dễ dàng xem/di chuyển/chỉnh sửa/tạo các object như user, group và máy tính) và `Group Management Policy` (cho phép tạo và sửa đổi Group policy).

Các cổng mạng quan trọng trong bất kỳ môi trường Windows nào gồm (ghi nhớ chúng là cực kỳ có lợi):

- 53: `DNS`.
- 88: `Kerberos`.
- 135: `WMI`/`RPC`.
- 137-139 & 445: `SMB`.
- 389 & 636: `LDAP`.
- 3389: `RDP`
- 5985 & 5986: `PowerShell Remoting` (`WinRM`)

---

## Góc nhìn thực tế

Mọi tổ chức, khi đã (cố gắng) nâng cao mức độ trưởng thành (maturity) của mình vào một thời điểm nào đó, đều đã trải qua các bài tập phân loại hệ thống. Việc phân loại xác định mức độ `importance` (quan trọng) của từng hệ thống đối với hoạt động kinh doanh, chẳng hạn như `ERP`, `CRM` và `backups`. Doanh nghiệp dựa vào đó để đạt được mục tiêu, và điều này khác nhau đáng kể giữa các tổ chức. Trong Active Directory, mọi role, dịch vụ và tính năng bổ sung được 'thêm' lên trên những gì có sẵn mặc định đều phải được phân loại. Việc phân loại này là cần thiết để đảm bảo ta đặt ra ngưỡng xác định dịch vụ nào, nếu bị xâm nhập, sẽ gây rủi ro leo thang tới phần còn lại của Active Directory. Theo góc nhìn thiết kế này, ta cần đảm bảo mọi dịch vụ cho phép leo thang trực tiếp (hoặc gián tiếp) đều được đối xử như thể nó là một Domain Controller/Active Directory. Active Directory rất đồ sộ, phức tạp và nhiều tính năng — rủi ro leo thang tiềm ẩn ở khắp mọi nơi. Trong một tổ chức doanh nghiệp, Active Directory sẽ cung cấp các dịch vụ như DNS, PKI và Endpoint Configuration Manager. Nếu kẻ tấn công giành được quyền quản trị trên các dịch vụ này, chúng sẽ gián tiếp có cách leo thang đặc quyền lên ngang Administrator của `entire forest` (toàn bộ forest). Ta sẽ minh hoạ điều này qua một số attack path được mô tả ở phần sau của module.

Tuy nhiên, Active Directory có những hạn chế. Đáng tiếc là những hạn chế này lại là điểm 'yếu' và mở rộng attack surface (bề mặt tấn công) của ta — có cái sinh ra do độ phức tạp, có cái do thiết kế, và có cái do di sản (legacy) và khả năng tương thích ngược. Để đầy đủ, dưới đây là ba ví dụ, mỗi loại một ví dụ:

1) `Complexity` (độ phức tạp) - Ví dụ đơn giản nhất là xác định thành viên của các group lồng nhau (nested group). Rất dễ bị rối khi tìm xem ai là thành viên của một group, group đó lại là thành viên của group khác, và group khác đó lại là thành viên của một group nữa. Dù bạn có thể nghĩ chuỗi này rồi cũng sẽ kết thúc, nhiều môi trường có mọi 'Domain user' đều gián tiếp là thành viên của 'Domain Admins'.

2) `Design` (thiết kế) - Active Directory cho phép quản lý máy từ xa thông qua Group Policy Objects (GPO). AD lưu GPO trong một network share/thư mục đặc biệt tên là `SYSVOL`, nơi tất cả các thiết bị đã join domain kéo về những cài đặt được áp dụng cho chúng. Vì đây là thư mục chia sẻ qua mạng, client truy cập SYSVOL qua giao thức SMB và truyền thông tin được lưu trữ.  Do đó, để một máy dùng được cài đặt mới, nó phải gọi tới Domain Controller và kéo cài đặt từ SYSVOL — đây là một quy trình có hệ thống, theo mặc định diễn ra mỗi 90 phút. Mọi thiết bị đều phải 'nhìn thấy' một Domain Controller để kéo dữ liệu này về. Nhược điểm của điều này là giao thức SMB cũng cho phép thực thi code (một remote command shell, nơi các lệnh sẽ được thực thi trên Domain Controller), nên chỉ cần có một bộ credential hợp lệ, ta luôn có thể thực thi code từ xa qua SMB trên các Domain Controller. Cổng/giao thức này mở cho tất cả các máy hướng tới Domain Controller. (Ngoài ra, SMB  không phù hợp lắm (nói chung là cả Active Directory) với các khái niệm zero-trust.) Nếu kẻ tấn công có một bộ credential đặc quyền tốt, chúng có thể thực thi code dưới danh nghĩa tài khoản đó trên các Domain Controller qua SMB (ít nhất là vậy!).

3) `Legacy` (di sản) - Windows được tạo ra với một trọng tâm chính: chạy được ngay (out of the box) cho phần lớn khách hàng của Microsoft. Windows `not` (không) an toàn theo mặc định. Một ví dụ về di sản là Windows được phát hành kèm các giao thức broadcast tương tự DNS là `NetBIOS` và `LLMNR` được bật sẵn theo mặc định. Các giao thức này được dùng khi DNS gặp lỗi. Tuy nhiên, chúng vẫn hoạt động ngay cả khi DNS không lỗi. Hơn nữa, do thiết kế của chúng, chúng broadcast credential của user trên đường truyền (username, password, password hash), và có thể cung cấp credential đặc quyền cho bất kỳ ai đang lắng nghe trên đường truyền chỉ đơn giản bằng việc có mặt ở đó. [Bài blog này](https://www.a2secure.com/en/blog/how-to-use-responder-to-capture-netntlm-and-grab-a-shell/) minh hoạ việc lạm dụng để bắt credential trên đường truyền.
