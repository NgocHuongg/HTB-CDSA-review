# Windows Forensics Overview (Tổng quan về Windows Forensics)

Trong phần này, ta sẽ điểm qua ngắn gọn các artifact quan trọng của Windows và các quy trình forensic.

## NTFS

NTFS (New Technology File System) là hệ thống file độc quyền do Microsoft phát triển, thuộc dòng hệ điều hành Windows NT. Nó được giới thiệu cùng với Windows NT 3.1 vào năm 1993, và từ đó trở thành hệ thống file mặc định và được dùng rộng rãi nhất trên các hệ điều hành Windows hiện đại, bao gồm Windows XP, Windows 7, Windows 8, Windows 10 và các phiên bản server tương ứng. 

NTFS được thiết kế để khắc phục một số hạn chế của hệ thống file tiền nhiệm là FAT (File Allocation Table). Nó bổ sung nhiều tính năng và cải tiến giúp nâng cao độ tin cậy, hiệu năng, bảo mật và khả năng lưu trữ của hệ thống file. 

Dưới đây là một số forensic artifact quan trọng mà điều tra viên số thường phân tích khi làm việc với hệ thống file NTFS:
- `File Metadata`: NTFS lưu trữ metadata rất chi tiết cho mỗi file, bao gồm thời gian tạo, thời gian sửa đổi, thời gian truy cập và thông tin thuộc tính (như thuộc tính read-only, hidden hoặc system file). Phân tích các timestamp này có thể giúp xây dựng timeline và tái dựng hoạt động của người dùng.
- `MFT Entries`: Master File Table (MFT) là thành phần cốt lõi của NTFS, lưu metadata của tất cả file và thư mục trên một volume. Kiểm tra các MFT entry cho ta biết tên file, kích thước, timestamp và vị trí lưu dữ liệu. Khi file bị xoá, MFT entry của nó được đánh dấu là còn trống (available), nhưng dữ liệu vẫn có thể nằm trên ổ đĩa cho tới khi bị ghi đè. 
- `File Slack and Unallocated Space`: Vùng chưa cấp phát (unallocated space) trên một volume NTFS có thể chứa phần còn sót lại của các file đã xoá hoặc các mảnh dữ liệu. File slack là phần không dùng đến của một cluster, có thể chứa dữ liệu của một file trước đó. Các công cụ digital forensic có thể giúp khôi phục và phân tích dữ liệu từ những vùng này.
- `File Signatures`: Header và signature của file có thể giúp xác định loại file ngay cả khi phần mở rộng (extension) đã bị đổi hoặc che giấu. Thông tin này rất quan trọng để tái dựng các loại file có trên hệ thống.
- `USN Journal`: Update Sequence Number (USN) Journal là một log do NTFS duy trì để ghi lại các thay đổi đối với file và thư mục. Điều tra viên forensic có thể phân tích USN Journal để theo dõi việc sửa đổi, xoá và đổi tên file.
- `LNK Files`: File shortcut của Windows (file LNK) chứa thông tin về file hoặc chương trình đích, cùng với timestamp và metadata. Các file này có thể cho biết những file được truy cập gần đây hoặc những chương trình đã được thực thi.
- `Prefetch Files`: File prefetch được Windows tạo ra để cải thiện tốc độ khởi động ứng dụng. Các file này có thể cho biết chương trình nào đã chạy trên hệ thống và lần chạy gần nhất là khi nào.
- `Registry Hives`: Tuy không liên quan trực tiếp đến hệ thống file, các registry hive của Windows chứa thông tin cấu hình và hệ thống quan trọng. Hoạt động độc hại hoặc thay đổi trái phép có thể để lại dấu vết trong registry, và điều tra viên forensic phân tích chúng để hiểu các thay đổi trên hệ thống.
- `Shellbags`: Shellbags là các registry entry lưu thiết lập hiển thị thư mục, như vị trí cửa sổ và tuỳ chọn sắp xếp. Phân tích shellbags có thể cho thấy thói quen duyệt thư mục của người dùng và có thể xác định được các thư mục đã truy cập.
- `Thumbnail Cache`: Thumbnail cache lưu các bản xem trước thu nhỏ của hình ảnh và tài liệu. Các cache này có thể cho thấy những file đã được xem gần đây, kể cả khi file gốc đã bị xoá.
- `Recycle Bin`: Recycle Bin chứa các file đã bị xoá khỏi hệ thống file. Phân tích Recycle Bin có thể giúp khôi phục file đã xoá và hiểu thêm về hành động của người dùng.
- `Alternate Data Streams (ADS)`: ADS là các luồng dữ liệu (stream) bổ sung gắn với file. Kẻ tấn công có thể dùng ADS để giấu dữ liệu, nên điều tra viên forensic cần kiểm tra các stream này để đảm bảo phân tích toàn diện.
- `Volume Shadow Copies`: NTFS hỗ trợ Volume Shadow Copies, tức các bản snapshot của hệ thống file tại những thời điểm khác nhau. Các bản sao này có giá trị cho việc khôi phục dữ liệu và phân tích các thay đổi theo thời gian.
- `Security Descriptors and ACLs`: Access Control List (ACL) và security descriptor xác định quyền trên file và thư mục. Phân tích các artifact này giúp hiểu quyền truy cập của người dùng và các vi phạm bảo mật tiềm ẩn.

