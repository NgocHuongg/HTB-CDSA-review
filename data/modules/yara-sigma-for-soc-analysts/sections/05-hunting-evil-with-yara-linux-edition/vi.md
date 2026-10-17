# Hunting Evil with YARA (Linux Edition) (Săn lùng mối đe doạ bằng YARA – phiên bản Linux)

Hãy đối diện với thực tế của công việc vận hành an ninh mạng: là Security Analyst, ta thường không có "đặc ân" được truy cập trực tiếp vào một hệ thống có khả năng đã bị xâm nhập. Hình dung thế này: có những dấu hiệu đáng ngờ phát ra từ một máy ở xa, nhưng vì ranh giới tổ chức, vấn đề phân quyền hay hậu cần, ta không thể chạm tay vào nó. Cảm giác giống như biết có thể đang có cháy mà không thể nhìn thấy hay chạm vào đám cháy. Tình huống này có thể khiến ta căng thẳng, nhưng đó là thách thức mà ta đã học được cách xử lý.

Đây là lúc mọi thứ trở nên thú vị. Dù không thể truy cập máy đó, trong nhiều trường hợp, một bản memory capture (hay memory dump – bản chụp bộ nhớ) từ hệ thống đáng ngờ vẫn có thể được chuyển cho chúng ta ở Security Operations Center (SOC). Nó giống như nhận được một bức ảnh chụp nhanh (snapshot) mọi thứ đang diễn ra trên hệ thống tại một thời điểm cụ thể. Và chỉ cần có snapshot này, ta không hề bị bó tay.

May mắn thay, công cụ đáng tin cậy YARA của ta sẽ đến giải cứu. Ta có thể chạy các lần quét dựa trên YARA trực tiếp trên các memory image này. Giống như có khả năng nhìn xuyên thấu bằng tia X: ta có thể soi vào trạng thái của hệ thống, tìm các dấu hiệu của hoạt động độc hại hoặc các indicator bị xâm nhập, mà không cần truy cập trực tiếp vào chính máy đó. Khả năng này không chỉ nâng cao năng lực điều tra của ta mà còn đảm bảo rằng ngay cả những hệ thống ở xa, không truy cập được, cũng không còn là "hộp đen" đối với ta. Vì vậy, dù con đường trực tiếp có bị chặn, với các công cụ như YARA và chuyên môn của mình, ta luôn tìm được cách rọi sáng vào những góc tối.

## Săn lùng mối đe doạ trong memory image bằng YARA

Việc kết hợp YARA mở rộng khả năng của memory forensics (điều tra số trên bộ nhớ) — một kỹ thuật then chốt trong phân tích malware và incident response. Nó giúp ta duyệt qua nội dung bộ nhớ, săn tìm các dấu hiệu đặc trưng hoặc các indicator of compromise.

Việc quét memory image của YARA tương tự như việc quét trên ổ đĩa. Hãy cùng phác thảo quy trình:

