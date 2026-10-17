# Introduction (Giới thiệu)


Chào mừng bạn đến với module JavaScript Deobfuscation!

Code deobfuscation (giải làm rối mã) là một kỹ năng quan trọng cần học nếu ta muốn thành thạo phân tích code và reverse engineering (dịch ngược). Trong các bài tập red/blue team, ta thường gặp những đoạn code bị obfuscate (làm rối) nhằm che giấu một số chức năng nhất định, chẳng hạn malware dùng code JavaScript bị obfuscate để lấy payload chính của nó. Nếu không hiểu đoạn code này đang làm gì, ta sẽ không biết chính xác nó thực hiện điều gì, và vì thế có thể không hoàn thành được bài tập red/blue team.

Trong module này, ta sẽ bắt đầu bằng việc tìm hiểu cấu trúc chung của một trang HTML, rồi tìm vị trí code JavaScript bên trong nó. Sau đó, ta sẽ học obfuscation là gì, được thực hiện như thế nào và được dùng ở đâu, tiếp theo là học cách deobfuscate những đoạn code như vậy. Khi code đã được deobfuscate, ta sẽ tìm hiểu công dụng chung của nó để tái hiện (replicate) chức năng và tự tay làm rõ nó làm gì.

Các chủ đề sẽ được đề cập:
- Tìm vị trí code JavaScript
- Giới thiệu về Code Obfuscation
- Cách deobfuscate code JavaScript
- Cách decode các thông điệp đã bị encode
- Phân tích code cơ bản
- Gửi các HTTP request cơ bản