## Windows Event Logs

`Windows Event Logs` là một phần nội tại của hệ điều hành Windows, lưu log từ nhiều thành phần khác nhau của hệ thống, bao gồm chính hệ thống, các ứng dụng chạy trên nó, ETW provider, service và các thành phần khác.

Cơ chế ghi log sự kiện của Windows cung cấp khả năng ghi log toàn diện cho lỗi ứng dụng, sự kiện bảo mật và thông tin chẩn đoán. Là người làm an ninh mạng, ta tận dụng rất nhiều các log này cho việc phân tích và phát hiện xâm nhập (intrusion detection).

Các tactic của kẻ tấn công — từ lúc xâm nhập ban đầu bằng malware hoặc các exploit khác, đến truy cập credential, leo thang đặc quyền (privilege elevation) và lateral movement bằng các công cụ có sẵn của hệ điều hành Windows — thường được ghi lại trong Windows event logs.

Bằng cách xem các Windows event log hiện có, điều tra viên có thể nắm được khá rõ những gì đang được ghi log và thậm chí tìm kiếm các log entry cụ thể. Để truy cập trực tiếp các log nhằm phân tích offline, điều tra viên nên vào đường dẫn lưu log mặc định tại `C:\Windows\System32\winevt\logs`.

Việc phân tích Windows Event Logs đã được đề cập trong các module `Windows Event Logs & Finding Evil` và `YARA & Sigma for SOC Analysts`.

## Execution Artifacts

