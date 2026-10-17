# Tapping Into ETW (Khai thác ETW)

## Ví dụ phát hiện 1: Phát hiện quan hệ parent-child bất thường

Quan hệ parent-child (cha-con) bất thường giữa các process có thể là dấu hiệu của hoạt động độc hại. Trong môi trường Windows tiêu chuẩn, một số process không bao giờ gọi hoặc spawn (sinh ra) các process khác. Ví dụ, gần như không thể thấy "calc.exe" spawn "cmd.exe" trong một môi trường Windows bình thường. Hiểu các quan hệ parent-child điển hình này có thể giúp phát hiện bất thường. Samir Bousseaden đã chia sẻ một mind map rất hữu ích giới thiệu các quan hệ parent-child phổ biến, có thể tham khảo [tại đây](https://twitter.com/SBousseaden/status/1195373669930983424).

Bằng cách dùng Process Hacker, ta có thể khám phá các quan hệ parent-child trong Windows. Sắp xếp các process theo dạng dropdown trong view Processes sẽ hiển thị cấu trúc phân cấp của các quan hệ này.

![Cửa sổ Process Hacker hiển thị danh sách các process đang chạy với các thông tin như PID, CPU và mức sử dụng bộ nhớ.](images/image34.png)

Phân tích các quan hệ này trong môi trường tiêu chuẩn và môi trường tuỳ chỉnh giúp ta nhận diện các sai lệch so với mẫu bình thường. Ví dụ, nếu ta thấy process "spoolsv.exe" tạo ra "whoami.exe" thay vì hành vi dự kiến là tạo "conhost", điều đó đáng nghi.

![Danh sách process hiển thị spoolsv.exe với PID 2792 và conhost.exe với PID 648.](images/image35.png)

Để minh hoạ một quan hệ parent-child bất thường, trong đó "cmd.exe" có vẻ được tạo bởi "spoolsv.exe" `with no accompanying arguments` (không kèm tham số nào), ta sẽ dùng một kỹ thuật tấn công gọi là Parent PID Spoofing. Parent PID Spoofing có thể được thực hiện thông qua [dự án psgetsystem](https://github.com/decoder-it/psgetsystem) theo cách sau.

```powershell-session
PS C:\Tools\psgetsystem> powershell -ep bypass
PS C:\Tools\psgetsystem> Import-Module .\psgetsys.ps1 
PS C:\Tools\psgetsystem> [MyProcess]::CreateProcessFromParent([Process ID of spoolsv.exe],"C:\Windows\System32\cmd.exe","")
```

![Màn hình desktop hiển thị Process Hacker với các process đang chạy, Event Viewer với log Sysmon, và PowerShell đang thực thi một lệnh.](images/image47.png)

Do kỹ thuật parent PID spoofing mà ta đã dùng, Sysmon Event 1 hiển thị sai `spoolsv.exe` là parent của `cmd.exe`. Tuy nhiên, thực tế chính `powershell.exe` mới là process đã tạo ra `cmd.exe`.

Như đã thảo luận trước đó, mặc dù Sysmon và event log cung cấp telemetry giá trị cho việc hunting và tạo alert rule, chúng không phải là nguồn thông tin duy nhất. Hãy bắt đầu thu thập dữ liệu từ provider `Microsoft-Windows-Kernel-Process` bằng [SilkETW](https://github.com/mandiant/SilkETW) (có thể xác định provider này bằng `logman` như đã mô tả trước đó, `logman.exe query providers | findstr "Process"`). Sau đó, ta có thể mô phỏng lại cuộc tấn công để đánh giá xem ETW có thể cung cấp thông tin chính xác hơn về việc thực thi `cmd.exe` hay không.

```cmd-session
c:\Tools\SilkETW_SilkService_v8\v8\SilkETW>SilkETW.exe -t user -pn Microsoft-Windows-Kernel-Process -ot file -p C:\windows\temp\etw.json
```

![Màn hình desktop hiển thị Process Hacker với các process đang chạy, PowerShell đang thực thi lệnh, và Command Prompt đang chạy SilkETW để event tracing.](images/image48.png)

File `etw.json` (chứa dữ liệu từ provider `Microsoft-Windows-Kernel-Process`) có vẻ chứa thông tin cho thấy `powershell.exe` mới là process đã tạo ra `cmd.exe`. 

![Màn hình desktop hiển thị Process Hacker với các process đang chạy, PowerShell đang thực thi lệnh, và Notepad hiển thị chi tiết process với thao tác tìm kiếm PID 2508.](images/image49.png)

Cần lưu ý rằng event log của SilkETW có thể được ingest và xem bằng Windows Event Viewer thông qua `SilkService`, giúp ta có khả năng quan sát (visibility) sâu và rộng hơn về các hành động được thực hiện trên hệ thống.

## Ví dụ phát hiện 2: Phát hiện việc load .NET assembly độc hại

Theo truyền thống, kẻ tấn công sử dụng một chiến lược gọi là ["Living off the Land" (LotL)](https://www.attackiq.com/2023/03/16/hiding-in-plain-sight/), lợi dụng các công cụ hợp lệ của hệ thống, như PowerShell, để thực hiện các hoạt động độc hại. Cách tiếp cận này giảm nguy cơ bị phát hiện vì nó dùng các công cụ có sẵn trong hệ thống, do đó ít gây nghi ngờ hơn.

Tuy nhiên, cộng đồng an ninh mạng đã thích nghi và phát triển các biện pháp đối phó với chiến lược này.

Đáp lại những tiến bộ phòng thủ này, kẻ tấn công đã phát triển một cách tiếp cận mới mà Mandiant gọi là ["Bring Your Own Land" (BYOL)](https://www.mandiant.com/resources/blog/bring-your-own-land-novel-red-teaming-technique). Thay vì dựa vào các công cụ đã có sẵn trên hệ thống của nạn nhân, các threat actor và pentester mô phỏng các tactic này giờ đây sử dụng .NET assembly được thực thi hoàn toàn trong bộ nhớ. Cách này bao gồm việc tạo các công cụ tự xây dựng bằng các ngôn ngữ như C#, khiến chúng không phụ thuộc vào các công cụ có sẵn trên hệ thống mục tiêu. Cách tiếp cận "Bring Your Own Land" khá hiệu quả vì các lý do sau:
- Mỗi hệ thống Windows đều được cài sẵn một phiên bản .NET nhất định theo mặc định.
- Một đặc điểm nổi bật của .NET là bản chất managed (được quản lý), giúp lập trình viên không cần tự quản lý bộ nhớ thủ công. Đặc điểm này là một phần trong quá trình thực thi managed code của framework, trong đó Common Language Runtime (CLR) đảm nhận các thao tác quan trọng ở mức hệ thống như garbage collection, loại bỏ memory leak và đảm bảo sử dụng tài nguyên hiệu quả hơn.
- Một trong những lợi thế thú vị của việc dùng .NET assembly là khả năng được load trực tiếp vào bộ nhớ. Điều này có nghĩa là file thực thi hoặc DLL không cần được ghi vật lý xuống đĩa — thay vào đó, nó được thực thi trực tiếp trong bộ nhớ. Hành vi này giảm thiểu các artifact để lại trên hệ thống và có thể giúp vượt qua một số hình thức phát hiện dựa trên việc kiểm tra các file được ghi xuống đĩa.
- Microsoft đã tích hợp nhiều thư viện vào .NET framework để giải quyết nhiều bài toán lập trình phổ biến. Các thư viện này bao gồm các chức năng thiết lập kết nối HTTP, triển khai các thao tác mã hoá (cryptographic) và hỗ trợ giao tiếp liên tiến trình (IPC – inter-process communication), chẳng hạn named pipe. Những công cụ dựng sẵn này giúp tinh gọn quá trình phát triển, giảm khả năng xảy ra lỗi và giúp xây dựng ứng dụng mạnh mẽ, hiệu quả dễ dàng hơn. Hơn nữa, với threat actor, các tính năng phong phú này cung cấp một bộ công cụ để tạo ra các phương thức tấn công tinh vi và kín đáo hơn.

Một minh hoạ rõ nét cho chiến lược BYOL này là lệnh ["execute-assembly"](https://www.cobaltstrike.com/blog/cobalt-strike-3-11-the-snake-that-eats-its-tail/) được triển khai trong CobaltStrike, một nền tảng phần mềm được dùng rộng rãi cho Adversary Simulation và Red Team Operation. Lệnh 'execute-assembly' của CobaltStrike cho phép người dùng thực thi .NET assembly trực tiếp từ bộ nhớ, khiến nó trở thành công cụ lý tưởng để triển khai chiến lược BYOL.

Tương tự cách ta đã phát hiện việc thực thi script PowerShell unmanaged thông qua việc quan sát hoạt động load `clr.dll` và `clrjit.dll` bất thường trong các process vốn thường không cần đến chúng, ta có thể áp dụng cách tiếp cận tương tự để nhận diện việc load .NET assembly độc hại. Điều này được thực hiện bằng cách xem xét kỹ hoạt động liên quan đến việc load các [DLL liên quan đến .NET](https://redhead0ntherun.medium.com/detecting-net-c-injection-execute-assembly-1894dbb04ff7), cụ thể là `clr.dll` và `mscoree.dll`.

Giám sát việc load các thư viện như vậy có thể giúp phát hiện các nỗ lực thực thi .NET assembly trong những ngữ cảnh bất thường hoặc không mong đợi, vốn có thể là dấu hiệu của hoạt động độc hại. Hành vi load DLL kiểu này thường có thể được phát hiện bằng cách tận dụng Sysmon Event ID 7, tương ứng với các event "Image Loaded".

Để minh hoạ, hãy mô phỏng một lần load .NET assembly độc hại bằng cách thực thi một phiên bản đã biên dịch sẵn của [Seatbelt](https://github.com/GhostPack/Seatbelt) nằm trên đĩa. `Seatbelt` là một .NET assembly nổi tiếng, thường được kẻ tấn công load và thực thi trong bộ nhớ để nắm bắt tình hình (situational awareness) trên một hệ thống đã bị xâm nhập.

```powershell-session
PS C:\Tools\GhostPack Compiled Binaries>.\Seatbelt.exe TokenPrivileges

                        %&&@@@&&
                        &&&&&&&%%%,                       #&&@@@@@@%%%%%%###############%
                        &%&   %&%%                        &////(((&%%%%%#%################//((((###%%%%%%%%%%%%%%%
%%%%%%%%%%%######%%%#%%####%  &%%**#                      @////(((&%%%%%%######################(((((((((((((((((((
#%#%%%%%%%#######%#%%#######  %&%,,,,,,,,,,,,,,,,         @////(((&%%%%%#%#####################(((((((((((((((((((
#%#%%%%%%#####%%#%#%%#######  %%%,,,,,,  ,,.   ,,         @////(((&%%%%%%%######################(#(((#(#((((((((((
#####%%%####################  &%%......  ...   ..         @////(((&%%%%%%%###############%######((#(#(####((((((((
#######%##########%#########  %%%......  ...   ..         @////(((&%%%%%#########################(#(#######((#####
###%##%%####################  &%%...............          @////(((&%%%%%%%%##############%#######(#########((#####
#####%######################  %%%..                       @////(((&%%%%%%%################
                        &%&   %%%%%      Seatbelt         %////(((&%%%%%%%%#############*
                        &%%&&&%%%%%        v1.2.1         ,(((&%%%%%%%%%%%%%%%%%,
                         #%%%%##,


====== TokenPrivileges ======

Current Token's Privileges

                     SeIncreaseQuotaPrivilege:  DISABLED
                          SeSecurityPrivilege:  DISABLED
                     SeTakeOwnershipPrivilege:  DISABLED
                        SeLoadDriverPrivilege:  DISABLED
                     SeSystemProfilePrivilege:  DISABLED
                        SeSystemtimePrivilege:  DISABLED
              SeProfileSingleProcessPrivilege:  DISABLED
              SeIncreaseBasePriorityPrivilege:  DISABLED
                    SeCreatePagefilePrivilege:  DISABLED
                            SeBackupPrivilege:  DISABLED
                           SeRestorePrivilege:  DISABLED
                          SeShutdownPrivilege:  DISABLED
                             SeDebugPrivilege:  SE_PRIVILEGE_ENABLED
                 SeSystemEnvironmentPrivilege:  DISABLED
                      SeChangeNotifyPrivilege:  SE_PRIVILEGE_ENABLED_BY_DEFAULT, SE_PRIVILEGE_ENABLED
                    SeRemoteShutdownPrivilege:  DISABLED
                            SeUndockPrivilege:  DISABLED
                      SeManageVolumePrivilege:  DISABLED
                       SeImpersonatePrivilege:  SE_PRIVILEGE_ENABLED_BY_DEFAULT, SE_PRIVILEGE_ENABLED
                      SeCreateGlobalPrivilege:  SE_PRIVILEGE_ENABLED_BY_DEFAULT, SE_PRIVILEGE_ENABLED
                SeIncreaseWorkingSetPrivilege:  DISABLED
                          SeTimeZonePrivilege:  DISABLED
                SeCreateSymbolicLinkPrivilege:  DISABLED
    SeDelegateSessionUserImpersonatePrivilege:  DISABLED
```

Giả sử ta đã cấu hình Sysmon phù hợp để ghi lại các event image loading (Event ID 7), việc thực thi 'Seatbelt.exe' sẽ kích hoạt việc load các DLL quan trọng liên quan đến .NET như 'clr.dll' và 'mscoree.dll'. Sysmon, vốn theo dõi sát sao các hoạt động của hệ thống, sẽ ghi lại các thao tác load DLL này dưới dạng các bản ghi Event ID 7.

![Chi tiết Sysmon Event 7 hiển thị thông tin image load của Seatbelt.exe, bao gồm process ID, đường dẫn file và trạng thái chữ ký.](images/image77.png)
![Sysmon Event 7 hiển thị chi tiết image load của Seatbelt.exe, bao gồm process ID, đường dẫn file và trạng thái chữ ký là hợp lệ.](images/image78.png)

Như đã đề cập, chỉ dựa vào Sysmon Event ID 7 để phát hiện tấn công có thể gặp khó khăn do lượng event lớn mà nó tạo ra (đặc biệt nếu không được cấu hình đúng). Ngoài ra, dù nó cho biết những DLL nào đang được load, nó không cung cấp chi tiết về nội dung thực tế của .NET assembly được load.

Để tăng khả năng quan sát và hiểu sâu hơn về assembly thực sự đang được load, ta lại có thể tận dụng Event Tracing for Windows (ETW), cụ thể là provider `Microsoft-Windows-DotNETRuntime`.

Hãy dùng SilkETW để thu thập dữ liệu từ provider `Microsoft-Windows-DotNETRuntime`. Sau đó, ta có thể mô phỏng lại cuộc tấn công để đánh giá xem ETW có thể cung cấp thông tin tình báo chi tiết hơn và có thể hành động được (actionable) về việc load và thực thi .NET assembly 'Seatbelt' hay không.

```cmd-session
c:\Tools\SilkETW_SilkService_v8\v8\SilkETW>SilkETW.exe -t user -pn Microsoft-Windows-DotNETRuntime -uk 0x2038 -ot file -p C:\windows\temp\etw.json
```

File `etw.json` (chứa dữ liệu từ provider `Microsoft-Windows-DotNETRuntime`) có vẻ chứa rất nhiều thông tin về assembly được load, bao gồm cả tên các method.

![Màn hình desktop hiển thị Windows Explorer với thư mục Temp, Command Prompt đang chạy SilkETW, PowerShell đang thực thi Seatbelt.exe, và Notepad hiển thị dữ liệu JSON.](images/image79.png)

Cần lưu ý rằng với cấu hình SilkETW hiện tại, ta không thu thập toàn bộ event từ provider "Microsoft-Windows-DotNETRuntime". Thay vào đó, ta chỉ nhắm có chọn lọc vào một tập con cụ thể (được chỉ định bởi `0x2038`), bao gồm: `JitKeyword`, `InteropKeyword`, `LoaderKeyword` và `NGenKeyword`.
- `JitKeyword` liên quan đến các event biên dịch Just-In-Time (JIT), cung cấp thông tin về các method đang được biên dịch lúc runtime. Điều này có thể đặc biệt hữu ích để hiểu luồng thực thi của .NET assembly.
- `InteropKeyword` đề cập đến các event Interoperability (khả năng tương tác), phát sinh khi managed code tương tác với unmanaged code. Các event này có thể cung cấp thông tin về các tương tác tiềm ẩn với native API hoặc các thành phần unmanaged khác.
- Các event `LoaderKeyword` cung cấp chi tiết về quá trình load assembly trong .NET runtime, điều có thể rất quan trọng để hiểu những .NET assembly nào đang được load và có khả năng được thực thi.
- Cuối cùng, `NGenKeyword` tương ứng với các event Native Image Generator (NGen), liên quan đến việc tạo và sử dụng các .NET assembly đã biên dịch sẵn. Giám sát các event này có thể giúp phát hiện các tình huống kẻ tấn công dùng .NET assembly biên dịch sẵn để né các cơ chế phát hiện liên quan đến JIT.

[Bài blog này](https://medium.com/threat-hunters-forge/threat-hunting-with-etw-events-and-helk-part-1-installing-silketw-6eb74815e4a0) cung cấp những góc nhìn giá trị về SilkETW cũng như việc nhận diện malware dựa trên .NET.

---

## Bài tập thực hành

Di chuyển xuống cuối section này và bấm vào `Click here to spawn the target system!`

Sau đó, RDP tới `[Target IP]` bằng thông tin đăng nhập được cung cấp và trả lời câu hỏi bên dưới.

```shell-session
[!bash!]$ xfreerdp /u:Administrator /p:'HTB_@cad3my_lab_W1n10_r00t!@0' /v:[Target IP] /dynamic-resolution
```
