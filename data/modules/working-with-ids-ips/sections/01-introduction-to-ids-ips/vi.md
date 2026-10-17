# Introduction To IDS/IPS (Giới thiệu về IDS/IPS)

Trong các hoạt động giám sát an ninh mạng (network security monitoring – NSM), việc sử dụng `Intrusion Detection Systems (IDS)` và `Intrusion Prevention Systems (IPS)` là tối quan trọng. Mục đích của các hệ thống này không chỉ là nhận diện các mối đe doạ tiềm ẩn mà còn giảm thiểu tác động của chúng.

`IDS` là một thiết bị hoặc ứng dụng giám sát hoạt động của mạng hoặc hệ thống để phát hiện hoạt động độc hại hoặc vi phạm chính sách, và tạo báo cáo gửi chủ yếu về một trạm quản lý (management station). Một hệ thống như vậy giúp ta nắm rõ những gì đang diễn ra trong mạng của mình, đảm bảo ta có khả năng quan sát (visibility) mọi hành động có thể gây hại. Cần lưu ý rằng IDS không ngăn chặn xâm nhập mà chỉ cảnh báo cho ta khi có xâm nhập xảy ra.
- IDS hoạt động theo hai chế độ chính: phát hiện dựa trên signature (signature-based detection) và phát hiện dựa trên bất thường (anomaly-based detection). Với `signature-based detection`, IDS nhận diện các mẫu xấu, chẳng hạn signature của malware và các mẫu tấn công đã được xác định trước đó. Tuy nhiên, phương pháp này chỉ giới hạn ở các mối đe doạ đã biết. Vì lý do đó, ta triển khai thêm `anomaly-based detection` — phương pháp thiết lập một baseline (đường cơ sở) về hành vi bình thường và gửi alert khi phát hiện hành vi lệch khỏi baseline này. Đây là cách tiếp cận chủ động hơn nhưng dễ sinh false positive (cảnh báo nhầm), vì vậy ta dùng cả hai phương pháp để chúng bù trừ cho nhau.

Mặt khác, `IPS` nằm ngay sau firewall và cung cấp thêm một lớp bảo vệ. Nó không chỉ giám sát lưu lượng mạng một cách thụ động mà còn chủ động ngăn chặn mọi mối đe doạ tiềm ẩn được phát hiện. Một hệ thống như vậy không chỉ cảnh báo cho ta về kẻ xâm nhập mà còn chủ động chặn không cho chúng vào.
- IPS cũng hoạt động theo chế độ tương tự IDS, hỗ trợ cả phát hiện dựa trên signature lẫn dựa trên bất thường. Khi phát hiện một mối đe doạ tiềm ẩn, nó thực hiện các hành động như drop (loại bỏ) các packet độc hại, chặn lưu lượng mạng và reset kết nối. Mục tiêu là làm gián đoạn hoặc chặn đứng các hoạt động bị coi là nguy hiểm cho mạng hoặc vi phạm chính sách của ta.

Khi triển khai IDS và IPS, chúng thường được tích hợp vào mạng ở những vị trí khác nhau, mỗi loại có vị trí tối ưu riêng tuỳ theo chức năng và thiết kế tổng thể của mạng. Cả thiết bị IDS lẫn IPS nhìn chung đều được đặt sau firewall, gần hơn với các tài nguyên mà chúng bảo vệ. Vì cả hai đều hoạt động bằng cách kiểm tra lưu lượng mạng, nên hợp lý nhất là đặt chúng ở nơi có thể thấy được càng nhiều lưu lượng liên quan càng tốt, thường là ở phía mạng nội bộ của firewall.
- Intrusion Detection Systems (IDS) giám sát lưu lượng mạng một cách thụ động, phát hiện các mối đe doạ tiềm ẩn và tạo alert. Bằng cách đặt chúng sau firewall, ta đảm bảo chúng phân tích lưu lượng đã đi qua tuyến phòng thủ đầu tiên, giúp ta tập trung vào những mối đe doạ có thể tinh vi hoặc phức tạp hơn đã vượt qua được firewall.
- Ngược lại, Intrusion Prevention Systems (IPS) chủ động can thiệp để chặn các mối đe doạ được phát hiện. Điều này có nghĩa là chúng cần được đặt tại một điểm trong mạng nơi chúng không chỉ thấy được lưu lượng có khả năng độc hại mà còn có quyền chặn nó. Việc này thường đạt được bằng cách đặt chúng inline (nằm trực tiếp trên đường đi của lưu lượng) trong mạng, thường là ngay sau firewall.

Cách triển khai có thể thay đổi tuỳ theo yêu cầu cụ thể của mạng và loại lưu lượng ta cần giám sát. IDS/IPS cũng có thể được triển khai ở mức host, gọi là Host-based Intrusion Detection Systems (HIDS) và Host-based Intrusion Prevention Systems (HIPS), giám sát lưu lượng vào và ra của từng host riêng lẻ để phát hiện mọi hoạt động đáng ngờ.

Xin lưu ý rằng vị trí đặt các hệ thống này là một phần không thể tách rời của chiến lược defense-in-depth (phòng thủ theo chiều sâu), trong đó nhiều lớp biện pháp bảo mật được dùng để bảo vệ mạng. Kiến trúc cụ thể sẽ phụ thuộc vào nhiều yếu tố, bao gồm bản chất của mạng, mức độ nhạy cảm của dữ liệu và bối cảnh mối đe doạ (threat landscape).

## Cập nhật IDS/IPS

Hơn nữa, để đảm bảo các hệ thống này hoạt động tốt nhất, ta thường xuyên cập nhật chúng với các threat signature mới nhất và tinh chỉnh (fine-tune) các thuật toán phát hiện bất thường. Việc này đòi hỏi đội bảo mật nỗ lực liên tục và cẩn trọng, nhưng là hoàn toàn cần thiết trong bối cảnh mối đe doạ không ngừng thay đổi.

Cũng cần nhắc đến vai trò của các hệ thống Security Information and Event Management (SIEM) trong hoạt động giám sát an ninh mạng của ta. Bằng cách thu thập và tổng hợp log từ IDS và IPS cùng các thiết bị khác trong mạng, ta có thể tương quan (correlate) các event (phân tích mối liên hệ giữa chúng) từ nhiều nguồn khác nhau và dùng các kỹ thuật phân tích nâng cao để phát hiện những cuộc tấn công phức tạp, có phối hợp. Nhờ đó, ta có cái nhìn đầy đủ, thống nhất về tình trạng an ninh của mạng, cho phép phản ứng nhanh với các mối đe doạ.

## Phần tiếp theo

Trong module này, ta sẽ tìm hiểu các kiến thức nền tảng về `Suricata`, `Snort` và `Zeek`, đồng thời đi sâu vào việc phát triển signature và phát hiện xâm nhập với từng hệ thống.