`Windows execution artifacts` là các dấu vết và bằng chứng còn lại trên hệ điều hành Windows khi chương trình và process được thực thi. Các artifact này cung cấp thông tin giá trị về việc thực thi ứng dụng, script và các thành phần phần mềm khác, có thể rất quan trọng trong điều tra digital forensics, incident response và phân tích an ninh mạng. Bằng cách kiểm tra execution artifact, điều tra viên có thể tái dựng timeline, xác định hoạt động độc hại và xác lập các mẫu hành vi. Dưới đây là một số loại Windows execution artifact phổ biến:
- `Prefetch Files`: Windows duy trì một thư mục prefetch chứa metadata về việc thực thi các ứng dụng. File prefetch ghi lại các thông tin như đường dẫn file, số lần thực thi và timestamp của các lần ứng dụng được chạy. Phân tích file prefetch có thể cho thấy lịch sử các chương trình đã thực thi và thứ tự chạy của chúng.
- `Shimcache`: Shimcache là một cơ chế của Windows ghi lại thông tin về việc thực thi chương trình để hỗ trợ tương thích và tối ưu hiệu năng. Nó ghi lại các chi tiết như đường dẫn file, timestamp thực thi và các cờ (flag) cho biết chương trình đã được thực thi hay chưa. Shimcache có thể giúp điều tra viên xác định các chương trình được thực thi gần đây và các file liên quan.
- `Amcache`: Amcache là một cơ sở dữ liệu được giới thiệu từ Windows 8, lưu thông tin về các ứng dụng đã cài đặt và các file thực thi. Nó bao gồm các chi tiết như đường dẫn file, kích thước, chữ ký số (digital signature) và timestamp của lần thực thi gần nhất. Phân tích Amcache có thể cho biết lịch sử thực thi chương trình và xác định phần mềm có khả năng đáng ngờ hoặc trái phép.
- `UserAssist`: UserAssist là một registry key lưu thông tin về các chương trình do người dùng thực thi. Nó ghi lại các chi tiết như tên ứng dụng, số lần thực thi và timestamp. Phân tích UserAssist có thể cho thấy lịch sử các ứng dụng đã thực thi và hoạt động của người dùng.
- `RunMRU Lists`: Các danh sách RunMRU (Most Recently Used) trong Windows Registry lưu thông tin về các chương trình được thực thi gần đây từ nhiều vị trí khác nhau, chẳng hạn các key `Run` và `RunOnce`. Các danh sách này có thể cho biết chương trình nào đã chạy, chạy khi nào, và có thể hé lộ hoạt động của người dùng.
- `Jump Lists`: Jump Lists lưu thông tin về các file, thư mục và tác vụ được truy cập gần đây gắn với từng ứng dụng cụ thể. Chúng có thể giúp hiểu hoạt động của người dùng và các file được dùng gần đây.
- `Shortcut (LNK) Files`: File shortcut có thể chứa thông tin về file thực thi đích, đường dẫn file, timestamp và tương tác của người dùng. Phân tích file LNK có thể cho biết chi tiết về các chương trình đã thực thi và bối cảnh chúng được chạy.
- `Recent Items`: Thư mục Recent Items lưu danh sách các file mở gần đây. Nó có thể cung cấp thông tin về các tài liệu được truy cập gần đây và hoạt động của người dùng.
- `Windows Event Logs`: Nhiều Windows event log, như log Security, Application và System, ghi lại các event liên quan đến việc thực thi chương trình, bao gồm tạo và kết thúc process, ứng dụng bị crash và nhiều thứ khác.

|Artifact|Vị trí/Registry Key|Dữ liệu lưu trữ|
|-------|-------|-------|
|Prefetch Files|C:\Windows\Prefetch|Metadata về các ứng dụng đã thực thi (đường dẫn file, timestamp, số lần thực thi)|
|Shimcache|Registry: HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\AppCompatCache|Chi tiết thực thi chương trình (đường dẫn file, timestamp, flag)|
|Amcache|C:\Windows\AppCompat\Programs\Amcache.hve (Registry Hive dạng nhị phân)|Chi tiết ứng dụng (đường dẫn file, kích thước, chữ ký số, timestamp)|
|UserAssist|Registry: HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist|Chi tiết chương trình đã thực thi (tên ứng dụng, số lần thực thi, timestamp)|
|RunMRU Lists|Registry: HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU|Các chương trình được thực thi gần đây và command line của chúng|
|Jump Lists|Thư mục riêng của từng user (vd: %AppData%\Microsoft\Windows\Recent)|Các file, thư mục và tác vụ gắn với ứng dụng được truy cập gần đây|
|Shortcut (LNK) Files|Nhiều vị trí khác nhau (vd: Desktop, Start Menu)|File thực thi đích, đường dẫn file, timestamp, tương tác của người dùng|
|Recent Items|Thư mục riêng của từng user (vd: %AppData%\Microsoft\Windows\Recent)|Các file được truy cập gần đây|
|Windows Event Logs|C:\Windows\System32\winevt\Logs|Nhiều event log chứa các event tạo process, kết thúc process và các event khác|

## Windows Persistence Artifacts