- **`Create YARA Rules`**: Tự phát triển YARA rule riêng hoặc dựa vào các rule có sẵn nhắm vào đặc điểm của malware trong bộ nhớ hoặc các hành vi đáng ngờ.
- **`Compile YARA Rules`**: Biên dịch YARA rule thành định dạng nhị phân bằng công cụ `yarac` (YARA Compiler). Bước này tạo ra một file chứa các YARA rule đã biên dịch, có phần mở rộng `.yrc`. Bước này là tuỳ chọn, vì ta cũng có thể dùng rule bình thường ở định dạng văn bản. Mặc dù có thể dùng YARA ở định dạng con người đọc được, việc biên dịch rule là một best practice khi triển khai các hệ thống phát hiện dựa trên YARA hoặc khi làm việc với số lượng lớn rule, nhằm đảm bảo hiệu năng và hiệu quả tối ưu. Ngoài ra, việc biên dịch rule còn mang lại một mức độ bảo vệ nhất định bằng cách chuyển chúng sang định dạng nhị phân, khiến người khác khó xem được nội dung thực của rule hơn.
- **`Obtain Memory Image`**: Thu thập memory image bằng các công cụ như [DumpIt](https://www.magnetforensics.com/resources/magnet-dumpit-for-windows/), [MemDump](http://www.nirsoft.net/utils/nircmd.html), [Belkasoft RAM Capturer](https://belkasoft.com/ram-capturer), [Magnet RAM Capture](https://www.magnetforensics.com/resources/magnet-ram-capture/), [FTK Imager](https://www.exterro.com/ftk-imager) và [LiME (Linux Memory Extractor)](https://github.com/504ensicsLabs/LiME).
- **`Memory Image Scanning with YARA`**: Dùng công cụ `yara` và các YARA rule đã biên dịch để quét memory image tìm các match có thể có.

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Bây giờ hãy kéo xuống cuối section này và bấm vào "Click here to spawn the target system!". Sau đó, SSH vào Target IP bằng thông tin đăng nhập được cung cấp. Phần lớn các thao tác/lệnh được trình bày từ đây cho tới cuối section này đều có thể làm lại bên trong target, giúp nắm vững hơn các chủ đề được trình bày. </p>
    </div>
</div>

Ví dụ, ta có một memory snapshot tên `compromised_system.raw` (nằm trong thư mục `/home/htb-student/MemoryDumps` của target trong section này), lấy từ một hệ thống đang bị ransomware `WannaCry` tấn công. Hãy đối chiếu image này với YARA rule `wannacry_artifacts_memory.yar` (nằm trong thư mục `/home/htb-student/Rules/yara` của target trong section này).

Dưới đây là một lệnh ví dụ cho việc quét bộ nhớ dựa trên YARA:

```shell-session
[!bash!]$ yara /home/htb-student/Rules/yara/wannacry_artifacts_memory.yar /home/htb-student/MemoryDumps/compromised_system.raw --print-strings
Ransomware_WannaCry /home/htb-student/MemoryDumps/compromised_system.raw
0x4e140:$wannacry_payload_str1: tasksche.exe
0x1cb9b24:$wannacry_payload_str1: tasksche.exe
0xdb564d8:$wannacry_payload_str1: tasksche.exe
0x13bac36c:$wannacry_payload_str1: tasksche.exe
0x16a2ae44:$wannacry_payload_str1: tasksche.exe
0x16ce55d8:$wannacry_payload_str1: tasksche.exe
0x17bf1fe6:$wannacry_payload_str1: tasksche.exe
0x17cb8002:$wannacry_payload_str1: tasksche.exe
0x17cb80d0:$wannacry_payload_str1: tasksche.exe
0x17cb80f8:$wannacry_payload_str1: tasksche.exe
0x18a68f50:$wannacry_payload_str1: tasksche.exe
0x18a9b4b8:$wannacry_payload_str1: tasksche.exe
0x18dc15a8:$wannacry_payload_str1: tasksche.exe
0x18df37d0:$wannacry_payload_str1: tasksche.exe
0x19a4b522:$wannacry_payload_str1: tasksche.exe
0x1aac0600:$wannacry_payload_str1: tasksche.exe
0x1c07ed9a:$wannacry_payload_str1: tasksche.exe
0x1c59cd32:$wannacry_payload_str1: tasksche.exe
0x1d1593f0:$wannacry_payload_str1: tasksche.exe
0x1d1c6fe2:$wannacry_payload_str1: tasksche.exe
0x1d92632a:$wannacry_payload_str1: tasksche.exe
0x1dd65c34:$wannacry_payload_str1: tasksche.exe
0x1e607a1e:$wannacry_payload_str1: tasksche.exe
0x1e607dca:$wannacry_payload_str1: tasksche.exe
0x13bac3d7:$wannacry_payload_str2: www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
0x197ba5e0:$wannacry_payload_str2: www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
0x1a07cedf:$wannacry_payload_str2: www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
0x1a2cb300:$wannacry_payload_str2: www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
0x1b644cd8:$wannacry_payload_str2: www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
0x1d15945b:$wannacry_payload_str2: www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
0x1dd65c9f:$wannacry_payload_str2: www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
0x450b048:$wannacry_payload_str3: mssecsvc.exe
0x5a7f3d4:$wannacry_payload_str3: mssecsvc.exe
0xda1c350:$wannacry_payload_str3: mssecsvc.exe
0x12481048:$wannacry_payload_str3: mssecsvc.exe
0x17027910:$wannacry_payload_str3: mssecsvc.exe
0x17f0dc18:$wannacry_payload_str3: mssecsvc.exe
0x18c360cc:$wannacry_payload_str3: mssecsvc.exe
0x1a2a02f0:$wannacry_payload_str3: mssecsvc.exe
0x13945408:$wannacry_payload_str4: diskpart.exe
0x19a28480:$wannacry_payload_str4: diskpart.exe
```

Ngoài các công cụ độc lập, việc đi sâu hơn vào memory forensics mở ra rất nhiều hướng khác. Tích hợp YARA vào các framework memory forensics sẽ khuếch đại tiềm năng của nó. Khi framework Volatility và YARA hoạt động song song, các IOC đặc trưng của WannaCry có thể được phát hiện một cách liền mạch.

[Volatility framework](https://www.volatilityfoundation.org/releases) là một công cụ memory forensics mã nguồn mở mạnh mẽ, dùng để phân tích memory image từ nhiều hệ điều hành khác nhau. YARA có thể được tích hợp vào Volatility framework dưới dạng một plugin tên `yarascan`, cho phép áp dụng YARA rule vào việc phân tích bộ nhớ. 

Volatility framework được trình bày chi tiết trong module `Introduction to Digital Forensics` của HTB Academy.

Ở đây, ta chỉ bàn về cách YARA có thể được dùng như một plugin trong Volatility framework.

#### Quét YARA với một pattern duy nhất trên memory image

Trong trường hợp này, ta sẽ chỉ định một pattern YARA rule trực tiếp trên dòng lệnh, pattern này sẽ được plugin `yarascan` của Volatility tìm kiếm trong memory image. Chuỗi cần được đặt trong dấu nháy kép (`"`) sau tuỳ chọn `-U`. Cách này hữu ích khi ta có một YARA rule hoặc pattern cụ thể muốn áp dụng mà không cần tạo một file YARA rule riêng. 

Từ phân tích trước đó, ta biết malware WannaCry cố gắng kết nối tới URI được hardcode sau: `www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com`

Đưa pattern này vào dòng lệnh bằng `-U "www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com"` sẽ kích hoạt việc tìm kiếm trong memory image `compromised_system.raw`.

```shell-session
[!bash!]$ vol.py -f /home/htb-student/MemoryDumps/compromised_system.raw yarascan -U "www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com"
Volatility Foundation Volatility Framework 2.6.1
/usr/local/lib/python2.7/dist-packages/volatility/plugins/community/YingLi/ssh_agent_key.py:12: CryptographyDeprecationWarning: Python 2 is no longer supported by the Python core team. Support for it is now deprecated in cryptography, and will be removed in the next release.
  from cryptography.hazmat.backends.openssl import backend
Rule: r1
Owner: Process svchost.exe Pid 1576
0x004313d7  77 77 77 2e 69 75 71 65 72 66 73 6f 64 70 39 69   www.iuqerfsodp9i
0x004313e7  66 6a 61 70 6f 73 64 66 6a 68 67 6f 73 75 72 69   fjaposdfjhgosuri
0x004313f7  6a 66 61 65 77 72 77 65 72 67 77 65 61 2e 63 6f   jfaewrwergwea.co
0x00431407  6d 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00   m...............
0x00431417  00 f0 5d 17 00 ff ff ff ff 00 00 00 00 00 00 00   ..].............
0x00431427  00 00 00 00 00 00 00 00 00 20 00 00 00 04 00 00   ................
0x00431437  00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431447  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431457  00 00 00 00 00 50 51 17 00 00 00 00 00 00 00 00   .....PQ.........
0x00431467  00 13 00 00 00 b8 43 03 00 00 00 00 00 00 00 00   ......C.........
0x00431477  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431487  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431497  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x004314a7  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x004314b7  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x004314c7  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
Rule: r1
Owner: Process svchost.exe Pid 1576
0x0013dcd8  77 77 77 2e 69 75 71 65 72 66 73 6f 64 70 39 69   www.iuqerfsodp9i
0x0013dce8  66 6a 61 70 6f 73 64 66 6a 68 67 6f 73 75 72 69   fjaposdfjhgosuri
0x0013dcf8  6a 66 61 65 77 72 77 65 72 67 77 65 61 2e 63 6f   jfaewrwergwea.co
0x0013dd08  6d 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   m...............
---SNIP---
```

Tuỳ chọn này cho phép ta chỉ định trực tiếp một chuỗi YARA rule ngay trên dòng lệnh. Giờ hãy xem cách tìm kiếm nội dung của cả một file YARA rule (tức file rule `.yar`) trong các file memory image. 

#### Quét nhiều YARA rule trên memory image

Khi có nhiều YARA rule hoặc một tập rule phức tạp muốn áp dụng lên memory image, ta có thể dùng tuỳ chọn `-y` theo sau là đường dẫn file rule trong Volatility framework, cho phép chỉ định đường dẫn tới một file YARA rule. File YARA rule (trong trường hợp của ta là `wannacry_artifacts_memory.yar`) cần chứa một hoặc nhiều YARA rule trong một file riêng. 

File YARA rule ta sẽ dùng để minh hoạ như sau.

```shell-session
[!bash!]$ cat /home/htb-student/Rules/yara/wannacry_artifacts_memory.yar
rule Ransomware_WannaCry {

    meta:
        author = "Madhukar Raina"
        version = "1.1"
        description = "Simple rule to detect strings from WannaCry ransomware"
        reference = "https://www.virustotal.com/gui/file/ed01ebfbc9eb5bbea545af4d01bf5f1071661840480439c6e5babe8e080e41aa/behavior"


    strings:
        $wannacry_payload_str1 = "tasksche.exe" fullword ascii
        $wannacry_payload_str2 = "www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com" ascii
        $wannacry_payload_str3 = "mssecsvc.exe" fullword ascii
        $wannacry_payload_str4 = "diskpart.exe" fullword ascii
        $wannacry_payload_str5 = "lhdfrgui.exe" fullword ascii

    condition:
        3 of them
```

Hãy chạy Volatility với rule `wannacry_artifacts_memory.yar` (nằm trong thư mục `/home/htb-student/Rules/yara`) để quét memory image `compromised_system.raw` (nằm trong thư mục `/home/htb-student/MemoryDumps`)

```shell-session
[!bash!]$ vol.py -f /home/htb-student/MemoryDumps/compromised_system.raw yarascan -y /home/htb-student/Rules/yara/wannacry_artifacts_memory.yar
Volatility Foundation Volatility Framework 2.6.1
/usr/local/lib/python2.7/dist-packages/volatility/plugins/community/YingLi/ssh_agent_key.py:12: CryptographyDeprecationWarning: Python 2 is no longer supported by the Python core team. Support for it is now deprecated in cryptography, and will be removed in the next release.
  from cryptography.hazmat.backends.openssl import backend
Rule: Ransomware_WannaCry
Owner: Process svchost.exe Pid 1576
0x0043136c  74 61 73 6b 73 63 68 65 2e 65 78 65 00 00 00 00   tasksche.exe....
0x0043137c  52 00 00 00 43 6c 6f 73 65 48 61 6e 64 6c 65 00   R...CloseHandle.
0x0043138c  57 72 69 74 65 46 69 6c 65 00 00 00 43 72 65 61   WriteFile...Crea
0x0043139c  74 65 46 69 6c 65 41 00 43 72 65 61 74 65 50 72   teFileA.CreatePr
0x004313ac  6f 63 65 73 73 41 00 00 6b 00 65 00 72 00 6e 00   ocessA..k.e.r.n.
0x004313bc  65 00 6c 00 33 00 32 00 2e 00 64 00 6c 00 6c 00   e.l.3.2...d.l.l.
0x004313cc  00 00 00 00 68 74 74 70 3a 2f 2f 77 77 77 2e 69   ....http://www.i
0x004313dc  75 71 65 72 66 73 6f 64 70 39 69 66 6a 61 70 6f   uqerfsodp9ifjapo
0x004313ec  73 64 66 6a 68 67 6f 73 75 72 69 6a 66 61 65 77   sdfjhgosurijfaew
0x004313fc  72 77 65 72 67 77 65 61 2e 63 6f 6d 00 00 00 00   rwergwea.com....
0x0043140c  00 00 00 00 01 00 00 00 00 00 00 00 f0 5d 17 00   .............]..
0x0043141c  ff ff ff ff 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0043142c  00 00 00 00 20 00 00 00 04 00 00 00 01 00 00 00   ................
0x0043143c  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0043144c  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0043145c  50 51 17 00 00 00 00 00 00 00 00 00 13 00 00 00   PQ..............
Rule: Ransomware_WannaCry
Owner: Process svchost.exe Pid 1576
0x004313d7  77 77 77 2e 69 75 71 65 72 66 73 6f 64 70 39 69   www.iuqerfsodp9i
0x004313e7  66 6a 61 70 6f 73 64 66 6a 68 67 6f 73 75 72 69   fjaposdfjhgosuri
0x004313f7  6a 66 61 65 77 72 77 65 72 67 77 65 61 2e 63 6f   jfaewrwergwea.co
0x00431407  6d 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00   m...............
0x00431417  00 f0 5d 17 00 ff ff ff ff 00 00 00 00 00 00 00   ..].............
0x00431427  00 00 00 00 00 00 00 00 00 20 00 00 00 04 00 00   ................
0x00431437  00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431447  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431457  00 00 00 00 00 50 51 17 00 00 00 00 00 00 00 00   .....PQ.........
0x00431467  00 13 00 00 00 b8 43 03 00 00 00 00 00 00 00 00   ......C.........
0x00431477  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431487  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x00431497  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x004314a7  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x004314b7  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x004314c7  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
Rule: Ransomware_WannaCry
Owner: Process svchost.exe Pid 1576
0x0040e048  6d 73 73 65 63 73 76 63 2e 65 78 65 00 00 00 00   mssecsvc.exe....
0x0040e058  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e068  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e078  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e088  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e098  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e0a8  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e0b8  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e0c8  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e0d8  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e0e8  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e0f8  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e108  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e118  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e128  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
0x0040e138  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
Rule: Ransomware_WannaCry
Owner: Process svchost.exe Pid 1576
---SNIP---
```

Trong kết quả, ta thấy plugin `yarascan` của Volatility tìm được process `svchost.exe` với PID `1576` trong memory image của hệ thống bị xâm nhập. 

Tóm lại, tuỳ chọn `-U` cho phép ta chỉ định trực tiếp một chuỗi YARA rule trên dòng lệnh, còn tuỳ chọn `-y` dùng để chỉ định đường dẫn tới một file chứa một hoặc nhiều YARA rule. Việc chọn tuỳ chọn nào tuỳ thuộc vào yêu cầu cụ thể của ta và việc ta có một rule đơn lẻ hay một tập rule cần áp dụng trong quá trình phân tích.
