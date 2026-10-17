# SIEM Visualization Example 1: Failed Logon Attempts (All Users) (Ví dụ visualization SIEM 1: Các lần đăng nhập thất bại – tất cả người dùng)

Dashboard trong các giải pháp SIEM đóng vai trò là nơi chứa nhiều visualization (biểu đồ trực quan hoá), cho phép ta sắp xếp và hiển thị dữ liệu một cách có ý nghĩa.

Trong phần này và các phần tiếp theo, ta sẽ tạo một dashboard và một số visualization từ đầu.

---

## Xây dựng Dashboard & Visualization đầu tiên

Kéo xuống cuối phần này và bấm vào `Click here to spawn the target system!`

Bây giờ, truy cập `http://[Target IP]:5601`, bấm vào nút bật/tắt thanh điều hướng bên (side navigation toggle), rồi bấm vào "Dashboard".

Xoá dashboard "SOC-Alerts" hiện có như sau.

![Giao diện dashboard của Elastic hiển thị 'SOC-Alerts' với các tuỳ chọn xoá hoặc tạo dashboard.](images/visualization29.png)

Khi vào lại trang Dashboard, ta sẽ thấy một thông báo cho biết hiện chưa có dashboard nào. Ngoài ra, sẽ có tuỳ chọn để tạo một Dashboard mới cùng visualization đầu tiên của nó. Để bắt đầu tạo dashboard đầu tiên, ta chỉ cần bấm nút "Create new dashboard".

![Giao diện Elastic nhắc tạo dashboard đầu tiên, với các tuỳ chọn cài dữ liệu mẫu và tạo dashboard mới.](images/dashboard.png)

Giờ, để bắt đầu tạo visualization đầu tiên, ta chỉ cần bấm nút "Create visualization".

![Giao diện Elastic chỉnh sửa một dashboard mới, nhắc thêm visualization đầu tiên với các tuỳ chọn tạo mới hoặc thêm từ thư viện.](images/visualization.png)

Khi bắt đầu tạo visualization đầu tiên, cửa sổ mới sau đây sẽ xuất hiện với nhiều tuỳ chọn và thiết lập. 

Trước khi cấu hình bất cứ gì, điều quan trọng là ta phải bấm vào biểu tượng lịch để mở bộ chọn thời gian (time picker). Sau đó, ta cần chỉ định khoảng thời gian là "last 15 years". Cuối cùng, bấm nút "Apply" để áp dụng khoảng thời gian đã chỉ định cho dữ liệu.

![Giao diện tạo dashboard của Elastic với các tuỳ chọn thêm filter, chọn index pattern 'windows*', tìm tên field và chọn visualization 'Bar vertical stacked'.](images/visualization1.png)

Có bốn điểm ta cần chú ý trên cửa sổ này:

1. Một tuỳ chọn filter cho phép ta lọc dữ liệu trước khi tạo biểu đồ. Ví dụ, nếu mục tiêu là hiển thị các lần đăng nhập thất bại, ta có thể dùng filter để chỉ xét các event ID khớp với `4625 – Failed logon attempt on a Windows system`. Hình sau minh hoạ cách chỉ định một filter như vậy.

	![Giao diện dashboard của Elastic với tuỳ chọn 'Add filter' đang mở, đặt filter cho 'event.code' là '4625' với toán tử 'is'.](images/visualization2.png)

2. Trường này cho biết tập dữ liệu (index) mà ta sẽ dùng. Dữ liệu từ các nguồn hạ tầng khác nhau thường được tách vào các index khác nhau, như network, Windows, Linux, v.v. Trong ví dụ cụ thể này, ta sẽ chỉ định `windows*` trong "Index pattern".