Windows persistence là các kỹ thuật và cơ chế mà kẻ tấn công dùng để đảm bảo sự hiện diện và quyền kiểm soát trái phép trên một hệ thống bị xâm nhập, cho phép chúng duy trì truy cập và kiểm soát kể cả sau lần xâm nhập ban đầu. Các phương thức persistence này lợi dụng nhiều thành phần hệ thống như registry key, process khởi động cùng hệ thống, scheduled task và service, giúp kẻ tấn công trụ vững qua các lần khởi động lại và các biện pháp bảo mật, đồng thời tiếp tục thực hiện mục tiêu mà không bị phát hiện.

**Registry**

`Registry` của Windows đóng vai trò như một cơ sở dữ liệu then chốt, lưu các thiết lập hệ thống quan trọng của hệ điều hành Windows. Nó bao gồm cấu hình cho thiết bị, bảo mật, service, và thậm chí cả cấu hình bảo mật tài khoản người dùng trong Security Accounts Manager (`SAM`). Với tầm quan trọng như vậy, không có gì lạ khi kẻ tấn công thường nhắm vào Windows Registry để thiết lập persistence. Vì vậy, cần thường xuyên kiểm tra các registry key autorun.

Ví dụ về các key `Autorun` được dùng cho persistence:

- **`Run/RunOnce Keys`**
	- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
	- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnce
	- HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
	- HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
	- HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Policies\

- **`Keys used by WinLogon Process`**
	- HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon
	- HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Shell

- **`Startup Keys`**
	- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders
	- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders
	- 	HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders
	- HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User

**Schtasks**

Windows cung cấp một tính năng cho phép chương trình lên lịch các tác vụ cụ thể. Các tác vụ này nằm trong `C:\Windows\System32\Tasks`, mỗi tác vụ được lưu thành một file XML. File này mô tả người tạo, thời điểm hoặc trigger của tác vụ, và đường dẫn tới lệnh hoặc chương trình sẽ được chạy. Để kiểm tra kỹ các scheduled task, ta vào `C:\Windows\System32\Tasks` và xem nội dung các file XML.

**Services**

