# Rapid Triage Examination & Analysis Tools (Công cụ kiểm tra và phân tích Rapid Triage)

Khi phân tích Rapid Triage (phân loại nhanh), việc có đúng công cụ bên ngoài là điều thiết yếu để kiểm tra và phân tích kỹ lưỡng.

`Eric Zimmerman` đã tuyển chọn một bộ công cụ không thể thiếu, được thiết kế riêng cho chính mục đích này. Các công cụ này được thiết kế tỉ mỉ để hỗ trợ forensic analyst trong việc trích xuất thông tin quan trọng từ thiết bị số và các artifact.

Để xem danh sách đầy đủ các công cụ này, hãy truy cập:
[https://ericzimmerman.github.io/#!index.md](https://ericzimmerman.github.io/#!index.md)

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Bây giờ hãy kéo xuống cuối section này và bấm vào "Click here to spawn the target system!". Sau đó, RDP vào Target IP bằng thông tin đăng nhập được cung cấp. Phần lớn các thao tác/lệnh được trình bày từ đây đến cuối section này đều có thể thực hiện lại trên máy target, giúp nắm vững hơn các chủ đề được trình bày. </p>
    </div>
</div>

Để đơn giản hoá việc tải về, ta có thể truy cập website chính thức và chọn link .net 4 hoặc .net 6. Thao tác này sẽ bắt đầu tải toàn bộ công cụ dưới dạng file nén.

![Ảnh chụp trang web công cụ của Eric Zimmerman. Các điểm được đánh dấu gồm hướng dẫn đọc phần yêu cầu (requirements), dùng Get-ZimmermanTools để tải về và các tuỳ chọn phiên bản .net. Có các link đóng góp qua GitHub, PayPal và Patreon. Một mục dành cho công cụ forensic cho phép tải file zip cho .net 4 và .net 6.](images/win_dfir_eztools.png)

Ta cũng có thể dùng script PowerShell được cung cấp, như mô tả ở bước 2 trong ảnh trên, để tải toàn bộ công cụ.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools> .\Get-ZimmermanTools.ps1

This script will discover and download all available programs
from https://ericzimmerman.github.io and download them to C:\htb\dfir_module\tools

A file will also be created in C:\Users\johndoe\Desktop\Get-ZimmermanTools that tracks the SHA-1 of each file,
so rerunning the script will only download new versions.

To redownload, remove lines from or delete the CSV file created under C:\htb\dfir_module\tools and rerun. Enjoy!

Use -NetVersion to control which version of the software you get (4 or 6). Default is 6. Use 0 to get both

* Getting available programs...
* Files to download: 27
* Downloaded Get-ZimmermanTools.zip (Size: 10,396)
* C:\htb\dfir_module\tools\net6 does not exist. Creating...
* Downloaded AmcacheParser.zip (Size: 23,60,293) (net 6)
* Downloaded AppCompatCacheParser.zip (Size: 22,62,497) (net 6)
* Downloaded bstrings.zip (Size: 14,73,298) (net 6)
* Downloaded EvtxECmd.zip (Size: 40,36,022) (net 6)
* Downloaded EZViewer.zip (Size: 8,25,80,608) (net 6)
* Downloaded JLECmd.zip (Size: 27,79,229) (net 6)
* Downloaded JumpListExplorer.zip (Size: 8,66,96,361) (net 6)
* Downloaded LECmd.zip (Size: 32,38,911) (net 6)
* Downloaded MFTECmd.zip (Size: 22,26,605) (net 6)
* Downloaded MFTExplorer.zip (Size: 8,27,54,162) (net 6)
* Downloaded PECmd.zip (Size: 20,13,672) (net 6)
* Downloaded RBCmd.zip (Size: 18,19,172) (net 6)
* Downloaded RecentFileCacheParser.zip (Size: 17,22,133) (net 6)
* Downloaded RECmd.zip (Size: 36,89,345) (net 6)
* Downloaded RegistryExplorer.zip (Size: 9,66,96,169) (net 6)
* Downloaded rla.zip (Size: 21,55,515) (net 6)
* Downloaded SDBExplorer.zip (Size: 8,24,54,727) (net 6)
* Downloaded SBECmd.zip (Size: 21,90,158) (net 6)
* Downloaded ShellBagsExplorer.zip (Size: 8,80,06,168) (net 6)
* Downloaded SQLECmd.zip (Size: 52,83,482) (net 6)
* Downloaded SrumECmd.zip (Size: 24,00,622) (net 6)
* Downloaded SumECmd.zip (Size: 20,23,009) (net 6)
* Downloaded TimelineExplorer.zip (Size: 8,77,50,507) (net 6)
* Downloaded VSCMount.zip (Size: 15,46,539) (net 6)
* Downloaded WxTCmd.zip (Size: 36,98,112) (net 6)
* Downloaded iisGeolocate.zip (Size: 3,66,76,319) (net 6)

* Saving downloaded version information to C:\Users\johndoe\Desktop\Get-ZimmermanTools\!!!RemoteFileDetails.csv
```

Dù ta chỉ dùng một phần trong số các công cụ này để phân tích dữ liệu output của KAPE, việc làm quen với toàn bộ bộ công cụ vẫn là điều khôn ngoan. Hiểu rõ đầy đủ khả năng của từng công cụ có thể nâng cao đáng kể năng lực điều tra của ta.

---

Trong section này, ta sẽ làm việc với một số công cụ và bằng chứng (evidence) nằm trong các thư mục sau trên máy target của section.

- **Vị trí evidence**: `C:\Users\johndoe\Desktop\forensic_data`
	- **Vị trí output của KAPE**: `C:\Users\johndoe\Desktop\forensic_data\kape_output`
- **Vị trí các công cụ của Eric Zimmerman**: `C:\Users\johndoe\Desktop\Get-ZimmermanTools`
- **Vị trí Active@ Disk Editor**: `C:\Program Files\LSoft Technologies\Active@ Disk Editor`
- **Vị trí EQL**: `C:\Users\johndoe\Desktop\eqllib-master`
- **Vị trí RegRipper**: `C:\Users\johndoe\Desktop\RegRipper3.0-master`

---

#### MAC(b) Times trong NTFS

Thuật ngữ `MAC(b) times` chỉ một loạt timestamp gắn với file hoặc đối tượng. Các timestamp này rất quan trọng vì chúng làm sáng tỏ trình tự các sự kiện hoặc hành động trên một file system. Từ viết tắt `MAC(b)` là viết tắt của các thời điểm `Modified, Accessed, Changed, and (b) Birth`. Việc thêm `b` biểu thị `Birth timestamp` (thời điểm file "ra đời"), vốn không có mặt trên mọi file system và cũng không dễ truy cập qua các hàm Windows API tiêu chuẩn. Hãy cùng đi sâu hơn vào các chi tiết của timestamp `MACB`.

- `Modified Time (M)`: Timestamp này ghi lại lần cuối nội dung bên trong file bị sửa đổi. Mọi thay đổi đối với dữ liệu của file, như chỉnh sửa nội dung, đều khiến timestamp này được cập nhật.
- `Accessed Time (A)`: Timestamp này phản ánh lần cuối file được truy cập hoặc đọc, được cập nhật mỗi khi file được mở hoặc được tương tác theo cách khác.
- `Changed [Change in MFT Record ] (C)`: Timestamp này biểu thị các thay đổi đối với MFT record. Nó ghi lại thời điểm file được tạo ban đầu. Tuy nhiên, cần lưu ý rằng một số file system, như NTFS, có thể cập nhật timestamp này nếu file bị di chuyển hoặc sao chép.
- `Birth Time (b)`: Thường được gọi là Birth hoặc Born timestamp, đây là thời điểm chính xác file hoặc đối tượng được khởi tạo trên file system. Tầm quan trọng của nó trong điều tra forensic là không thể xem nhẹ, đặc biệt khi cần xác định thời điểm tạo ban đầu của một file.

#### Các quy tắc chung về timestamp trong file system Windows NTFS

Bảng dưới đây mô tả các quy tắc chung về cách các thao tác file khác nhau ảnh hưởng đến timestamp trong Windows NTFS (New Technology File System).

|Thao tác|Modified|Accessed|Birth (Created)|
|-------|-------|-------|-------|
|Tạo file (File Create)|Có|Có|Có|
|Sửa file (File Modify)|Có|Không|Không|
|Sao chép file (File Copy)|Không (kế thừa)|Có|Có|
|Truy cập file (File Access)|Không|Không*|Không|

1. **File Create** (tạo file):
   - `Modified Timestamp (M)`: Modified timestamp được cập nhật để phản ánh thời điểm tạo file.
   - `Accessed Timestamp (A)`: Accessed timestamp được cập nhật để phản ánh rằng file đã được truy cập tại thời điểm tạo.
   - `Birth (Created) Timestamp (b)`: Birth timestamp được đặt bằng thời điểm tạo file.

2. **File Modify** (sửa file):
   - `Modified Timestamp (M)`: Modified timestamp được cập nhật để phản ánh thời điểm nội dung hoặc thuộc tính của file bị sửa đổi lần cuối.
   - `Accessed Timestamp (A)`: Accessed timestamp không được cập nhật khi file bị sửa đổi.
   - `Birth (Created) Timestamp (b)`: Birth timestamp không được cập nhật khi file bị sửa đổi.

3. **File Copy** (sao chép file):
   - `Modified Timestamp (M)`: Modified timestamp thường không được cập nhật khi file được sao chép. Nó thường kế thừa timestamp từ file nguồn.
   - `Accessed Timestamp (A)`: Accessed timestamp được cập nhật để phản ánh rằng file đã được truy cập tại thời điểm sao chép.
   - `Birth (Created) Timestamp (b)`: Birth timestamp được cập nhật thành thời điểm sao chép, cho biết khi nào bản sao được tạo.

4. **File Access** (truy cập file):
   - `Modified Timestamp (M)`: Modified timestamp không được cập nhật khi file được truy cập.
   - `Accessed Timestamp (A)`: Accessed timestamp được cập nhật để phản ánh thời điểm truy cập.
   - `Birth (Created) Timestamp (b)`: Birth timestamp không được cập nhật khi file được truy cập.

Tất cả các timestamp này nằm trong file `$MFT`, đặt tại thư mục gốc của ổ đĩa hệ thống. Dù file `$MFT` sẽ được trình bày sâu hơn ở phần sau, hiện tại ta tập trung vào việc hiểu các timestamp này.

Các timestamp này được lưu trong `$MFT` ở hai attribute riêng biệt:
- `$STANDARD_INFORMATION`
- `$FILE_NAME`

Các timestamp hiển thị trong Windows File Explorer được lấy từ attribute `$STANDARD_INFORMATION`.

#### Điều tra Timestomping

Phát hiện các trường hợp thao túng timestamp, thường gọi là timestomping ([T1070.006](https://attack.mitre.org/techniques/T1070/006/)), là một thách thức lớn trong digital forensics. Timestomping là việc sửa đổi timestamp của file nhằm che giấu trình tự các hoạt động trên file. Chiến thuật này thường được nhiều công cụ sử dụng, như được minh hoạ trong technique timestomp của MITRE ATT&CK.

![Ảnh chụp trang web MITRE ATT&CK hiển thị technique Timestomp. Các điểm được đánh dấu gồm công cụ Cobalt Strike và Empire, có thể sửa timestamp của file để giúp file trà trộn (blend in). Menu bên trái liệt kê các technique indicator removal khác nhau.](images/win_dfir_mft_time3.png)

Khi kẻ tấn công thao túng thời điểm tạo file hoặc triển khai công cụ cho mục đích này, timestamp hiển thị trong File Explorer sẽ bị thay đổi.

Ví dụ, nếu ta nạp `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT` vào `MFT Explorer` (có tại `C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\MFTExplorer`), ta sẽ thấy thời điểm tạo của file `ChangedFileTime.txt` đã bị can thiệp, hiển thị `03-01-2022` trong File Explorer, khác với thời điểm tạo thực tế.

**Lưu ý**: `MFT Explorer` sẽ mất 15-25 phút để nạp file.

![Ảnh chụp MFT Explorer v2.0.0.0 hiển thị chi tiết file trong một phân tích forensic. File 'ChangedFileTime.txt' trong thư mục Temp được đánh dấu, với timestamp cho thấy được tạo ngày 2022-01-03 và sửa đổi ngày 2023-09-07. Khung thuộc tính (properties) cho thấy mục 'Possible Timestamped' được tích.](images/img1.png)

Tuy nhiên, vì đã biết timestamp trong File Explorer bắt nguồn từ attribute `$STANDARD_INFORMATION`, ta có thể đối chiếu dữ liệu này với timestamp từ attribute `$FILE_NAME` thông qua `MFTEcmd` (có tại `C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6`) như sau.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\MFTECmd.exe -f 'C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT' --de 0x16169
MFTECmd version 1.2.2.1

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/MFTECmd

Command line: -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT --de 0x16169

Warning: Administrator privileges not found!

File type: Mft

Processed C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT in 3.4924 seconds

C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT: FILE records found: 93,615 (Free records: 287) File size: 91.8MB


Dumping details for file record with key 00016169-00000004

Entry-seq #: 0x16169-0x4, Offset: 0x585A400, Flags: InUse, Log seq #: 0xCC5FB25, Base Record entry-seq: 0x0-0x0
Reference count: 0x2, FixUp Data Expected: 04-00, FixUp Data Actual: 00-00 | 00-00 (FixUp OK: True)

**** STANDARD INFO ****
  Attribute #: 0x0, Size: 0x60, Content size: 0x48, Name size: 0x0, ContentOffset 0x18. Resident: True
  Flags: Archive, Max Version: 0x0, Flags 2: None, Class Id: 0x0, Owner Id: 0x0, Security Id: 0x557, Quota charged: 0x0, Update sequence #: 0x8B71F8

  Created On:         2022-01-03 16:54:25.2726453
  Modified On:        2023-09-07 08:30:12.4258743
  Record Modified On: 2023-09-07 08:30:12.4565632
  Last Accessed On:   2023-09-07 08:30:12.4258743

**** FILE NAME ****
  Attribute #: 0x3, Size: 0x78, Content size: 0x5A, Name size: 0x0, ContentOffset 0x18. Resident: True

  File name: CHANGE~1.TXT
  Flags: Archive, Name Type: Dos, Reparse Value: 0x0, Physical Size: 0x0, Logical Size: 0x0
  Parent Entry-seq #: 0x16947-0x2

  Created On:         2023-09-07 08:30:12.4258743
  Modified On:        2023-09-07 08:30:12.4258743
  Record Modified On: 2023-09-07 08:30:12.4258743
  Last Accessed On:   2023-09-07 08:30:12.4258743

**** FILE NAME ****
  Attribute #: 0x2, Size: 0x80, Content size: 0x68, Name size: 0x0, ContentOffset 0x18. Resident: True

  File name: ChangedFileTime.txt
  Flags: Archive, Name Type: Windows, Reparse Value: 0x0, Physical Size: 0x0, Logical Size: 0x0
  Parent Entry-seq #: 0x16947-0x2

  Created On:         2023-09-07 08:30:12.4258743
  Modified On:        2023-09-07 08:30:12.4258743
  Record Modified On: 2023-09-07 08:30:12.4258743
  Last Accessed On:   2023-09-07 08:30:12.4258743

**** DATA ****
  Attribute #: 0x1, Size: 0x18, Content size: 0x0, Name size: 0x0, ContentOffset 0x18. Resident: True

  Resident Data

  Data:

    ASCII:
    UNICODE:
```

![Ảnh chụp phần STANDARD INFO với các timestamp. 'Created On' được đánh dấu là 2022-01-03, cho thấy timestomping trong $STANDARD_INFO.](images/win_dfir_mft_time5.png)

![Chi tiết file 'ChangedFileTime.txt' cho thấy ngày tạo là 2023-09-07, tức thời điểm tạo ban đầu trong $FILE_NAME.](images/win_dfir_mft_time6.png)

Trong các file system Windows tiêu chuẩn như NTFS, người dùng thông thường không có quyền sửa trực tiếp timestamp của tên file trong `$FILE_NAME`. Những sửa đổi như vậy chỉ thuộc thẩm quyền của kernel hệ thống.

Để bắt đầu khám phá, trước hết hãy làm quen với các artifact dựa trên filesystem. Ta sẽ bắt đầu với file `$MFT`, nằm ở thư mục gốc của output KAPE.

#### File MFT

File `$MFT`, thường được gọi là [Master File Table](https://learn.microsoft.com/en-us/windows/win32/fileio/master-file-table), là một phần không thể thiếu của NTFS (New Technology File System) được các hệ điều hành Windows hiện đại sử dụng. File này đóng vai trò then chốt trong việc tổ chức và lập danh mục các file và thư mục trên một NTFS volume. Mỗi file và thư mục trên volume như vậy đều có một entry tương ứng trong Master File Table. Có thể hình dung MFT như một cơ sở dữ liệu toàn diện, ghi chép tỉ mỉ metadata và chi tiết cấu trúc của mọi file và thư mục.

Với những người làm digital forensics, `$MFT` là một kho thông tin quý giá. Nó cung cấp bản ghi chi tiết về hoạt động của file và thư mục trên hệ thống, bao gồm các hành động như tạo, sửa đổi, xoá và truy cập file. Bằng cách tận dụng `$MFT`, forensic analyst có thể dựng lại một timeline chi tiết về các sự kiện hệ thống và tương tác của người dùng.

**Lưu ý**: Một đặc điểm nổi bật của MFT là khả năng giữ lại metadata về file và thư mục, ngay cả sau khi chúng đã bị xoá khỏi filesystem. Đặc điểm này nâng tầm quan trọng của MFT trong phân tích forensic và khôi phục dữ liệu.

MFT được đặt một cách có chủ đích tại thư mục gốc của ổ đĩa hệ thống.

Ta đã trích xuất MFT khi trình bày các khả năng của KAPE và lưu tại `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT`.

Hãy điều hướng tới file `$MFT` trong thư mục KAPE Output ở trên và nạp nó vào `MFT Explorer`. Công cụ này, một trong những "kiệt tác" của Eric Zimmerman, cho phép ta kiểm tra và phân tích metadata nằm trong MFT. Metadata này bao gồm rất nhiều thông tin về file và thư mục, từ tên file và timestamp (created, modified, accessed) đến kích thước file, quyền (permission) và attribute. Một điểm nổi bật của MFT Explorer là giao diện trực quan, trình bày các file record theo dạng cây phân cấp đồ hoạ, gợi nhớ tới Windows Explorer quen thuộc.

![MFT Explorer hiển thị file $MFT đã nạp từ output của KAPE. Hiển thị cây phân cấp đồ hoạ của file system, các thuộc tính (properties) và chi tiết MFT file record của 'discord.exe' trong thư mục Temp.](images/win_dfir_mft_exp1_.png)

**Lưu ý**: Cần lưu ý rằng các MFT record một khi đã được tạo thì không bị loại bỏ. Thay vào đó, khi có file và thư mục mới xuất hiện, các record mới được thêm vào MFT. Các record tương ứng với file đã bị xoá được đánh dấu là "free" (trống) và sẵn sàng để tái sử dụng.

#### Cấu trúc của MFT File Record

Mỗi file hoặc thư mục trên một NTFS volume được biểu diễn bằng một record trong MFT. Các record này tuân theo một định dạng có cấu trúc, chứa đầy các attribute và chi tiết về file hoặc thư mục liên quan. Nắm được cấu trúc của MFT là điều then chốt cho các công việc như phân tích forensic, quản trị hệ thống và khôi phục dữ liệu trong môi trường Windows. Nó giúp chuyên gia forensic xác định chính xác attribute nào chứa nhiều thông tin đáng chú ý.

![Sơ đồ cấu trúc file record gồm header và các attribute: STRANDARD, INFORMATION, FILE_NAME, $DATA và các attribute bổ sung, tổng cộng 1024 byte.](images/win_dfir_mft_str1.png)

Dưới đây là tóm tắt các thành phần:
- `File Record Header`: Chứa metadata về chính file record. Gồm các field như signature, sequence number và các dữ liệu quản trị khác.
- `Standard Information Attribute Header`: Lưu metadata tiêu chuẩn của file như timestamp, file attribute và security identifier.
- `File Name Attribute Header`: Chứa thông tin về tên file, gồm độ dài, namespace và các ký tự Unicode.
- `Data Attribute Header`: Mô tả attribute dữ liệu của file, có thể là `resident` (lưu bên trong MFT record) hoặc `non-resident` (lưu ở các cluster bên ngoài).
  - `File Data (File content)`: Phần này chứa dữ liệu thực của file, có thể là nội dung của file hoặc tham chiếu tới các cluster dữ liệu non-resident. Với file nhỏ (dưới 512 byte), dữ liệu có thể được lưu ngay trong MFT record (`resident`). Với file lớn hơn, nó tham chiếu tới các cluster dữ liệu `non-resident` trên đĩa. Ta sẽ thấy ví dụ về điều này ở phần sau.
- `Additional Attributes (optional)`: NTFS hỗ trợ nhiều attribute bổ sung, như security descriptor (SD), object ID (OID), tên volume (VOLNAME), thông tin index, v.v.

Các attribute này có thể khác nhau tuỳ theo đặc điểm của file. Ta có thể xem các loại thông tin phổ biến được lưu bên trong các header và attribute này trong hình dưới đây.

![Sơ đồ MFT file record gồm các phần: FILE Record Header, Attribute $10 (STANDARD_INFORMATION), Attribute \30 (FILE_NAME) và Attribute \80 ($DATA), kèm thông tin hex và attribute chi tiết.](images/win_dfir_mft_str2.png)

#### File Record Header

Chứa metadata về chính file record. Gồm các field như signature, sequence number và các dữ liệu quản trị khác.

![Sơ đồ FILE Record Header hiển thị các thuộc tính như Signature, Update Sequence và Entry ID. Kèm giá trị hex và thập phân để dùng với MFTCmd.](images/win_dfir_mft_str3.png)

File record bắt đầu bằng một header chứa metadata về chính file record. Header này thường gồm các thông tin sau:

- `Signature`: Chữ ký 4 byte, thường là "FILE" hoặc "BAAD", cho biết record đang được sử dụng hay đã bị giải phóng (deallocated).
- `Offset to Update Sequence Array`: Offset tới Update Sequence Array (USA), giúp duy trì tính toàn vẹn của record trong quá trình cập nhật.
- `Size of Update Sequence Array`: Kích thước của Update Sequence Array, tính theo word.
- `Log File Sequence Number`: Số xác định lần cập nhật cuối cùng đối với file record.
- `Sequence Number`: Số xác định file record. Các MFT record được đánh số tuần tự, bắt đầu từ 0.
- `Hard Link Count`: Số hard link tới file. Cho biết có bao nhiêu directory entry trỏ tới file record này.
- `Offset to First Attribute`: Offset tới attribute đầu tiên trong file record.

Khi ta duyệt file MFT bằng `MFTECmd` và trích xuất chi tiết về một record, thông tin từ file record được trình bày như trong ảnh chụp tiếp theo.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\MFTECmd.exe -f 'C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT' --de 27142
MFTECmd version 1.2.2.1

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/MFTECmd

Command line: -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT --de 27142

Warning: Administrator privileges not found!

File type: Mft

Processed C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT in 3.2444 seconds

C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT: FILE records found: 93,615 (Free records: 287) File size: 91.8MB


Dumping details for file record with key 00006A06-00000005

Entry-seq #: 0x6A06-0x5, Offset: 0x1A81800, Flags: InUse, Log seq #: 0xCC64595, Base Record entry-seq: 0x0-0x0
Reference count: 0x1, FixUp Data Expected: 03-00, FixUp Data Actual: 6F-65 | 00-00 (FixUp OK: True)

**** STANDARD INFO ****
  Attribute #: 0x0, Size: 0x60, Content size: 0x48, Name size: 0x0, ContentOffset 0x18. Resident: True
  Flags: Archive, Max Version: 0x0, Flags 2: None, Class Id: 0x0, Owner Id: 0x0, Security Id: 0x557, Quota charged: 0x0, Update sequence #: 0x8B8778

  Created On:         2023-09-07 08:30:26.8316176
  Modified On:        2023-09-07 08:30:26.9097759
  Record Modified On: 2023-09-07 08:30:26.9097759
  Last Accessed On:   2023-09-07 08:30:26.9097759

**** FILE NAME ****
  Attribute #: 0x2, Size: 0x70, Content size: 0x54, Name size: 0x0, ContentOffset 0x18. Resident: True

  File name: users.txt
  Flags: Archive, Name Type: DosWindows, Reparse Value: 0x0, Physical Size: 0x0, Logical Size: 0x0
  Parent Entry-seq #: 0x16947-0x2

  Created On:         2023-09-07 08:30:26.8316176
  Modified On:        2023-09-07 08:30:26.8316176
  Record Modified On: 2023-09-07 08:30:26.8316176
  Last Accessed On:   2023-09-07 08:30:26.8316176

**** DATA ****
  Attribute #: 0x1, Size: 0x150, Content size: 0x133, Name size: 0x0, ContentOffset 0x18. Resident: True

  Resident Data

  Data: 0D-0A-55-73-65-72-20-61-63-63-6F-75-6E-74-73-20-66-6F-72-20-5C-5C-48-54-42-56-4D-30-31-0D-0A-0D-0A-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-2D-0D-0A-41-64-6D-69-6E-69-73-74-72-61-74-6F-72-20-20-20-20-20-20-20-20-20-20-20-20-62-61-63-6B-67-72-6F-75-6E-64-54-61-73-6B-20-20-20-20-20-20-20-20-20-20-20-44-65-66-61-75-6C-74-41-63-63-6F-75-6E-74-20-20-20-20-20-20-20-20-20-20-20-0D-0A-47-75-65-73-74-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-4A-6F-68-6E-20-44-6F-65-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-20-57-44-41-47-55-74-69-6C-69-74-79-41-63-63-6F-75-6E-74-20-20-20-20-20-20-20-0D-0A-54-68-65-20-63-6F-6D-6D-61-6E-64-20-63-6F-6D-70-6C-65-74-65-64-20-73-75-63-63-65-73-73-66-75-6C-6C-79-2E-0D-0A-0D-0A

    ASCII:
User accounts for \\HTBVM01

-------------------------------------------------------------------------------
Administrator            backgroundTask           DefaultAccount
Guest                    John Doe                 WDAGUtilityAccount
The command completed successfully.


    UNICODE: ????????????????????????????????????????????????????????????????+++++????????+++++???????+++++????++++++++++????++++++++?????????4+++?????????????????????
```

Mỗi attribute biểu thị một thông tin entry nào đó, được xác định theo type.

|Type|Attribute|Mô tả|
|-------|-------|-------|
|0x10 (16)|$STANDARD_INFORMATION|Thông tin chung - flag, MAC times, owner và security id.|
|0x20 (32)|$ATTRIBUTE_LIST|Con trỏ tới các attribute khác và danh sách các attribute nonresident.|
|0x30 (48)|$FILE_NAME|Tên file - (Unicode) và MAC times cũ (outdated)|
|0x40 (64)|$VOLUME_VERSION|Thông tin volume - chỉ có ở NTFS v1.2 và Windows NT, không còn được dùng|
|0x40 (64)|$OBJECT_ID|Định danh duy nhất 16B - cho file hoặc thư mục (NTFS 3.0+; Windows 2000+)|
|0x50 (80)|$SECURITY_DESCRIPTOR|Access control list và các thuộc tính bảo mật của file|
|0x60 (96)|$VOLUME_NAME|Tên volume|
|0x70 (112)|$VOLUME_INFORMATION|Phiên bản file system và các thông tin khác|
|0x80 (128)|$DATA|Nội dung file|
|0x90 (144)|$INDEX_ROOT|Node gốc của một cây index|
|0xA0 (160)|$INDEX_ALLOCATION|Các node của một cây index - với gốc nằm trong $INDEX_ROOT|
|0xB0 (176)|$BITMAP|Bitmap - cho file $MFT và cho các index (thư mục)|
|0xC0 (192)|$SYMBOLIC_LINK|Thông tin soft link - (chỉ có ở NTFS v1.2 và Windows NT)|
|0xC0 (192)|$REPARSE_POINT|Dữ liệu về một reparse point - dùng cho soft link (NTFS 3.0+; Windows 2000+)|
|0xD0 (208)|$EA_INFORMATION|Dùng để tương thích ngược với các ứng dụng OS/2 (HPFS)|
|0xE0 (224)|$EA|Dùng để tương thích ngược với các ứng dụng OS/2 (HPFS)|
|0x100 (256)|$LOGGED_UTILITY_STREAM|Các key và thông tin khác về các attribute được mã hoá (NTFS 3.0+; Windows 2000+)|

Để làm rõ cấu trúc của một NTFS MFT file record, ta sẽ tận dụng khả năng của [Active@ Disk Editor](https://www.disk-editor.org/index.html). Công cụ chỉnh sửa đĩa freeware mạnh mẽ này có tại `C:\Program Files\LSoft Technologies\Active@ Disk Editor`, cho phép xem và sửa dữ liệu thô trên đĩa, bao gồm cả Master File Table của một hệ thống NTFS. Các thông tin tương tự cũng có thể thu được từ các công cụ parse MFT khác, như `MFT Explorer`.

Ta có thể xem kỹ hơn bằng cách mở `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT` trong `Active@ Disk Editor` rồi bấm `Inspect File Record`.

![Active@ Disk Editor hiển thị các cột hex, ASCII và Unicode của một file. Thông tin chung về file hiển thị ở bên phải.](images/img2.png)

![Active@ Disk Editor hiển thị dữ liệu hex, ASCII và Unicode của một file. Thông tin volume hiển thị ở bên phải.](images/img3.png)

Trong Disk Editor, ta có thể xem dữ liệu thô của các MFT entry. Dữ liệu này gồm biểu diễn dạng hexa của MFT record, đầy đủ header và các attribute.

**Non-Resident Flag**

![Sơ đồ cấu trúc MFT file record gồm các phần HEADER, STANRD, INFORMATION, FILE_NAME và $DATA. Chỉ ra non-resident flag và thông tin kích thước file.](images/win_dfir_mft_str4.png)

Khi parse entry này bằng `MFTECmd`, header dữ liệu non-resident trông như sau.

![Ảnh chụp output của MFTECmd hiển thị chi tiết của 'update.exe'. Các điểm được đánh dấu gồm ngày tạo và ngày sửa đổi file, trạng thái non-resident data và thông tin kích thước.](images/win_dfir_mft_ecmd2_.png)

**Resident Flag**

![Sơ đồ cấu trúc MFT file record gồm các phần HEADER, STANDARD, INFORMATION FILE_NAME và $DATA. Chỉ ra resident flag và thông tin kích thước file của 'users.txt'.](images/win_dfir_mft_str5.png)

Khi parse entry này bằng `MFTECmd`, header dữ liệu resident trông như sau.

![Chi tiết file 'users.txt' cho thấy ngày tạo và ngày sửa đổi, kích thước nội dung 307 byte và trạng thái resident data. Phần ASCII liệt kê các tài khoản người dùng.](images/win_dfir_mft_ecmd3.png)

#### Dữ liệu Zone.Identifier trong MFT File Record

`Zone.Identifier` là một attribute metadata file đặc biệt trong hệ điều hành Windows, biểu thị security zone (vùng bảo mật) mà file có nguồn gốc từ đó. Nó là một phần không thể thiếu của Windows Attachment Execution Service (AES) và đóng vai trò quan trọng trong việc xác định cách Windows xử lý các file lấy về từ internet hoặc các nguồn có khả năng không đáng tin cậy khác.

Khi một file được tải về từ internet, Windows gán cho nó một Zone Identifier (`ZoneId`). ZoneId này, được nhúng trong metadata của file, biểu thị nguồn gốc hoặc security zone mà file xuất phát. Ví dụ, file lấy từ internet thường mang `ZoneId` là `3`, biểu thị Internet Zone.

Ví dụ, ta đã tải nhiều công cụ về thư mục `C:\Users\johndoe\Downloads` trên máy target của section này. Sau khi tải về, chúng đã được gán một `ZoneID` kèm đầy đủ Zone.Identifier (tức URL nguồn).

```powershell-session
PS C:\Users\johndoe\Downloads> Get-Item * -Stream Zone.Identifier -ErrorAction SilentlyContinue


PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads\Autoruns.zip:Zone.Identifier
PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads
PSChildName   : Autoruns.zip:Zone.Identifier
PSDrive       : C
PSProvider    : Microsoft.PowerShell.Core\FileSystem
PSIsContainer : False
FileName      : C:\Users\johndoe\Downloads\Autoruns.zip
Stream        : Zone.Identifier
Length        : 130

PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads\chainsaw_all_platforms+rules+examples.
                zip:Zone.Identifier
PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads
PSChildName   : chainsaw_all_platforms+rules+examples.zip:Zone.Identifier
PSDrive       : C
PSProvider    : Microsoft.PowerShell.Core\FileSystem
PSIsContainer : False
FileName      : C:\Users\johndoe\Downloads\chainsaw_all_platforms+rules+examples.zip
Stream        : Zone.Identifier
Length        : 679

PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads\disable-defender.ps1:Zone.Identifier
PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads
PSChildName   : disable-defender.ps1:Zone.Identifier
PSDrive       : C
PSProvider    : Microsoft.PowerShell.Core\FileSystem
PSIsContainer : False
FileName      : C:\Users\johndoe\Downloads\disable-defender.ps1
Stream        : Zone.Identifier
Length        : 55

PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads\USN-Journal-Parser-master.zip:Zone.Ide
                ntifier
PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads
PSChildName   : USN-Journal-Parser-master.zip:Zone.Identifier
PSDrive       : C
PSProvider    : Microsoft.PowerShell.Core\FileSystem
PSIsContainer : False
FileName      : C:\Users\johndoe\Downloads\USN-Journal-Parser-master.zip
Stream        : Zone.Identifier
Length        : 187

PSPath        : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads\volatility3-develop.zip:Zone.Identifie
                r
PSParentPath  : Microsoft.PowerShell.Core\FileSystem::C:\Users\johndoe\Downloads
PSChildName   : volatility3-develop.zip:Zone.Identifier
PSDrive       : C
PSProvider    : Microsoft.PowerShell.Core\FileSystem
PSIsContainer : False
FileName      : C:\Users\johndoe\Downloads\volatility3-develop.zip
Stream        : Zone.Identifier
Length        : 184
```

Để xem nội dung `Zone.Identifier` của một file, có thể chạy lệnh sau trong PowerShell.

```powershell-session
PS C:\Users\johndoe\Downloads> Get-Content * -Stream Zone.Identifier -ErrorAction SilentlyContinue
[ZoneTransfer]
ZoneId=3
ReferrerUrl=https://learn.microsoft.com/
HostUrl=https://download.sysinternals.com/files/Autoruns.zip
[ZoneTransfer]
ZoneId=3
ReferrerUrl=https://github.com/WithSecureLabs/chainsaw/releases
HostUrl=https://objects.githubusercontent.com/github-production-release-asset-2e65be/395658506/222c726c-0fe8-4a13-82c4-a4c9a45875c6?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230813%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230813T181953Z&X-Amz-Expires=300&X-Amz-Signature=0968cc87b63f171b60eb525362c11cb6463ac5681db50dbb7807cc5384fcb771&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=395658506&response-content-disposition=attachment%3B%20filename%3Dchainsaw_all_platforms%2Brules%2Bexamples.zip&response-content-type=application%2Foctet-stream
[ZoneTransfer]
ZoneId=3
HostUrl=https://github.com/
[ZoneTransfer]
ZoneId=3
ReferrerUrl=https://github.com/PoorBillionaire/USN-Journal-Parser
HostUrl=https://codeload.github.com/PoorBillionaire/USN-Journal-Parser/zip/refs/heads/master
[ZoneTransfer]
ZoneId=3
ReferrerUrl=https://github.com/volatilityfoundation/volatility3
HostUrl=https://codeload.github.com/volatilityfoundation/volatility3/zip/refs/heads/develop
```

Một trong các cơ chế bảo mật, gọi là `Mark of the Web` (`MotW`), dựa trên Zone Identifier. Ở đây, dấu MotW phân biệt các file lấy từ internet hoặc các nguồn đáng ngờ khác với các file có nguồn gốc từ ngữ cảnh tin cậy hoặc cục bộ. Nó thường được dùng để tăng cường bảo mật cho các ứng dụng như Microsoft Word. Khi một ứng dụng, chẳng hạn Microsoft Word, mở một file mang MotW, nó có thể áp dụng các biện pháp bảo mật cụ thể dựa trên sự hiện diện của MotW. Ví dụ, một tài liệu Word có MotW có thể được mở ở chế độ `Protected View`, một chế độ hạn chế cô lập tài liệu khỏi phần còn lại của hệ thống, giúp giảm thiểu các mối đe doạ bảo mật tiềm ẩn.

Dù chức năng chính của nó là tăng cường bảo mật cho các file tải từ web, forensic analyst có thể tận dụng nó cho mục đích điều tra. Bằng cách xem xét kỹ attribute này, họ có thể xác định file đã được tải về theo cách nào. Xem ví dụ dưới đây.

![Màn hình desktop với MFT Explorer và PowerShell đang mở. MFT Explorer hiển thị chi tiết file 'pass.exe' trong thư mục Temp, đánh dấu mục 'Has ADS'. PowerShell hiển thị metadata của cùng file đó, gồm ngày tạo và trạng thái non-resident data.](images/img4.png)

#### Phân tích với Timeline Explorer

`Timeline Explorer` là một công cụ digital forensic khác do Eric Zimmerman phát triển, dùng để hỗ trợ forensic analyst và điều tra viên tạo và phân tích các timeline artifact từ nhiều nguồn khác nhau. Timeline artifact cung cấp góc nhìn theo trình tự thời gian về các sự kiện và hoạt động của hệ thống, giúp việc dựng lại chuỗi sự kiện trong quá trình điều tra dễ dàng hơn. Ta có thể lọc dữ liệu timeline theo các tiêu chí cụ thể, như khoảng ngày giờ, loại event, từ khoá, v.v. Tính năng này giúp tập trung cuộc điều tra vào thông tin liên quan.

Việc sắp xếp các event khác nhau nối tiếp nhau theo thời gian như vậy thực sự hữu ích để dựng nên một câu chuyện hay timeline về những gì đã xảy ra trước và sau các event cụ thể. Trình tự event này giúp thiết lập một timeline hoạt động trên hệ thống.

Nạp một file CSV đã chuyển đổi vào Timeline Explorer là một quy trình đơn giản. Timeline Explorer được thiết kế để làm việc với dữ liệu timeline, bao gồm các file CSV chứa các event hoặc hoạt động có gắn timestamp. Để nạp file CSV dữ liệu event vào Timeline Explorer, ta có thể mở Timeline Explorer rồi chỉ cần kéo thả file từ vị trí của nó (vd: thư mục phân tích KAPE của ta) vào cửa sổ Timeline Explorer.

Sau khi nạp, Timeline Explorer sẽ xử lý và hiển thị dữ liệu. Thời gian của quá trình này phụ thuộc vào kích thước file.

![Giao diện Timeline Explorer v2.0.0.1 hiển thị thông báo đang nạp 'kape_event_log.csv' và lời nhắc kéo thả file CSV.](images/win_dfir_winevt8.png)

Ta sẽ thấy timeline được điền các event từ file CSV theo thứ tự thời gian. Khi dữ liệu timeline đã được nạp, ta có thể khám phá và phân tích các event bằng các tính năng mà Timeline Explorer cung cấp. Ta có thể phóng to vào các khoảng thời gian cụ thể, lọc event, tìm kiếm theo từ khoá và tương quan (correlate) các hoạt động liên quan.

![Timeline Explorer v2.0.0.1 hiển thị 'kape_event_log.csv' với góc nhìn theo trình tự thời gian của các event, đánh dấu các event tạo file và registry.](images/win_dfir_winevt9.png)

Ta sẽ đưa ra nhiều ví dụ sử dụng Timeline Explorer trong section này.

#### USN Journal

`USN`, hay `Update Sequence Number`, là một thành phần quan trọng của file system NTFS trong Windows. USN Journal về cơ bản là một tính năng change journal (nhật ký thay đổi), ghi lại tỉ mỉ các thay đổi đối với file và thư mục trên một NTFS volume.

Với những người làm digital forensics, USN Journal là một mỏ vàng. Nó cho phép ta theo dõi các thao tác như File Creation (tạo file), Rename (đổi tên), Deletion (xoá) và Data Overwrite (ghi đè dữ liệu).

Trong môi trường Windows, file USN Journal được đặt tên là `$J`. Thư mục KAPE Output lưu USN Journal đã thu thập trong thư mục sau: `<KAPE_output_folder>\<Drive>\$Extend`

Đây là cách nó hiển thị trong output KAPE của ta (`C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$Extend`)

![File Explorer hiển thị đường dẫn C:\Users\johndoe\Desktop\forensic_data\kape_output\D$Extend với các file J và Max, cả hai được sửa đổi ngày 8/28/2023.](images/img5.png)

#### Phân tích USN Journal bằng MFTECmd

Trước đó ta đã dùng `MFTECmd`, một trong các công cụ của Eric Zimmerman, để parse file MFT. Dù trọng tâm chính là MFT, MFTECmd cũng rất hữu ích trong việc phân tích USN Journal. Lý do là các entry trong USN Journal thường đề cập tới các sửa đổi đối với file và thư mục được ghi nhận trong MFT. Vì vậy, ta sẽ dùng công cụ này để mổ xẻ USN Journal.

Để phân tích USN Journal bằng `MFTECmd`, hãy chạy một lệnh tương tự như dưới đây:

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\MFTECmd.exe -f 'C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$Extend\$J' --csv C:\Users\johndoe\Desktop\forensic_data\mft_analysis\ --csvf MFT-J.csv
MFTECmd version 1.2.2.1

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/MFTECmd

Command line: -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$Extend\$J --csv C:\Users\johndoe\Desktop\forensic_data\mft_analysis\ --csvf MFT-J.csv

Warning: Administrator privileges not found!

File type: UsnJournal


Processed C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$Extend\$J in 0.1675 seconds

Usn entries found in C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$Extend\$J: 89,704
        CSV output will be saved to C:\Users\johndoe\Desktop\forensic_data\mft_analysis\MFT-J.csv
```

File output kết quả được lưu với tên `MFT-J.csv` trong thư mục `C:\Users\johndoe\Desktop\forensic_data\mft_analysis`. Hãy import nó vào `Timeline Explorer` (có tại `C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\TimelineExplorer`).

**Lưu ý**: Hãy bỏ filter trên Entry Number để thấy bức tranh toàn cảnh.

![Timeline Explorer v2.0.0.1 hiển thị 'MFT-J.csv' với các update timestamp, tên file, phần mở rộng và các update reason như SecurityChange và RenameNewName.](images/win_dfir_usn2.png)

Khi xem xét, ta có thể nhận ra một timeline các event được sắp xếp theo thứ tự thời gian. Đáng chú ý, entry của `uninstall.exe` hiện ra rõ ràng.

Bằng cách áp filter trên Entry Number `93866`, tương ứng với `Entry ID` của `uninstall.exe`, ta có thể biết được bản chất các sửa đổi đã được thực hiện trên file cụ thể này.

![Timeline Explorer hiển thị các entry file với timestamp, entry number 93866 và các update reason như FileCreate, DataTruncation và RenameNewName cho nhiều loại file khác nhau.](images/win_dfir_usn3.png)

Phần mở rộng file `.crdownload` cho thấy đây là một file được tải về chưa hoàn tất. Loại file này thường được tạo ra khi tải nội dung qua các trình duyệt như Microsoft Edge, Google Chrome hoặc Chromium. Phát hiện này rất đáng chú ý. Nếu file được tải về qua trình duyệt, nhiều khả năng `Zone.Identifier` có thể tiết lộ IP/domain nguồn mà file xuất phát.

Để kiểm chứng giả định này, ta nên:
1. Tạo file CSV cho `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT` bằng `MFTECmd` giống như đã làm với `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$Extend\$J`.
2. Import file CSV liên quan tới $MFT vào `Timeline Explorer`.
3. Áp filter trên Entry Number `93866`.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\MFTECmd.exe -f 'C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT' --csv C:\Users\johndoe\Desktop\forensic_data\mft_analysis\ --csvf MFT.csv
MFTECmd version 1.2.2.1

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/MFTECmd

Command line: -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT --csv C:\Users\johndoe\Desktop\forensic_data\mft_analysis\ --csvf MFT.csv

Warning: Administrator privileges not found!

File type: Mft

Processed C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT in 3.5882 seconds

C:\Users\johndoe\Desktop\forensic_data\kape_output\D\$MFT: FILE records found: 93,615 (Free records: 287) File size: 91.8MB
        CSV output will be saved to C:\Users\johndoe\Desktop\forensic_data\mft_analysis\MFT.csv
```

![Timeline Explorer hiển thị MFT.csv với entry number 93866 của 'uninstall.exe'. Nội dung Zone ID gồm ZoneId=3, ReferrerUrl và HostUrl đều trỏ tới http://10.10.10.10:443.](images/win_dfir_mft_ecmd5_.png)

#### Điều tra Windows Event Logs

Việc thăm dò Windows Event Logs là cực kỳ quan trọng trong digital forensics và incident response. Các log này là kho dữ liệu vô giá, ghi lại các hoạt động hệ thống, hành vi người dùng và sự cố bảo mật trên một máy Windows. Khi KAPE được thực thi, nó sao chép các event log gốc, đảm bảo trạng thái nguyên vẹn của chúng được bảo toàn làm bằng chứng. Thư mục KAPE Output lưu các event log này trong thư mục sau:
`<KAPE_output_folder>\Windows\System32\winevt\logs`

![File Explorer hiển thị thư mục logs với các file event log như Application.evtx và Microsoft-Windows-Client-Licensing-Platform%4Admin.evtx, ngày 9/7/2023, kích thước từ 68 KB đến 3,140 KB.](images/img6.png)

Thư mục này chứa các file `.evtx`, lưu vô số Windows event log, bao gồm nhưng không giới hạn ở Security, Application, System và Sysmon (nếu được bật).

Nhiệm vụ của ta là sàng lọc các event log này, săn tìm mọi bất thường, mẫu hình (pattern) hoặc indicator of compromise (IOC). Là những "thám tử" forensic, ta cần cảnh giác, chú ý đến event ID, timestamp, IP nguồn, username và các chi tiết log liên quan khác. Rất nhiều tiện ích và script forensic, như công cụ parse log và hệ thống SIEM, có thể hỗ trợ việc phân tích. Điều bắt buộc là phải xác định được các tactic, technique và procedure (TTP) thể hiện trong bất kỳ hoạt động đáng ngờ nào. Việc này có thể đòi hỏi đi sâu vào các mẫu tấn công đã biết và signature của malware. Một bước quan trọng khác là tương quan các event từ nhiều nguồn log khác nhau, xây dựng một timeline event toàn diện. Góc nhìn tổng thể này giúp ghép nối chuỗi sự kiện.

Việc phân tích Windows Event Logs đã được đề cập trong các module `Windows Event Logs & Finding Evil` và `YARA & Sigma for SOC Analysts`.

#### Parse Windows Event Logs bằng EvtxECmd (EZ-Tool)

`EvtxECmd` (có tại `C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\EvtxeCmd`) là một "đứa con tinh thần" khác của Eric Zimmerman, được thiết kế riêng cho các file Windows Event Log (file EVTX). Với công cụ này, ta có thể trích xuất các event log cụ thể hoặc một dải event từ file EVTX, chuyển chúng sang các định dạng dễ đọc hơn như JSON, XML hoặc CSV.

Hãy mở menu help của EvtxECmd để làm quen với các tuỳ chọn khác nhau. Lệnh để truy cập phần help như sau.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\EvtxeCmd> .\EvtxECmd.exe -h
Description:
  EvtxECmd version 1.5.0.0

  Author: Eric Zimmerman (saericzimmerman@gmail.com)
  https://github.com/EricZimmerman/evtx

  Examples: EvtxECmd.exe -f "C:\Temp\Application.evtx" --csv "c:\temp\out" --csvf MyOutputFile.csv
            EvtxECmd.exe -f "C:\Temp\Application.evtx" --csv "c:\temp\out"
            EvtxECmd.exe -f "C:\Temp\Application.evtx" --json "c:\temp\jsonout"

            Short options (single letter) are prefixed with a single dash. Long commands are prefixed with two dashes

Usage:
  EvtxECmd [options]

Options:
  -f <f>           File to process. This or -d is required
  -d <d>           Directory to process that contains evtx files. This or -f is required
  --csv <csv>      Directory to save CSV formatted results to
  --csvf <csvf>    File name to save CSV formatted results to. When present, overrides default name
  --json <json>    Directory to save JSON formatted results to
  --jsonf <jsonf>  File name to save JSON formatted results to. When present, overrides default name
  --xml <xml>      Directory to save XML formatted results to
  --xmlf <xmlf>    File name to save XML formatted results to. When present, overrides default name
  --dt <dt>        The custom date/time format to use when displaying time stamps [default: yyyy-MM-dd HH:mm:ss.fffffff]
  --inc <inc>      List of Event IDs to process. All others are ignored. Overrides --exc Format is 4624,4625,5410
  --exc <exc>      List of Event IDs to IGNORE. All others are included. Format is 4624,4625,5410
  --sd <sd>        Start date for including events (UTC). Anything OLDER than this is dropped. Format should match --dt
  --ed <ed>        End date for including events (UTC). Anything NEWER than this is dropped. Format should match --dt
  --fj             When true, export all available data when using --json [default: False]
  --tdt <tdt>      The number of seconds to use for time discrepancy detection [default: 1]
  --met            When true, show metrics about processed event log [default: True]
  --maps <maps>    The path where event maps are located. Defaults to 'Maps' folder where program was executed
                   [default: C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\EvtxeCmd\Maps]
  --vss            Process all Volume Shadow Copies that exist on drive specified by -f or -d [default: False]
  --dedupe         Deduplicate -f or -d & VSCs based on SHA-1. First file found wins [default: True]
  --sync           If true, the latest maps from https://github.com/EricZimmerman/evtx/tree/master/evtx/Maps are
                   downloaded and local maps updated [default: False]
  --debug          Show debug information during processing [default: False]
  --trace          Show trace information during processing [default: False]
  --version        Show version information
  -?, -h, --help   Show help and usage information
```

![Màn hình help của EvtxeCmd hiển thị các tuỳ chọn xử lý file EVTX, chuyển log sang CSV/JSON và include/exclude event ID.](images/win_dfir_winevt4_.png)

#### Maps trong EvtxECmd

Maps trong `EvtxECmd` đóng vai trò then chốt. Chúng chuyển đổi dữ liệu tuỳ biến thành các field chuẩn hoá trong dữ liệu CSV (và JSON). Mức độ chi tiết và chính xác này là không thể thiếu trong điều tra forensic, giúp analyst diễn giải và trích xuất thông tin nổi bật từ Windows Event Logs một cách tinh tế.

Các field chuẩn hoá trong maps:
- `UserName`: Chứa thông tin về user và/hoặc domain có trong các event log khác nhau
- `ExecutableInfo`: Chứa thông tin về command line của process, scheduled task, v.v.
- `PayloadData1,2,3,4,5,6`: Các field bổ sung để trích xuất và đặt dữ liệu ngữ cảnh từ event log
- `RemoteHost`: Chứa thông tin về địa chỉ IP

`EvtxECmd` đóng vai trò quan trọng trong việc:
- Chuyển đổi phần riêng biệt của một event, gọi là EventData, sang định dạng chuẩn hoá và dễ đọc hơn.
- Đảm bảo các file map được thiết kế riêng cho từng event log cụ thể, như Security, Application hoặc log tuỳ biến, để xử lý sự khác biệt về cấu trúc và dữ liệu của event.
- Dùng một định danh duy nhất, phần tử Channel, để chỉ rõ một file map được thiết kế cho event log nào, tránh nhầm lẫn khi event ID được dùng lại giữa các log khác nhau.

Để đảm bảo các map mới nhất đã có sẵn trước khi chuyển file EVTX sang CSV/JSON, hãy dùng lệnh dưới đây.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\EvtxeCmd> .\EvtxECmd.exe --sync
EvtxECmd version 1.5.0.0

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/evtx

Checking for updated maps at https://github.com/EricZimmerman/evtx/tree/master/evtx/Maps...

Updates found!

New maps
Application_ESENT_216
CiscoSecureEndpoint-Events_CiscoSecureEndpoint_100
CiscoSecureEndpoint-Events_CiscoSecureEndpoint_1300
CiscoSecureEndpoint-Events_CiscoSecureEndpoint_1310
Kaspersky-Security_OnDemandScan_3023
Kaspersky-Security_Real-Time_File_Protection_3023
Microsoft-Windows-Hyper-V-VMMS-Admin_Microsoft-Windows-Hyper-V-VMMS_13002
Microsoft-Windows-Hyper-V-VMMS-Admin_Microsoft-Windows-Hyper-V-VMMS_18304
Microsoft-Windows-Hyper-V-VMMS-Admin_Microsoft-Windows-Hyper-V-Worker_13003
Microsoft-Windows-Hyper-V-Worker-Admin_Microsoft-Windows-Hyper-V-Worker_18303
Microsoft-Windows-Hyper-V-Worker-Admin_Microsoft-Windows-Hyper-V-Worker_18504
Microsoft-Windows-Hyper-V-Worker-Admin_Microsoft-Windows-Hyper-V-Worker_18512
Microsoft-Windows-Windows-Defender-Operational_Microsoft-Windows-Windows-Defender_2050
PowerShellCore-Operational_PowerShellCore_4104
Security_Microsoft-Windows-Security-Auditing_6272
Security_Microsoft-Windows-Security-Auditing_6273

Updated maps
Microsoft-Windows-Hyper-V-Worker-Admin_Microsoft-Windows-Hyper-V-Worker_18500
Microsoft-Windows-Hyper-V-Worker-Admin_Microsoft-Windows-Hyper-V-Worker_18502
Microsoft-Windows-Hyper-V-Worker-Admin_Microsoft-Windows-Hyper-V-Worker_18508
Microsoft-Windows-Hyper-V-Worker-Admin_Microsoft-Windows-Hyper-V-Worker_18514
Microsoft-Windows-SMBServer-Security_Microsoft-Windows-SMBServer_551
Security_Microsoft-Windows-Security-Auditing_4616
```

Với các map mới nhất đã được tích hợp, ta có thể đưa thông tin ngữ cảnh vào các field riêng biệt, giúp quá trình phân tích log gọn gàng hơn. Giờ là lúc chuyển các log sang một định dạng dễ "tiêu hoá" hơn.

Để các file EVTX dễ tiếp cận hơn, ta có thể dùng `EvtxECmd` để chuyển đổi liền mạch các file event log sang các định dạng thân thiện như JSON hoặc CSV.

Ví dụ, lệnh dưới đây chuyển file `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\winevt\logs\Microsoft-Windows-Sysmon%4Operational.evtx` sang file CSV:

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\EvtxeCmd> .\EvtxECmd.exe -f "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\winevt\logs\Microsoft-Windows-Sysmon%4Operational.evtx" --csv "C:\Users\johndoe\Desktop\forensic_data\event_logs\csv_timeline" --csvf kape_event_log.csv
EvtxECmd version 1.5.0.0

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/evtx

Command line: -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\winevt\logs\Microsoft-Windows-Sysmon%4Operational.evtx --csv C:\Users\johndoe\Desktop\forensic_data\event_logs\csv_timeline --csvf kape_event_log.csv

Warning: Administrator privileges not found!

CSV output will be saved to C:\Users\johndoe\Desktop\forensic_data\event_logs\csv_timeline\kape_event_log.csv

Processing C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\winevt\logs\Microsoft-Windows-Sysmon%4Operational.evtx...

Event log details
Flags: None
Chunk count: 28
Stored/Calculated CRC: 3EF9F1C/3EF9F1C
Earliest timestamp: 2023-09-07 08:23:18.4430130
Latest timestamp:   2023-09-07 08:33:00.0069805
Total event log records found: 1,920

Records included: 1,920 Errors: 0 Events dropped: 0

Metrics (including dropped events)
Event ID        Count
1               95
2               76
3               346
4               1
8               44
10              6
11              321
12              674
13              356
16              1

Processed 1 file in 8.7664 seconds
```

Sau khi import file CSV kết quả vào `Timeline Explorer`, ta sẽ thấy như dưới đây.

![Timeline Explorer hiển thị các log đã chuyển đổi với các event như 'Engine state changed', 'RegistryEvent' và 'Process creation', đánh dấu command line và chi tiết event.](images/win_dfir_winevt6.png)

**Thông tin thực thi (Executable Information)**:

![Executable Info hiển thị các command line cho thiết lập nguồn điện (power settings), chỉnh sửa registry, scheduled task và call trace liên quan đến các file hệ thống và ứng dụng.](images/win_dfir_winevt7.png)

#### Điều tra Windows Event Logs với EQL

[Endgame's Event Query Language (EQL)](https://github.com/endgameinc/eqllib) là một công cụ không thể thiếu để sàng lọc event log, xác định các mối đe doạ bảo mật tiềm ẩn và phát hiện hoạt động đáng ngờ trên hệ thống Windows. EQL cung cấp một ngôn ngữ có cấu trúc, hỗ trợ truy vấn và tương quan event trên nhiều nguồn log, bao gồm cả Windows Event Logs.

Hiện tại, module EQL tương thích với Python phiên bản 2.7 và 3.5+. Nếu bạn đã cài một phiên bản Python được hỗ trợ, hãy chạy lệnh sau.

```cmd-session
C:\Users\johndoe>pip install eql
```

Nếu Python được cấu hình đúng và đã được thêm vào PATH, eql sẽ có thể dùng được. Để kiểm tra, hãy chạy lệnh dưới đây.

```cmd-session
C:\Users\johndoe>eql --version
eql 0.9.18
```

Trong repository của EQL (có tại `C:\Users\johndoe\Desktop\eqllib-master`) có một PowerShell module chứa các hàm thiết yếu được thiết kế riêng để parse Sysmon event từ Windows Event Logs. Module này nằm trong thư mục `utils` của `eqllib` và có tên `scrape-events.ps1`.

Từ thư mục EQL, hãy nạp module scrape-events.ps1 bằng lệnh sau:

```powershell-session
PS C:\Users\johndoe\Desktop\eqllib-master\utils> import-module .\scrape-events.ps1 
```

Làm như vậy sẽ kích hoạt hàm `Get-EventProps`, đóng vai trò quan trọng trong việc parse các thuộc tính event từ Sysmon log. Ví dụ, để chuyển `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\winevt\logs\Microsoft-Windows-Sysmon%4Operational.evtx` sang định dạng JSON phù hợp cho EQL query, hãy chạy lệnh dưới đây.

```powershell-session
PS C:\Users\johndoe\Desktop\eqllib-master\utils> Get-WinEvent -Path C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\winevt\logs\Microsoft-Windows-Sysmon%4Operational.evtx -Oldest | Get-EventProps | ConvertTo-Json | Out-File -Encoding ASCII -FilePath C:\Users\johndoe\Desktop\forensic_data\event_logs\eql_format_json\eql-sysmon-data-kape.json
```

Thao tác này sẽ tạo ra một file JSON, sẵn sàng cho các EQL query.

Giờ hãy xem cách ta có thể phát hiện việc liệt kê user/group (user/group enumeration) bằng một EQL query trên file JSON vừa tạo.

```cmd-session
C:\Users\johndoe>eql query -f C:\Users\johndoe\Desktop\forensic_data\event_logs\eql_format_json\eql-sysmon-data-kape.json "EventId=1 and (Image='*net.exe' and (wildcard(CommandLine, '* user*', '*localgroup *', '*group *')))"
{"CommandLine": "net  localgroup \"Remote Desktop Users\" backgroundTask /add", "Company": "Microsoft Corporation", "CurrentDirectory": "C:\\Temp\\", "Description": "Net Command", "EventId": 1, "FileVersion": "10.0.19041.1 (WinBuild.160101.0800)", "Hashes": "MD5=0BD94A338EEA5A4E1F2830AE326E6D19,SHA256=9F376759BCBCD705F726460FC4A7E2B07F310F52BAA73CAAAAA124FDDBDF993E,IMPHASH=57F0C47AE2A1A2C06C8B987372AB0B07", "Image": "C:\\Windows\\System32\\net.exe", "IntegrityLevel": "High", "LogonGuid": "{b5ae2bdd-9f94-64ec-0000-002087490200}", "LogonId": "0x24987", "ParentCommandLine": "C:\\Windows\\system32\\cmd.exe /c install.bat", "ParentImage": "C:\\Windows\\System32\\cmd.exe", "ParentProcessGuid": "{b5ae2bdd-8a0f-64f9-0000-00104cfc4700}", "ParentProcessId": "6540", "ProcessGuid": "{b5ae2bdd-8a14-64f9-0000-0010e8804800}", "ProcessId": "3808", "Product": "Microsoft? Windows? Operating System", "RuleName": null, "TerminalSessionId": "1", "User": "HTBVM01\\John Doe", "UtcTime": "2023-09-07 08:30:12.178"}
{"CommandLine": "net  users  ", "Company": "Microsoft Corporation", "CurrentDirectory": "C:\\Temp\\", "Description": "Net Command", "EventId": 1, "FileVersion": "10.0.19041.1 (WinBuild.160101.0800)", "Hashes": "MD5=0BD94A338EEA5A4E1F2830AE326E6D19,SHA256=9F376759BCBCD705F726460FC4A7E2B07F310F52BAA73CAAAAA124FDDBDF993E,IMPHASH=57F0C47AE2A1A2C06C8B987372AB0B07", "Image": "C:\\Windows\\System32\\net.exe", "IntegrityLevel": "High", "LogonGuid": "{b5ae2bdd-9f94-64ec-0000-002087490200}", "LogonId": "0x24987", "ParentCommandLine": "cmd.exe /c ping -n 10 127.0.0.1 > nul && net users > users.txt && net localgroup > groups.txt && ipconfig >ipinfo.txt && netstat -an >networkinfo.txt && del /F /Q C:\\Temp\\discord.exe", "ParentImage": "C:\\Windows\\System32\\cmd.exe", "ParentProcessGuid": "{b5ae2bdd-8a19-64f9-0000-0010c5914800}", "ParentProcessId": "4040", "ProcessGuid": "{b5ae2bdd-8a22-64f9-0000-0010c59f4800}", "ProcessId": "5364", "Product": "Microsoft? Windows? Operating System", "RuleName": null, "TerminalSessionId": "1", "User": "HTBVM01\\John Doe", "UtcTime": "2023-09-07 08:30:26.851"}
{"CommandLine": "net  localgroup  ", "Company": "Microsoft Corporation", "CurrentDirectory": "C:\\Temp\\", "Description": "Net Command", "EventId": 1, "FileVersion": "10.0.19041.1 (WinBuild.160101.0800)", "Hashes": "MD5=0BD94A338EEA5A4E1F2830AE326E6D19,SHA256=9F376759BCBCD705F726460FC4A7E2B07F310F52BAA73CAAAAA124FDDBDF993E,IMPHASH=57F0C47AE2A1A2C06C8B987372AB0B07", "Image": "C:\\Windows\\System32\\net.exe", "IntegrityLevel": "High", "LogonGuid": "{b5ae2bdd-9f94-64ec-0000-002087490200}", "LogonId": "0x24987", "ParentCommandLine": "cmd.exe /c ping -n 10 127.0.0.1 > nul && net users > users.txt && net localgroup > groups.txt && ipconfig >ipinfo.txt && netstat -an >networkinfo.txt && del /F /Q C:\\Temp\\discord.exe", "ParentImage": "C:\\Windows\\System32\\cmd.exe", "ParentProcessGuid": "{b5ae2bdd-8a19-64f9-0000-0010c5914800}", "ParentProcessId": "4040", "ProcessGuid": "{b5ae2bdd-8a22-64f9-0000-001057a24800}", "ProcessId": "4832", "Product": "Microsoft? Windows? Operating System", "RuleName": null, "TerminalSessionId": "1", "User": "HTBVM01\\John Doe", "UtcTime": "2023-09-07 08:30:26.925"}
```

![Phân tích event hiển thị các command line thêm user vào group và liệt kê user, đánh dấu các event đáng ngờ với net.exe và việc sử dụng command line.](images/win_dfir_winevt11.png)

#### Windows Registry

Đào sâu vào các registry hive có thể cung cấp cho ta những thông tin vô giá, như tên máy tính, phiên bản Windows, tên chủ sở hữu và cấu hình mạng.

Các file liên quan tới registry được KAPE thu thập thường nằm trong
`<KAPE_output_folder>\Windows\System32\config`

![File Explorer hiển thị thư mục config với các file: DEFAULT, SAM, SECURITY, SOFTWARE, SYSTEM, ngày 9/7/2023.](images/img10.png)

Ngoài ra, còn có các registry hive riêng của từng user nằm trong thư mục của từng user, như minh hoạ trong ảnh chụp dưới đây.

![Registry Explorer hiển thị hive SYSTEM với key ComputerName có giá trị HTBVM01, sửa đổi lần cuối ngày 8/28/2023.](images/win_dfir_registry1_.png)

Để phân tích toàn diện, ta có thể dùng `Registry Explorer` (có tại `C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6\RegistryExplorer`), một công cụ có giao diện đồ hoạ (GUI) do Eric Zimmerman tạo ra. Công cụ này cung cấp giao diện gọn gàng để duyệt và mổ xẻ nội dung các Windows Registry hive. Chỉ cần kéo thả các file này vào Registry Explorer, công cụ sẽ xử lý dữ liệu và hiển thị trong GUI. Khung bên trái hiển thị các registry hive, còn khung bên phải hiển thị các value tương ứng.

Trong ảnh chụp dưới đây, ta đã nạp hive `SYSTEM`, có thể tìm thấy trong thư mục `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config` trên máy target của section này.

![Registry Explorer hiển thị hive SOFTWARE với key CurrentVersion, ProductName là Windows 10 Enterprise LTSC 2021 Evaluation và RegisteredOwner là John Doe.](images/img11.png)

Registry Explorer có nhiều tính năng, bao gồm phân tích hive, tìm kiếm, tuỳ chọn lọc, xem timestamp và bookmark. Tiện ích bookmark đặc biệt hữu ích, cho phép người dùng đánh dấu các vị trí hoặc key quan trọng để tham khảo sau.

Trong ảnh chụp dưới đây, ta đã nạp hive `SOFTWARE`, có thể tìm thấy trong thư mục `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config` trên máy target của section này. Chú ý các bookmark có sẵn trong Registry Explorer.

![Registry Explorer hiển thị hive SOFTWARE với key CurrentVersion, ProductName là Windows 10 Enterprise LTSC 2021 Evaluation và RegisteredOwner là John Doe.](images/img12.png)

#### RegRipper

Một công cụ mạnh khác trong kho vũ khí của ta là `RegRipper` (có tại `C:\Users\johndoe\Desktop\RegRipper3.0-master`), một tiện ích command-line chuyên trích xuất nhanh thông tin từ Registry.

Để làm quen với các chức năng của RegRipper, hãy mở phần help bằng cách chạy `rip.exe` kèm tham số `-h`.

```powershell-session
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -h
Rip v.3.0 - CLI RegRipper tool
Rip [-r Reg hive file] [-f profile] [-p plugin] [options]
Parse Windows Registry files, using either a single module, or a profile.

NOTE: This tool does NOT automatically process Registry transaction logs! The tool
does check to see if the hive is dirty, but does not automatically process the
transaction logs.  If you need to incorporate transaction logs, please consider
using yarp + registryFlush.py, or rla.exe from Eric Zimmerman.

  -r [hive] .........Registry hive file to parse
  -d ................Check to see if the hive is dirty
  -g ................Guess the hive file type
  -a ................Automatically run hive-specific plugins
  -aT ...............Automatically run hive-specific TLN plugins
  -f [profile].......use the profile
  -p [plugin]........use the plugin
  -l ................list all plugins
  -c ................Output plugin list in CSV format (use with -l)
  -s systemname......system name (TLN support)
  -u username........User name (TLN support)
  -uP ...............Update default profiles
  -h.................Help (print this information)

Ex: C:\>rip -r c:\case\system -f system
    C:\>rip -r c:\case\ntuser.dat -p userassist
    C:\>rip -r c:\case\ntuser.dat -a
    C:\>rip -l -c

All output goes to STDOUT; use redirection (ie, > or >>) to output to a file.

copyright 2020 Quantum Analytics Research, LLC
```

Để dùng RegRipper trơn tru, cần làm quen với các plugin của nó. Để liệt kê toàn bộ plugin có sẵn và lưu danh mục vào một file CSV (vd: `rip_plugins.csv`), hãy dùng lệnh dưới đây.

```powershell-session
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -l -c > rip_plugins.csv
```

Thao tác này tạo ra danh sách đầy đủ các plugin, kèm chi tiết các hive liên quan, và lưu thành file CSV.

Ảnh chụp dưới đây làm rõ nội dung của file này, đánh dấu tên plugin, registry hive tương ứng và mô tả ngắn gọn.

![LibreOffice Calc hiển thị rip_plugins.csv với các cột: Plugin, Version, Hive và Description, liệt kê các plugin như cmdproc và cmd_shell.](images/win_dfir_regripper_5.png)

Để bắt đầu, hãy chạy lệnh `compname` trên hive SYSTEM (nằm tại `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config`), lệnh này lấy ra tên máy tính.

```powershell-session
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -r "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config\SYSTEM" -p compname
Launching compname v.20090727
compname v.20090727
(System) Gets ComputerName and Hostname values from System hive

ComputerName    = HTBVM01
TCP/IP Hostname = HTBVM01
```

Hãy xem thêm một số ví dụ trên các hive khác nhau.

**Timezone (múi giờ)**

```powershell-session
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -r "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config\SYSTEM" -p timezone
Launching timezone v.20200518
timezone v.20200518
(System) Get TimeZoneInformation key contents

TimeZoneInformation key
ControlSet001\Control\TimeZoneInformation
LastWrite Time 2023-08-28 23:03:03Z
  DaylightName   -> @tzres.dll,-211
  StandardName   -> @tzres.dll,-212
  Bias           -> 480 (8 hours)
  ActiveTimeBias -> 420 (7 hours)
  TimeZoneKeyName-> Pacific Standard Time
```

**Thông tin mạng (Network Information)**

```powershell-session
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -r "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config\SYSTEM" -p nic2
Launching nic2 v.20200525
nic2 v.20200525
(System) Gets NIC info from System hive

Adapter: {50c7b4ab-b059-43f4-8b0f-919502abc934}
LastWrite Time: 2023-09-07 08:01:06Z
  EnableDHCP                   0
  Domain
  NameServer                   10.10.10.100
  DhcpServer                   255.255.255.255
  Lease                        1800
  LeaseObtainedTime            2023-09-07 07:58:03Z
  T1                           2023-09-07 08:13:03Z
  T2                           2023-09-07 08:24:18Z
  LeaseTerminatesTime          2023-09-07 08:28:03Z
  AddressType                  0
  IsServerNapAware             0
  DhcpConnForceBroadcastFlag   0
  DhcpInterfaceOptions         ├╝               ├Ä☻  w               ├Ä☻  /               ├Ä☻  .               ├Ä☻  ,               ├Ä☻  +               ├Ä☻  !               ├Ä☻  ▼               ├Ä☻  ♥               ├Ä☻  ☼               ├Ä☻  ♠               ├Ä☻  ☺               ├Ä☻  3               ├Ä☻  6               ├Ä☻  5               ├Ä☻
  DhcpGatewayHardware          ├Ç┬¿┬╢☻♠    PV├Ñ┬ó┬¥
  DhcpGatewayHardwareCount     1
  RegistrationEnabled          1
  RegisterAdapterName          0
  IPAddress                    10.10.10.11
  SubnetMask                   255.0.0.0
  DefaultGateway               10.10.10.100
  DefaultGatewayMetric         0

ControlSet001\Services\Tcpip\Parameters\Interfaces has no subkeys.
Adapter: {6c733e3b-de84-487a-a0bd-48b9d9ec7616}
LastWrite Time: 2023-09-07 08:01:06Z
  EnableDHCP                   1
  Domain
  NameServer
  RegistrationEnabled          1
  RegisterAdapterName          0
```

Thông tin tương tự cũng có thể được trích xuất bằng plugin `ips`.

**Thực thi trình cài đặt (Installer Execution)**

```powershell-session
Microsoft\Windows\CurrentVersion\Installer\UserData not found.
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -r "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config\SOFTWARE" -p installer
Launching installer v.20200517
Launching installer v.20200517
(Software) Determines product install information

Installer
Microsoft\Windows\CurrentVersion\Installer\UserData

User SID: S-1-5-18
Key      : 01DCD275E2FC1D341815B89DCA09680D
LastWrite: 2023-08-28 09:39:56Z
20230828 - Microsoft Visual C++ 2019 X86 Additional Runtime - 14.28.29913 14.28.29913 (Microsoft Corporation)

Key      : 3367A02690A78A24580870A644384C0B
LastWrite: 2023-08-28 09:39:59Z
20230828 - Microsoft Visual C++ 2019 X64 Additional Runtime - 14.28.29913 14.28.29913 (Microsoft Corporation)

Key      : 426D5FF15155343438A75EC40151376E
LastWrite: 2023-08-28 09:40:29Z
20230828 - VMware Tools 11.3.5.18557794 (VMware, Inc.)

Key      : 731DDCEEAD31DE64DA0ADB7F8FEB568B
LastWrite: 2023-08-28 09:39:58Z
20230828 - Microsoft Visual C++ 2019 X64 Minimum Runtime - 14.28.29913 14.28.29913 (Microsoft Corporation)

Key      : DBBE6326F05F3B048B91D80B6C8003C8
LastWrite: 2023-08-28 09:39:55Z
20230828 - Microsoft Visual C++ 2019 X86 Minimum Runtime - 14.28.29913 14.28.29913 (Microsoft Corporation)
```

**Thư mục/tài liệu truy cập gần đây (Recently Accessed Folders/Docs)**

```powershell-session
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -r "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Users\John Doe\NTUSER.DAT" -p recentdocs
Launching recentdocs v.20200427
recentdocs v.20200427
(NTUSER.DAT) Gets contents of user's RecentDocs key

RecentDocs
**All values printed in MRUList\MRUListEx order.
Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs
LastWrite Time: 2023-09-07 08:28:20Z
  2 = The Internet
  7 = threat/
  0 = system32
  6 = This PC
  5 = C:\
  4 = Local Disk (C:)
  3 = Temp
  1 = redirect

Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs\Folder
LastWrite Time 2023-09-07 08:28:20Z
MRUListEx = 1,0,3,2
  1 = The Internet
  0 = system32
  3 = This PC
  2 = Local Disk (C:)
```

**Autostart - Các entry trong Run Key**

```powershell-session
PS C:\Users\johndoe\Desktop\RegRipper3.0-master> .\rip.exe -r "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Users\John Doe\NTUSER.DAT" -p run
Launching run v.20200511
run v.20200511
(Software, NTUSER.DAT) [Autostart] Get autostart key contents from Software hive

Software\Microsoft\Windows\CurrentVersion\Run
LastWrite Time 2023-09-07 08:30:07Z
  MicrosoftEdgeAutoLaunch_0562217A6A32A7E92C68940F512715D9 - "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --no-startup-window --win-session-start /prefetch:5
  DiscordUpdate - C:\Windows\Tasks\update.exe

Software\Microsoft\Windows\CurrentVersion\Run has no subkeys.

Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Run not found.

Software\Microsoft\Windows\CurrentVersion\RunOnce not found.

Software\Microsoft\Windows\CurrentVersion\RunServices not found.

Software\Microsoft\Windows\CurrentVersion\RunServicesOnce not found.

Software\Microsoft\Windows NT\CurrentVersion\Terminal Server\Install\Software\Microsoft\Windows\CurrentVersion\Run not found.

Software\Microsoft\Windows NT\CurrentVersion\Terminal Server\Install\Software\Microsoft\Windows\CurrentVersion\RunOnce not found.

Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run not found.

Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run not found.

Software\Microsoft\Windows\CurrentVersion\StartupApproved\Run not found.

Software\Microsoft\Windows\CurrentVersion\StartupApproved\Run32 not found.

Software\Microsoft\Windows\CurrentVersion\StartupApproved\StartupFolder not found.
```

#### Các artifact về thực thi chương trình (Program Execution Artifacts)

Khi nói về `execution artifacts` trong digital forensics, ta đang nói đến các dấu vết và bằng chứng còn sót lại trên máy tính hoặc thiết bị khi một chương trình chạy. Những mẩu thông tin nhỏ này có thể cho ta manh mối về hoạt động và hành vi của phần mềm, người dùng, và cả những kẻ có ý đồ xấu. Nếu muốn ghép lại những gì đã xảy ra trên một máy tính, việc đào sâu vào các execution artifact này là bắt buộc.

Bạn có thể bắt gặp một số execution artifact nổi tiếng trong các thành phần Windows sau:
- `Prefetch`
- `ShimCache`
- `Amcache`
- `BAM (Background Activity Moderator)`

Hãy đi sâu vào từng thành phần để hiểu rõ hơn loại thông tin về thực thi chương trình mà chúng ghi lại.

#### Điều tra Prefetch

`Prefetch` là một tính năng của hệ điều hành Windows giúp tối ưu việc nạp ứng dụng bằng cách nạp trước một số thành phần và dữ liệu. File prefetch được tạo cho mọi chương trình được thực thi trên hệ thống Windows, bao gồm cả ứng dụng đã cài đặt lẫn các file thực thi độc lập. Quy tắc đặt tên file prefetch dựa trên tên gốc của file thực thi, theo sau là một giá trị hexa của đường dẫn nơi file thực thi nằm, và kết thúc bằng phần mở rộng `.pf`.

Trong digital forensics, thư mục Prefetch và các file liên quan có thể cung cấp thông tin giá trị về các ứng dụng đã được thực thi trên hệ thống Windows. Forensic analyst có thể xem xét các file prefetch để xác định ứng dụng nào đã được chạy, chạy bao nhiêu lần và lần chạy gần nhất là khi nào.

Nhìn chung, file prefetch được lưu trong thư mục `C:\Windows\Prefetch\`.

Các file liên quan tới prefetch được KAPE thu thập thường nằm trong
`<KAPE_output_folder>\Windows\prefetch`.

![File Explorer hiển thị thư mục prefetch của Windows với các file như DISCORD.EXE-7191FAD6.pf, kích thước 10 KB.](images/win_dfir_prefetch_.png)

Eric Zimmerman cung cấp một công cụ cho file prefetch: `PECmd` (có tại `C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6`).

Dưới đây là ví dụ cách mở menu help của PECmd từ thư mục công cụ EricZimmerman.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\PECmd.exe -h
Description:
  PECmd version 1.5.0.0

  Author: Eric Zimmerman (saericzimmerman@gmail.com)
  https://github.com/EricZimmerman/PECmd

  Examples: PECmd.exe -f "C:\Temp\CALC.EXE-3FBEF7FD.pf"
            PECmd.exe -f "C:\Temp\CALC.EXE-3FBEF7FD.pf" --json "D:\jsonOutput" --jsonpretty
            PECmd.exe -d "C:\Temp" -k "system32, fonts"
            PECmd.exe -d "C:\Temp" --csv "c:\temp" --csvf foo.csv --json c:\temp\json
            PECmd.exe -d "C:\Windows\Prefetch"

            Short options (single letter) are prefixed with a single dash. Long commands are prefixed with two dashes

Usage:
  PECmd [options]

Options:
  -f <f>           File to process. Either this or -d is required
  -d <d>           Directory to recursively process. Either this or -f is required
  -k <k>           Comma separated list of keywords to highlight in output. By default, 'temp' and 'tmp' are
                   highlighted. Any additional keywords will be added to these
  -o <o>           When specified, save prefetch file bytes to the given path. Useful to look at decompressed Win10
                   files
  -q               Do not dump full details about each file processed. Speeds up processing when using --json or --csv 
                   [default: False]
  --json <json>    Directory to save JSON formatted results to. Be sure to include the full path in double quotes
  --jsonf <jsonf>  File name to save JSON formatted results to. When present, overrides default name
  --csv <csv>      Directory to save CSV formatted results to. Be sure to include the full path in double quotes
  --csvf <csvf>    File name to save CSV formatted results to. When present, overrides default name
  --html <html>    Directory to save xhtml formatted results to. Be sure to include the full path in double quotes
  --dt <dt>        The custom date/time format to use when displaying time stamps. See https://goo.gl/CNVq0k for
                   options [default: yyyy-MM-dd HH:mm:ss]
  --mp             When true, display higher precision for timestamps [default: False]
  --vss            Process all Volume Shadow Copies that exist on drive specified by -f or -d [default: False]
  --dedupe         Deduplicate -f or -d & VSCs based on SHA-1. First file found wins [default: False]
  --debug          Show debug information during processing [default: False]
  --trace          Show trace information during processing [default: False]
  --version        Show version information
  -?, -h, --help   Show help and usage information
```

![Màn hình help của PECmd hiển thị các tuỳ chọn xử lý file prefetch, với lệnh cho một file thực thi đơn lẻ hoặc một thư mục, và các định dạng output như CSV và JSON.](images/win_dfir_prefetch1_.png)

PECmd sẽ phân tích file prefetch (`.pf`) và hiển thị nhiều thông tin về việc thực thi ứng dụng. Thông tin này thường bao gồm các chi tiết như:

- Timestamp của lần thực thi đầu tiên và cuối cùng.
- Số lần ứng dụng đã được thực thi.
- Thông tin volume và thư mục.
- Tên và đường dẫn ứng dụng.
- Thông tin file, như kích thước file và giá trị hash.

Hãy thử bằng cách cung cấp đường dẫn tới một file prefetch đơn lẻ, ví dụ file prefetch liên quan tới `discord.exe` (tức DISCORD.EXE-7191FAD6.pf nằm tại `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch`).

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\PECmd.exe -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch\DISCORD.EXE-7191FAD6.pf
PECmd version 1.5.0.0

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/PECmd

Command line: -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch\DISCORD.EXE-7191FAD6.pf

Warning: Administrator privileges not found!

Keywords: temp, tmp

Processing C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch\DISCORD.EXE-7191FAD6.pf

Created on: 2023-09-07 08:30:16
Modified on: 2023-09-07 08:30:16
Last accessed on: 2023-09-17 15:55:01

Executable name: DISCORD.EXE
Hash: 7191FAD6
File size (bytes): 51,104
Version: Windows 10 or Windows 11

Run count: 1
Last run: 2023-09-07 08:30:06

Volume information:

#0: Name: \VOLUME{01d9da035d4d8f00-285d5e74} Serial: 285D5E74 Created: 2023-08-28 22:59:56 Directories: 23 File references: 106

Directories referenced: 23

00: \VOLUME{01d9da035d4d8f00-285d5e74}\$EXTEND
01: \VOLUME{01d9da035d4d8f00-285d5e74}\TEMP (Keyword True)
02: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS
03: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE
04: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA
05: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL
06: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT
07: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS
08: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS\CACHES
09: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS\INETCACHE
10: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS\INETCACHE\IE
11: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS\INETCACHE\IE\8O7R2XTQ
12: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\TEMP (Keyword True)
13: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\DOWNLOADS
14: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS
15: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\APPPATCH
16: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\GLOBALIZATION
17: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\GLOBALIZATION\SORTING
18: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\REGISTRATION
19: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32
20: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DRIVERS
21: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\EN-US
22: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\TASKS

Files referenced: 76

00: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\NTDLL.DLL
01: \VOLUME{01d9da035d4d8f00-285d5e74}\TEMP\DISCORD.EXE (Executable: True)
02: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\KERNEL32.DLL
03: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\KERNELBASE.DLL
04: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\LOCALE.NLS
05: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\APPHELP.DLL
06: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\APPPATCH\SYSMAIN.SDB
07: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\ADVAPI32.DLL
08: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\MSVCRT.DLL
09: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SECHOST.DLL
10: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\RPCRT4.DLL
11: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SHELL32.DLL
12: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\MSVCP_WIN.DLL
13: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\UCRTBASE.DLL
14: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\USER32.DLL
15: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\NETAPI32.DLL
16: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WIN32U.DLL
17: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\GDI32.DLL
18: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\GDI32FULL.DLL
19: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WS2_32.DLL
20: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WININET.DLL
21: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\NETUTILS.DLL
22: \VOLUME{01d9da035d4d8f00-285d5e74}\$MFT
23: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SAMCLI.DLL
24: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\IMM32.DLL
25: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DRIVERS\CONDRV.SYS
26: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\NTMARTA.DLL
27: \VOLUME{01d9da035d4d8f00-285d5e74}\TEMP\UNINSTALL.EXE (Keyword: True)
28: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\TASKS\MICROSOFT.WINDOWSKITS.FEEDBACK.EXE
29: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\DOWNLOADS\UNINSTALL.EXE:ZONE.IDENTIFIER
30: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\TASKS\MICROSOFT.WINDOWSKITS.FEEDBACK.EXE:ZONE.IDENTIFIER
31: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\IERTUTIL.DLL
32: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\COMBASE.DLL
33: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SHCORE.DLL
34: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\GLOBALIZATION\SORTING\SORTDEFAULT.NLS
35: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SSPICLI.DLL
36: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINDOWS.STORAGE.DLL
37: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WLDP.DLL
38: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SHLWAPI.DLL
39: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\PROFAPI.DLL
40: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\ONDEMANDCONNROUTEHELPER.DLL
41: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINHTTP.DLL
42: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\KERNEL.APPCORE.DLL
43: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\MSWSOCK.DLL
44: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\IPHLPAPI.DLL
45: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINNSI.DLL
46: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\NSI.DLL
47: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\URLMON.DLL
48: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SRVCLI.DLL
49: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\OLEAUT32.DLL
50: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\OLE32.DLL
51: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DNSAPI.DLL
52: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\RASADHLP.DLL
53: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\FWPUCLNT.DLL
54: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\BCRYPT.DLL
55: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\EN-US\MSWSOCK.DLL.MUI
56: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WSHQOS.DLL
57: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\EN-US\WSHQOS.DLL.MUI
58: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\C_20127.NLS
59: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS\INETCACHE\IE\8O7R2XTQ\DISCORDSETUP[1].EXE
60: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\TEMP\DISCORDSETUP.EXE (Keyword: True)
61: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\TASKS\UPDATE.EXE
62: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\BCRYPTPRIMITIVES.DLL
63: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\RPCSS.DLL
64: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\UXTHEME.DLL
65: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\PROPSYS.DLL
66: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\CFGMGR32.DLL
67: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\CLBCATQ.DLL
68: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\REGISTRATION\R000000000006.CLB
69: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS\CACHES\CVERSIONS.1.DB
70: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS\CACHES\{AFBF9F1A-8EE8-4C77-AF34-C647E37CA0D9}.1.VER0X0000000000000003.DB
71: \VOLUME{01d9da035d4d8f00-285d5e74}\USERS\DESKTOP.INI
72: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SAMLIB.DLL
73: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\CRYPTBASE.DLL
74: \VOLUME{01d9da035d4d8f00-285d5e74}\TEMP\INSTALL.BAT (Keyword: True)
75: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\CMD.EXE


---------- Processed C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch\DISCORD.EXE-7191FAD6.pf in 0.29670430 seconds ----------
```

Khi cuộn xuống output, ta có thể thấy các thư mục được file thực thi này tham chiếu.

![Eric Zimmerman Tools hiển thị 23 thư mục được tham chiếu, gồm các đường dẫn như \VOLUME\USERS\JOHN DOE\APPDATA\LOCAL\MICROSOFT\WINDOWS và \VOLUME\WINDOWS\SYSTEM32, với 76 file được tham chiếu.](images/win_dfir_prefetch3.png)

Cuộn tiếp xuống output sẽ thấy các file được file thực thi này tham chiếu.

![Eric Zimmerman Tools hiển thị 76 file được tham chiếu, gồm các đường dẫn như \VOLUME\WINDOWS\SYSTEM32\NTDLL.DLL và \VOLUME\TEMP\DISCORD.EXE.](images/win_dfir_prefetch4.png)

#### Hoạt động đáng ngờ trong các file được tham chiếu

Ta cũng nên xem xét thư mục nơi ứng dụng được thực thi. Nếu nó được chạy từ một vị trí bất thường hoặc không mong đợi, đó có thể là dấu hiệu đáng ngờ. Ví dụ, ảnh chụp dưới đây cho thấy một số vị trí và file đáng ngờ.

![Eric Zimmerman Tools hiển thị các đường dẫn file, gồm \VOLUME\USERS\JOHN DOE\APPDATA\LOCAL\TEMP\DISCORDSETUP.EXE và \VOLUME\TEMP\INSTALL.BAT.](images/win_dfir_prefetch5_.png)

#### Chuyển file Prefetch sang CSV

Để phân tích dễ hơn, ta có thể chuyển dữ liệu prefetch sang CSV như sau.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\PECmd.exe -d C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch --csv C:\Users\johndoe\Desktop\forensic_data\prefetch_analysis
PECmd version 1.5.0.0

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/PECmd

Command line: -d C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch --csv C:\Users\johndoe\Desktop\forensic_data\prefetch_analysis

Warning: Administrator privileges not found!

Keywords: temp, tmp

Looking for prefetch files in C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch


Found 161 Prefetch files

Processing C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch\APPLICATIONFRAMEHOST.EXE-8CE9A1EE.pf

Created on: 2023-08-28 09:39:12
Modified on: 2023-09-07 08:28:29
Last accessed on: 2023-09-17 16:02:51

Executable name: APPLICATIONFRAMEHOST.EXE
Hash: 8CE9A1EE
File size (bytes): 61,616
Version: Windows 10 or Windows 11

Run count: 2
Last run: 2023-09-07 08:28:18
Other run times: 2023-08-28 09:39:02

Volume information:

#0: Name: \VOLUME{01d9da035d4d8f00-285d5e74} Serial: 285D5E74 Created: 2023-08-28 22:59:56 Directories: 8 File references: 74

Directories referenced: 8

00: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS
01: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\FONTS
02: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\GLOBALIZATION
03: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\GLOBALIZATION\SORTING
04: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32
05: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\EN-US
06: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEMAPPS
07: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEMAPPS\MICROSOFT.WINDOWS.SECHEALTHUI_CW5N1H2TXYEWY

Files referenced: 84

00: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\NTDLL.DLL
01: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\APPLICATIONFRAMEHOST.EXE (Executable: True)
02: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\KERNEL32.DLL
03: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\KERNELBASE.DLL
04: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\LOCALE.NLS
05: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\MSVCRT.DLL
06: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\COMBASE.DLL
07: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\UCRTBASE.DLL
08: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\RPCRT4.DLL
09: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DXGI.DLL
10: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WIN32U.DLL
11: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\GDI32.DLL
12: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\GDI32FULL.DLL
13: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\MSVCP_WIN.DLL
14: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\USER32.DLL
15: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\IMM32.DLL
16: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\RPCSS.DLL
17: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\KERNEL.APPCORE.DLL
18: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\BCRYPTPRIMITIVES.DLL
19: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\CLBCATQ.DLL
20: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\REGISTRATION\R000000000006.CLB
21: \VOLUME{01d9da035d4d8f00-285d5e74}\$MFT
22: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\APPLICATIONFRAME.DLL
23: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SHCORE.DLL
24: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SHLWAPI.DLL
25: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\OLEAUT32.DLL
26: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\TWINAPI.APPCORE.DLL
27: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\UXTHEME.DLL
28: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\PROPSYS.DLL
29: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DEVOBJ.DLL
30: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\CFGMGR32.DLL
31: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\TWINAPI.DLL
32: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SECHOST.DLL
33: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\BCP47MRM.DLL
34: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\D3D11.DLL
35: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DWMAPI.DLL
36: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\D2D1.DLL
37: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\OLE32.DLL
38: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\ONECOREUAPCOMMONPROXYSTUB.DLL
39: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WIN32KBASE.SYS
40: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\MSCTF.DLL
41: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\D3D10WARP.DLL
42: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\ADVAPI32.DLL
43: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\RESOURCEPOLICYCLIENT.DLL
44: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DRIVERS\DXGMMS2.SYS
45: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DRIVERS\DXGKRNL.SYS
46: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DXCORE.DLL
47: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\DCOMP.DLL
48: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\COREMESSAGING.DLL
49: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WS2_32.DLL
50: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WIN32KFULL.SYS
51: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\EN-US\APPLICATIONFRAME.DLL.MUI
52: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\UIAUTOMATIONCORE.DLL
53: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\GLOBALIZATION\SORTING\SORTDEFAULT.NLS
54: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\SHELL32.DLL
55: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINDOWS.STORAGE.DLL
56: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WLDP.DLL
57: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\PROFAPI.DLL
58: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINDOWS.STATEREPOSITORYCORE.DLL
59: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINDOWS.STATEREPOSITORYPS.DLL
60: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINDOWSCODECS.DLL
61: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\BCRYPT.DLL
62: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEMAPPS\MICROSOFT.WINDOWS.SECHE
---SNIP---
60: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\UMPDC.DLL
61: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SERVICING\CBSAPI.DLL
62: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SOFTWAREDISTRIBUTION\DOWNLOAD\A766D9CA8E03365B463454014B3585CB\CBSHANDLER\STATE
63: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WINDOWS.STORAGE.DLL
64: \VOLUME{01d9da035d4d8f00-285d5e74}\WINDOWS\SYSTEM32\WLDP.DLL


---------- Processed C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\prefetch\WUAUCLT.EXE-5D573F0E.pf in 0.05522470 seconds ----------
Processed 161 out of 161 files in 14.3289 seconds

CSV output will be saved to C:\Users\johndoe\Desktop\forensic_data\prefetch_analysis\20230917160113_PECmd_Output.csv
CSV time line output will be saved to C:\Users\johndoe\Desktop\forensic_data\prefetch_analysis\20230917160113_PECmd_Output_Timeline.csv
```

Thư mục đích chứa output đã parse ở định dạng CSV.

![File Explorer hiển thị thư mục prefetch_analysis với các file: 20230911095240_PECmd_Output.csv và 20230911095240_PECmd_Output_Timeline.csv.](images/win_dfir_prefetch7_.png)

Giờ ta có thể dễ dàng phân tích output trong Timeline Explorer. Hãy nạp cả hai file.

![Timeline Explorer hiển thị output của PECmd với các cột Source Created, Executable Name, Files Loaded, Directories, Run Count và các timestamp thực thi.](images/win_dfir_prefetch9.png)

File output thứ hai là file timeline, hiển thị chi tiết các file thực thi được sắp xếp theo thời điểm chạy.

![Timeline Explorer hiển thị output của PECmd với các cột Line, Tag, Run Time và Executable Name, gồm các entry như DISCORD.EXE và CMD.EXE.](images/win_dfir_prefetch8.png)

#### Điều tra ShimCache (Application Compatibility Cache)

`ShimCache` (còn gọi là AppCompatCache) là một cơ chế được các hệ điều hành Windows sử dụng để xác định các vấn đề tương thích ứng dụng. Cơ sở dữ liệu này ghi lại thông tin về các ứng dụng đã được thực thi và được lưu trong Windows Registry. Developer có thể dùng thông tin này để theo dõi các vấn đề tương thích với các chương trình đã thực thi.

Trong các cache entry của `AppCompatCache`, ta có thể thấy các thông tin như:
- Đường dẫn file đầy đủ
- Timestamp
  - Thời điểm sửa đổi cuối (last modified time) ($Standard_Information)
  - Thời điểm cập nhật cuối (last updated time) (Shimcache)
- Cờ thực thi process (process execution flag)
- Vị trí cache entry

Điều tra viên forensic có thể dùng thông tin này để phát hiện việc thực thi các file có khả năng độc hại.

Key `AppCompatCache` nằm tại vị trí registry `HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\Session Manager\AppCompatCache`.

Hãy nạp registry hive `SYSTEM` (có tại `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\System32\config`) vào `Registry Explorer` và xem nó chứa những thông tin gì. Ta có thể làm điều đó bằng cách mở Registry Explorer và thả các file registry hive vào. Sau đó, ta cần vào bookmarks và chọn `AppCompatCache`. Ở phía dưới bên phải, ta sẽ thấy bằng chứng về việc thực thi ứng dụng như trong ảnh chụp.

![Registry Explorer hiển thị hive SYSTEM với key AppCompatCache, liệt kê các chương trình như NETSTAT.EXE và CMD.EXE kèm thời điểm sửa đổi.](images/img13.png)

#### Điều tra Amcache

`AmCache` là một file registry của Windows dùng để lưu bằng chứng liên quan đến việc thực thi chương trình. Nó là một nguồn tài nguyên giá trị cho digital forensics và điều tra bảo mật, giúp analyst hiểu lịch sử thực thi ứng dụng và phát hiện dấu hiệu của bất kỳ việc thực thi đáng ngờ nào.

Thông tin mà nó chứa bao gồm đường dẫn thực thi, thời điểm thực thi lần đầu, thời điểm bị xoá và lần cài đặt đầu tiên. Nó cũng cung cấp hash của các file thực thi.

Trên hệ điều hành Windows, hive AmCache nằm tại `C:\Windows\AppCompat\Programs\AmCache.hve`

Các file liên quan tới AmCache được KAPE thu thập thường nằm trong
`<KAPE_output_folder>\Windows\AppCompat\Programs`.

Hãy nạp `C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\AppCompat\Programs\AmCache.hve` vào Registry Explorer để xem nó chứa những thông tin gì.

![PowerShell hiển thị kết quả truy vấn service 'bam' với display name 'Background Activity Moderator Driver'.](images/img14.png)

Dùng [AmcacheParser](https://github.com/EricZimmerman/AmcacheParser) của Eric Zimmerman, ta có thể parse và chuyển file này sang CSV, rồi phân tích chi tiết trong Timeline Explorer.

```powershell-session
PS C:\Users\johndoe\Desktop\Get-ZimmermanTools\net6> .\AmcacheParser.exe -f "C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\AppCompat\Programs\AmCache.hve" --csv C:\Users\johndoe\Desktop\forensic_data\amcache-analysis
AmcacheParser version 1.5.1.0

Author: Eric Zimmerman (saericzimmerman@gmail.com)
https://github.com/EricZimmerman/AmcacheParser

Command line: -f C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\AppCompat\Programs\AmCache.hve --csv C:\Users\johndoe\Desktop\forensic_data\amcache-analysis

Warning: Administrator privileges not found!


C:\Users\johndoe\Desktop\forensic_data\kape_output\D\Windows\AppCompat\Programs\AmCache.hve is in new format!

Total file entries found: 93
Total shortcuts found: 49
Total device containers found: 15
Total device PnPs found: 183
Total drive binaries found: 372
Total driver packages found: 4

Found 36 unassociated file entry

Results saved to: C:\Users\johndoe\Desktop\forensic_data\amcache-analysis

Total parsing time: 0.539 seconds
```

#### Điều tra Windows BAM (Background Activity Moderator)

`Background Activity Moderator` (BAM) là một thành phần trong hệ điều hành Windows có nhiệm vụ theo dõi và ghi log việc thực thi một số loại tác vụ chạy nền hoặc tác vụ được lập lịch. BAM thực chất là một kernel device driver như trong ảnh chụp dưới đây.

![Giao diện Registry Explorer hiển thị hive SYSTEM với user settings và chi tiết thực thi chương trình, gồm cả timestamp.](images/win_dfir_bamdrv.png)

Nó chủ yếu chịu trách nhiệm kiểm soát hoạt động của các ứng dụng chạy nền, nhưng có thể giúp ta có được bằng chứng về việc thực thi chương trình, được liệt kê trong registry hive bam. Key BAM nằm tại vị trí registry dưới đây.
`HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\bam\State\UserSettings\{USER-SID}`

Dùng Registry Explorer, ta có thể duyệt mục này bên trong hive SYSTEM để xem tên các file thực thi. Registry Explorer đã có sẵn bookmark cho `bam`.

![Registry Explorer hiển thị hive SYSTEM với user settings và timestamp thực thi chương trình.](images/img15.png)

Ta cũng có thể dùng `RegRipper` để lấy thông tin tương tự thông qua plugin `bam` của nó.

#### Phân tích dữ liệu API call đã ghi lại (`.apmx64`)

Các file `.apmx64` được tạo bởi [API Monitor](http://www.rohitab.com/apimonitor), công cụ ghi lại dữ liệu API call. Các file này có thể được mở và phân tích ngay trong chính công cụ. API Monitor là phần mềm ghi lại và hiển thị các API call do ứng dụng và service khởi tạo. Dù chức năng chính là debug và giám sát, khả năng ghi lại dữ liệu API call khiến nó trở nên hữu ích trong việc tìm ra các forensic artifact. Hãy tiếp tục bằng cách nạp `C:\Users\johndoe\Desktop\forensic_data\APMX64\discord.apmx64` vào API Monitor (có tại `C:\Program Files\rohitab.com\API Monitor`) và xem xét nội dung của nó để tìm thông tin giá trị.

Khi khởi chạy, API Monitor sẽ nạp một số file cần thiết.

![API Monitor v2 đang nạp các definition, tiến độ 1356 trên 2119 file.](images/win_dfir_apimon1.png)

Sau khi mở ứng dụng API Monitor, hãy vào menu `File` và chọn `Open`. Từ đó, điều hướng tới vị trí file `.apmx64` và chọn nó.

![Giao diện API Monitor v2 với menu File đang mở, hiển thị các tuỳ chọn như Open và Save, chưa có process nào được giám sát.](images/win_dfir_apimon2.png)

Sau khi mở file, danh sách các API call đã được ghi lại do ứng dụng được giám sát thực hiện sẽ hiển thị. Thông thường, danh sách này chứa các chi tiết như tên hàm API, tham số, giá trị trả về và timestamp. Ảnh chụp dưới đây cho cái nhìn toàn diện về giao diện người dùng của API Monitor và các phần khác nhau của nó.

![API Monitor hiển thị các API call, module, process được giám sát, tham số và tóm tắt call stack.](images/win_dfir_apimon3_.png)

Bấm vào các process được giám sát ở bên trái sẽ hiển thị dữ liệu API call đã ghi lại của process được chọn trong khung summary bên phải. Để minh hoạ, hãy chọn process `discord.exe`. Trong khung summary, ta sẽ thấy các API call do `discord.exe` khởi tạo.

![API Monitor hiển thị các process được giám sát, các lời gọi hàm, tham số và giá trị trả về.](images/win_dfir_apimon4.png)

Một điểm đáng chú ý trong ảnh chụp là lời gọi tới [hàm getenv](https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/getenv-wgetenv?view=msvc-170). Dưới đây là cú pháp của hàm này.

```shell-session
char *getenv(
   const char *varname
);
```

Hàm này lấy giá trị của một biến môi trường được chỉ định. Nó yêu cầu một tham số `varname`, đại diện cho tên một biến môi trường hợp lệ, và trả về một con trỏ trỏ tới entry trong bảng chứa giá trị của biến môi trường tương ứng.

API Monitor có rất nhiều khả năng lọc và tìm kiếm. Điều này cho phép ta tập trung vào các API call cụ thể theo hàm hoặc khung thời gian. Bằng cách duyệt qua summary hoặc sử dụng chức năng lọc và tìm kiếm, ta có thể phát hiện những chi tiết đáng chú ý, như các API call liên quan tới tạo file, tạo process, thay đổi registry, v.v.

**Registry Persistence qua Run Keys**

Một chiến lược thường được kẻ tấn công sử dụng để duy trì quyền truy cập trái phép vào hệ thống bị xâm nhập là chèn một entry vào các `run keys` trong Windows Registry. Hãy kiểm tra xem có tham chiếu nào tới hàm `RegOpenKeyExA` không, hàm này truy cập registry key được chỉ định. Để tìm, chỉ cần gõ `RegOpenKey` vào ô tìm kiếm, thường nằm ở phía trên cửa sổ API Monitor, rồi nhấn `Enter`.

![API Monitor hiển thị các process được giám sát, lời gọi hàm RegOpenKeyExA, tham số và giá trị trả về.](images/win_dfir_apimon6.png)

Từ kết quả hiển thị, có thể thấy rõ registry key `SOFTWARE\Microsoft\Windows\CurrentVersion\Run` tương ứng với registry key Run, key này kích hoạt chương trình được chỉ định mỗi khi user đăng nhập. Các đối tượng độc hại thường lợi dụng key này để nhúng các entry trỏ tới backdoor của chúng, việc này có thể thực hiện qua hàm registry API `RegSetValueExA`.

Để tìm hiểu thêm, hãy tìm bất kỳ đề cập nào tới hàm `RegSetValueExA`, hàm này định nghĩa dữ liệu và kiểu cho một value được chỉ định trong một registry key. Dùng ô tìm kiếm, gõ `RegSet` và nhấn `Enter`.

![API Monitor hiển thị lời gọi hàm RegSetValueExA với tham số và giá trị trả về.](images/win_dfir_apimon7.png)

Một điểm đáng chú ý là lời gọi `RegSetValueExA`. Trước khi đi sâu hơn, hãy làm quen với tài liệu của hàm này.

```shell-session
LSTATUS RegSetValueExA(
  [in]           HKEY       hKey,
  [in, optional] LPCSTR     lpValueName,
                 DWORD      Reserved,
  [in]           DWORD      dwType,
  [in]           const BYTE *lpData,
  [in]           DWORD      cbData
);
```

- `hKey1` là handle tới registry key nơi bạn muốn đặt một registry value.
- `lpValueName` là con trỏ tới một chuỗi kết thúc bằng null, chỉ định tên của registry value bạn muốn đặt. Trong trường hợp này, nó có tên là `DiscordUpdate`.
- Tham số `Reserved` được dành riêng và phải bằng 0.
- `dwType` chỉ định kiểu dữ liệu của registry value. Nhiều khả năng đây là một hằng số nguyên đại diện cho kiểu dữ liệu (vd: `REG_SZ` cho giá trị chuỗi).
- `(BYTE*)lpData` là một phép ép kiểu (type cast) chuyển biến `_lpData_` thành con trỏ tới byte (`BYTE*`). Việc này nhằm đảm bảo dữ liệu được `_lpData_` trỏ tới được xử lý như một mảng byte, vốn là định dạng mong đợi cho dữ liệu nhị phân trong Windows Registry. Trong trường hợp của ta, giá trị này hiển thị trong buffer view là `C:\Windows\Tasks\update.exe`.
- `cbData` là một số nguyên chỉ định kích thước, tính bằng byte, của dữ liệu được `_lpData_` trỏ tới.

![API Monitor hiển thị lời gọi hàm RegSetValueExA với tham số và giá trị trả về.](images/win_dfir_apimon9.png)

Điểm mấu chốt từ API call này là tham số `lpData`, tiết lộ vị trí của backdoor, `C:\Windows\Tasks\update.exe`.

**Process Injection**

Để xem xét việc tạo process, hãy tìm hàm `CreateProcessA`. Gõ `CreateProcess` vào ô tìm kiếm và nhấn `Enter`.

![API Monitor hiển thị lời gọi hàm CreateProcessA với tham số và giá trị trả về.](images/win_dfir_apimon5_.png)

Dưới đây là cú pháp của hàm Windows API `CreateProcessA`.

```shell-session
BOOL CreateProcessA(
  [in, optional]      LPCSTR                lpApplicationName,
  [in, out, optional] LPSTR                 lpCommandLine,
  [in, optional]      LPSECURITY_ATTRIBUTES lpProcessAttributes,
  [in, optional]      LPSECURITY_ATTRIBUTES lpThreadAttributes,
  [in]                BOOL                  bInheritHandles,
  [in]                DWORD                 dwCreationFlags,
  [in, optional]      LPVOID                lpEnvironment,
  [in, optional]      LPCSTR                lpCurrentDirectory,
  [in]                LPSTARTUPINFOA        lpStartupInfo,
  [out]               LPPROCESS_INFORMATION lpProcessInformation
);
```

Một thành phần đáng chú ý trong API này là tham số `lpCommandLine`. Nó tiết lộ command line đã được thực thi, trong trường hợp này là `C:\Windows\System32\comp.exe`. Đáng chú ý, `lpCommandLine` có thể được chỉ định mà không cần nêu đường dẫn đầy đủ của file thực thi trong giá trị `lpApplicationName`.

Một tham số quan trọng khác cần chú ý là `dwCreationFlags`, được đặt thành `CREATE_SUSPENDED`. Điều này cho biết thread chính của process mới khởi động ở trạng thái bị tạm dừng (suspended) và không hoạt động cho đến khi hàm `ResumeThread` được gọi.

Tham số `lpCommandLine` của API call này làm rõ child process đã được khởi tạo, cụ thể là `C:\Windows\System32\comp.exe`.

Xa hơn bên dưới, ta cũng thấy các hàm liên quan tới process injection được `discord.exe` sử dụng.

![API Monitor hiển thị discord.exe với các lời gọi OpenProcess, VirtualAllocEx, WriteProcessMemory và CreateRemoteThread.](images/disc_inj.png)

Tất cả những điều trên là các dấu hiệu mạnh của process injection.

#### Hoạt động PowerShell

PowerShell transcript ghi lại tỉ mỉ cả các lệnh được thực thi lẫn output tương ứng trong một phiên PowerShell. Đôi khi, trong thư mục documents của user, ta có thể bắt gặp các file PowerShell transcript. Các file này cho ta cái nhìn vào các hoạt động PowerShell đã được ghi lại trên hệ thống.

Ảnh chụp tiếp theo cho thấy các file PowerShell transcript nằm trong thư mục documents của user trên một forensic image đã được mount.

![FTK Imager hiển thị PowerShell transcript với chi tiết hoạt động đã được ghi lại.](images/win_dfir_accessdata_ps1.png)

Xem xét chi tiết hoạt động liên quan tới PowerShell có thể đóng vai trò quan trọng trong quá trình điều tra.

Dưới đây là một số hướng dẫn được khuyến nghị khi xử lý dữ liệu PowerShell.
- `Unusual Commands`: Tìm các lệnh PowerShell không điển hình trong môi trường của bạn hoặc thường gắn với hoạt động độc hại. Ví dụ, lệnh tải file từ internet (Invoke-WebRequest hoặc wget), lệnh thao tác registry, hoặc lệnh liên quan đến việc tạo scheduled task.
- `Script Execution`: Kiểm tra việc thực thi script PowerShell, đặc biệt nếu chúng không được ký (signed) hoặc đến từ nguồn không đáng tin cậy. Script có thể được dùng để tự động hoá các hành động độc hại.
- Encoded Commands: Kẻ tấn công thường dùng lệnh PowerShell được encode hoặc obfuscate để né phát hiện. Tìm dấu hiệu của các lệnh được encode trong transcript.
- `Privilege Escalation`: Các lệnh cố gắng leo thang đặc quyền, thay đổi quyền của user, hoặc thực hiện các hành động thường chỉ dành cho administrator có thể là dấu hiệu đáng ngờ.
- `File Operations`: Kiểm tra các lệnh PowerShell liên quan đến tạo, di chuyển hoặc xoá file, đặc biệt ở các vị trí hệ thống nhạy cảm.
- `Network Activity`: Tìm các lệnh liên quan đến hoạt động mạng, như gửi HTTP request hoặc khởi tạo kết nối mạng. Đây có thể là dấu hiệu của liên lạc command and control (C2).
- `Registry Manipulation`: Kiểm tra các lệnh liên quan đến sửa đổi Windows Registry, vì đây có thể là chiến thuật phổ biến để malware duy trì persistence.
- `Use of Uncommon Modules`: Nếu một script hoặc lệnh PowerShell dùng các module không phổ biến hoặc không chuẩn, đó có thể là dấu hiệu của hoạt động đáng ngờ.
- `User Account Activity`: Tìm các thay đổi đối với tài khoản user, bao gồm tạo, sửa đổi hoặc xoá. Kẻ tấn công có thể cố gắng tạo hoặc thao túng tài khoản user để duy trì persistence.
- `Scheduled Tasks`: Điều tra việc tạo hoặc sửa đổi scheduled task thông qua PowerShell. Đây có thể là một phương pháp phổ biến để duy trì persistence.
- `Repeated or Unusual Patterns`: Phân tích các mẫu (pattern) của lệnh PowerShell. Các lệnh lặp lại giống hệt nhau hoặc chuỗi lệnh bất thường có thể cho thấy tự động hoá hoặc hành vi độc hại.
- `Execution of Unsigned Scripts`: Việc thực thi script không được ký có thể là dấu hiệu của hoạt động đáng ngờ, đặc biệt nếu execution policy được thiết lập để hạn chế điều này.