3. Thanh tìm kiếm này cho phép ta kiểm tra lại sự tồn tại của một field cụ thể trong tập dữ liệu, như một cách nữa để đảm bảo ta đang xem đúng dữ liệu. Ví dụ, giả sử ta quan tâm tới field `user.name.keyword`. Ta có thể dùng thanh tìm kiếm để tìm nhanh và xác minh field này có hiện diện và được phát hiện trong tập dữ liệu đã chọn hay không. Nhờ đó ta xác nhận được mình đang truy cập đúng field mong muốn và làm việc với dữ liệu chính xác.

	![Giao diện dashboard của Elastic với filter 'event.code: 4625' và ô tìm các field bắt đầu bằng 'user.', hiển thị các field có sẵn như 'user.name.keyword'.](images/visualization11.png)

	Có thể bạn sẽ hỏi: "Tại sao lại là `user.name.keyword` mà không phải `user.name`?". Ta nên dùng field `.keyword` khi thực hiện aggregation (tổng hợp dữ liệu). Hãy tham khảo [câu hỏi trên stackoverflow](https://stackoverflow.com/questions/48869795/difference-between-a-field-and-the-field-keyword) này để có câu trả lời chi tiết hơn.


4. Cuối cùng, menu thả xuống này cho phép ta chọn loại visualization muốn tạo. Tuỳ chọn mặc định hiển thị ở hình trước là "Bar vertical stacked". Nếu bấm vào nút đó, các tuỳ chọn khác có sẵn sẽ hiện ra (hình đã được lược bớt vì không phải mọi tuỳ chọn đều vừa màn hình). Từ danh sách mở rộng này, ta có thể chọn loại visualization phù hợp nhất với yêu cầu và nhu cầu trình bày dữ liệu của mình.

	![Giao diện Elastic hiển thị các tuỳ chọn loại visualization, đang chọn 'Bar vertical stacked', cùng các tuỳ chọn khác như 'Metric' và 'Table'.](images/visualization4.png)

---

Với visualization này, hãy chọn tuỳ chọn "Table". Sau khi chọn "Table", ta có thể bấm vào tuỳ chọn "Rows". Thao tác này cho phép ta chọn các thành phần dữ liệu cụ thể muốn đưa vào dạng xem bảng.

![Giao diện cấu hình bảng của Elastic với các tuỳ chọn thêm hoặc kéo-thả field cho rows, columns và metrics.](images/visualization5.png)

Hãy cấu hình phần "Rows" như sau.

![Giao diện Elastic cấu hình rows, chọn field 'user.name.keyword', hiển thị top 1000 giá trị, xếp hạng theo count of records giảm dần.](images/visualization6.png)

**Lưu ý**: Bạn sẽ thấy `Rank by Alphabetical` chứ không phải `Rank by Count of records` như trong ảnh chụp màn hình ở trên. Điều này không sao. Khi bạn thực hiện bước cấu hình tiếp theo bên dưới, `Count of records` sẽ xuất hiện.

Tiếp theo, hãy đóng cửa sổ "Rows" và chuyển sang phần cấu hình "Metrics".

![Cấu hình bảng của Elastic hiển thị index pattern 'windows*', với 'Top values of user.name.keyword' ở rows, và các tuỳ chọn thêm field vào columns và metrics.](images/visualization7.png)

Trong cửa sổ "Metrics", hãy chọn "count" làm metric mong muốn.

![Giao diện cấu hình metrics của Elastic hiển thị các quick function như Average, Count và Sum, đang chọn 'Count'.](images/visualization8.png)

Ngay khi chọn "Count" làm metric, ta sẽ thấy bảng được điền dữ liệu (giả sử có event trong tập dữ liệu đã chọn)

![Bảng Elastic hiển thị các giá trị top của 'user.name.keyword' kèm số đếm, và cấu hình metrics đặt là 'Count' cho records.](images/visualization9.png)

Một bổ sung cuối cùng cho bảng là thêm một thiết lập "Rows" nữa để hiển thị máy nơi xảy ra lần đăng nhập thất bại. Để làm việc này, ta sẽ chọn field `host.hostname.keyword`, đại diện cho máy tính ghi nhận (report) lần đăng nhập thất bại. Nhờ đó ta có thể hiển thị hostname hoặc tên máy bên cạnh số lần đăng nhập thất bại, như trong hình.

![Bảng Elastic hiển thị các giá trị top của 'user.name.keyword' và 'host.hostname.keyword' kèm số record, cấu hình ở rows.](images/visualization12.png)

Giờ ta thấy ba cột trong bảng, chứa các thông tin sau:

1. Username của những người đăng nhập (Lưu ý: Hiện tại nó hiển thị cả user lẫn máy tính. Lý tưởng nhất là nên áp dụng một filter để loại các thiết bị máy tính và chỉ hiển thị user).
2. Máy nơi diễn ra lần thử đăng nhập.

3. Số lần event đã xảy ra (dựa trên khung thời gian đã chỉ định hoặc toàn bộ tập dữ liệu, tuỳ thiết lập).

Cuối cùng, bấm "Save and return", bạn sẽ thấy visualization mới được thêm vào dashboard, trông như hình sau.

![Dashboard Elastic hiển thị một bảng với các giá trị top của user name và hostname, kèm số record.](images/visualization13.png)

Đừng quên lưu cả dashboard. Ta có thể làm việc này đơn giản bằng cách bấm nút "Save".

![Giao diện Elastic hiển thị hộp thoại 'Save dashboard' với tiêu đề 'SOC-Alerts', mô tả cho HTB Academy's SOC Analyst Job-Role Path, và tuỳ chọn lưu thời gian cùng dashboard.](images/visualization15.png)

---

## Tinh chỉnh Visualization

Giả sử SOC Manager đề xuất các tinh chỉnh sau:

- Cần đặt tên cột rõ ràng hơn trong visualization
- Cần đưa Logon Type vào visualization
- Kết quả trong visualization cần được sắp xếp
- Các username DESKTOP-DPOESND, WIN-OK9BH1BCKSD và WIN-RMMGJA7T9TC
không nên được giám sát
- Không nên giám sát [các tài khoản máy tính (computer account)](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/service-accounts-computer) (đây không phải cách làm tốt)

Hãy tinh chỉnh visualization đã tạo để đáp ứng các đề xuất trên.

Truy cập `http://[Target IP]:5601`, bấm vào nút bật/tắt thanh điều hướng bên, rồi bấm vào "Dashboard".

Dashboard ta đã tạo trước đó sẽ hiển thị. Hãy bấm vào biểu tượng "bút chì"/chỉnh sửa.

![Giao diện dashboard của Elastic hiển thị danh sách có 'SOC-Alerts' cùng các tuỳ chọn tạo hoặc chỉnh sửa dashboard.](images/visualization16.png)

Giờ hãy bấm nút "bánh răng" ở góc trên bên phải của visualization, rồi bấm "Edit lens".

![Dashboard Elastic đang chỉnh sửa 'SOC-Alerts' với bảng top user và hostname, cùng các tuỳ chọn edit lens, clone panel hoặc edit panel title.](images/visualization18.png)

"Top values of user.name.keyword" cần được thay đổi như sau.

![Cấu hình bảng của Elastic với 'Top values of user.name.keyword' và 'host.hostname.keyword' ở rows, và 'Count of records' ở metrics.](images/visualization19.png)

![Giao diện Elastic cấu hình rows, chọn field 'user.name.keyword', hiển thị top 1000 giá trị, xếp theo thứ tự chữ cái tăng dần, với display name 'Username'.](images/visualization17.png)

"Top values of host.hostname.keyword" cần được thay đổi như sau.

![Giao diện Elastic cấu hình rows, chọn field 'host.hostname.keyword', hiển thị top 1000 giá trị, xếp hạng theo count of records giảm dần, với display name 'Event logged by'.](images/visualization20.png)

Có thể thêm "Logon Type" như sau (ta sẽ dùng field `winlog.logon.type.keyword`).

![Cấu hình bảng của Elastic với 'Top values of user.name.keyword' và 'Event logged by' ở rows, và 'Count of records' ở metrics, có tuỳ chọn thêm field.](images/visualization21.png)
![Bảng cấu hình Rows với field 'winlog.logon.type.keyword' được chọn, số giá trị đặt là 1000, xếp hạng theo count of records giảm dần, display name 'Logon Type'.](images/visualization22.png)

"Count of records" cần được thay đổi như sau.
![Bảng Metrics với function 'Count' được chọn, field đặt là 'Records', display name '# of logins', căn lề chữ 'Right'.](images/visualization23.png)

Ta có thể thêm việc sắp xếp kết quả như sau.
![Dashboard Elastic hiển thị một bảng với các cột: Username, Event logged by, Logon Type và '# of logins' được sắp xếp giảm dần.](images/visualization25.png)

Giờ ta chỉ cần bấm "Save and return".

Có thể loại các username DESKTOP-DPOESND, WIN-OK9BH1BCKSD và WIN-RMMGJA7T9TC
bằng cách chỉ định thêm các filter như sau.

![Dashboard Elastic với thiết lập filter: Field 'user.name.keyword', toán tử 'is not', giá trị 'DESKTOP-DPOESND'.](images/visualization24.png)

Có thể loại các tài khoản máy tính bằng cách chỉ định truy vấn KQL sau và bấm nút "Update".

```shell-session
NOT user.name: *$ AND winlog.channel.keyword: Security
```

Phần `AND winlog.channel.keyword: Security` nhằm đảm bảo không tính các log không liên quan.

![Dashboard Elastic với filter: NOT user.name:\*$ AND winlog.channel.keyword: Security, hiển thị một bảng với các cột: Username, Event logged by, Logon Type và '# of logins'.](images/visualization34.png)

Đây là visualization của ta sau tất cả các tinh chỉnh đã thực hiện. 

![Dashboard Elastic với filter: NOT user.name:\*$ AND winlog.channel.keyword: Security, hiển thị một bảng với các cột: Username, Event logged by, Logon Type và '# of logins'.](images/visualization35.png)

Cuối cùng, hãy đặt tiêu đề cho visualization bằng cách bấm vào "No Title".

![Dashboard Elastic đã áp dụng filter, hiển thị một bảng với các cột: Username, Event logged by, Logon Type và '# of logins'. Hộp thoại Customize panel đang mở với tuỳ chọn 'Show panel title'.](images/visualization36.png)

Đừng quên bấm nút "Save" (nút ở phía trên bên phải cửa sổ).

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Vui lòng chờ 3-5 phút để Kibana sẵn sàng sau khi khởi tạo (spawn) target của các câu hỏi bên dưới. </p>
    </div>
</div>