`Services` trong Windows đóng vai trò then chốt trong việc duy trì các process trên hệ thống, cho phép các thành phần phần mềm hoạt động ngầm (background) mà không cần người dùng can thiệp. Kẻ tấn công thường can thiệp vào service có sẵn hoặc tạo service giả mạo (rogue service) để đảm bảo persistence và duy trì truy cập trái phép. Vị trí registry cần theo dõi là: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services`.

## Web Browser Forensics

Đi vào web browser forensics, đây là lĩnh vực tập trung phân tích các dấu vết do trình duyệt web để lại. Những dấu vết này có thể làm sáng tỏ hành động của người dùng, các tương tác trực tuyến và những hành vi có khả năng gây hại. Một số forensic artifact quan trọng của trình duyệt bao gồm:

- `Browsing History`: Bản ghi các website đã truy cập, gồm URL, tiêu đề, timestamp và tần suất truy cập.
- `Cookies`: Các file dữ liệu nhỏ do website lưu trên thiết bị người dùng, chứa thông tin như chi tiết session, tuỳ chọn và authentication token.
- `Cache`: Các bản sao được cache của trang web, hình ảnh và nội dung khác mà người dùng đã truy cập. Có thể cho thấy các website đã truy cập ngay cả khi lịch sử đã bị xoá.
- `Bookmarks/Favorites`: Các link đã lưu tới những website hay truy cập hoặc các trang quan tâm.
- `Download History`: Bản ghi các file đã tải về, gồm URL nguồn, tên file và timestamp.
- `Autofill Data`: Thông tin được tự động điền vào form, như tên, địa chỉ và mật khẩu.
- `Search History`: Các truy vấn nhập vào công cụ tìm kiếm, cùng với từ khoá tìm kiếm và timestamp.
- `Session Data`: Thông tin về các phiên duyệt web đang hoạt động, tab và cửa sổ.
- `Typed URLs`: Các URL được nhập trực tiếp vào thanh địa chỉ.
- `Form Data`: Thông tin nhập vào web form, như thông tin đăng nhập và truy vấn tìm kiếm.
- `Passwords`: Mật khẩu website đã lưu hoặc được tự động điền.
- `Web Storage`: Dữ liệu local storage mà website dùng cho nhiều mục đích khác nhau.
- `Favicons`: Các biểu tượng nhỏ gắn với website, có thể hé lộ các trang đã truy cập.
- `Tab Recovery Data`: Thông tin về các tab và session đang mở, có thể được khôi phục sau khi trình duyệt bị crash.
- `Extensions and Add-ons`: Các extension trình duyệt đã cài đặt và cấu hình của chúng.

## SRUM

Chuyển sang `SRUM` (System Resource Usage Monitor), đây là tính năng được giới thiệu từ Windows 8 và các phiên bản sau. SRUM theo dõi tỉ mỉ việc sử dụng tài nguyên và các mẫu sử dụng ứng dụng. Dữ liệu được lưu trong một file cơ sở dữ liệu tên `sru.db` nằm trong thư mục `C:\Windows\System32\sru`. Cơ sở dữ liệu định dạng SQLite này cho phép lưu trữ dữ liệu có cấu trúc và truy xuất dữ liệu hiệu quả. Các bản ghi của SRUM, được tổ chức theo khoảng thời gian, có thể giúp tái dựng việc sử dụng ứng dụng và tài nguyên trong những khoảng thời gian cụ thể.

Các khía cạnh chính của SRUM forensics bao gồm:

- `Application Profiling`: SRUM có thể cung cấp cái nhìn toàn diện về các ứng dụng và process đã được thực thi trên một hệ thống Windows. Nó ghi lại các chi tiết như tên file thực thi, đường dẫn file, timestamp và các chỉ số sử dụng tài nguyên. Thông tin này rất quan trọng để hiểu bức tranh phần mềm trên hệ thống, xác định các ứng dụng có khả năng độc hại hoặc trái phép, và tái dựng hoạt động của người dùng.
- `Resource Consumption`: SRUM thu thập dữ liệu về thời gian CPU, mức sử dụng mạng và mức tiêu thụ bộ nhớ của từng ứng dụng và process. Dữ liệu này vô cùng giá trị khi điều tra các hoạt động tiêu tốn nhiều tài nguyên, xác định các mẫu tiêu thụ tài nguyên bất thường, và phát hiện các vấn đề hiệu năng tiềm ẩn do một số ứng dụng cụ thể gây ra.
- `Timeline Reconstruction`: Bằng cách phân tích dữ liệu SRUM, chuyên gia digital forensics có thể tạo timeline về việc thực thi ứng dụng và process, sử dụng tài nguyên và các hoạt động của hệ thống. Việc tái dựng timeline này đóng vai trò then chốt để hiểu trình tự sự kiện, xác định hành vi đáng ngờ và xây dựng bức tranh rõ ràng về các tương tác và hành động của người dùng.
- `User and System Context`: Dữ liệu SRUM bao gồm định danh người dùng (user identifier), giúp quy hoạt động về cho từng người dùng cụ thể. Điều này hỗ trợ phân tích hành vi người dùng và xác định xem một hành động nào đó do người dùng hợp lệ hay do threat actor thực hiện.
- `Malware Analysis and Detection`: Dữ liệu SRUM có thể dùng để xác định các ứng dụng bất thường hoặc trái phép, vốn có thể là dấu hiệu của malware hoặc hoạt động độc hại. Những đợt tăng vọt đột ngột về sử dụng tài nguyên, mẫu hành vi ứng dụng bất thường hoặc việc cài đặt phần mềm trái phép đều có thể được phát hiện qua phân tích SRUM.
- `Incident Response`: Trong quá trình incident response, SRUM có thể nhanh chóng cung cấp thông tin về các hoạt động gần đây của ứng dụng và process, giúp analyst nhanh chóng xác định các mối đe doạ tiềm ẩn và phản ứng hiệu quả.
