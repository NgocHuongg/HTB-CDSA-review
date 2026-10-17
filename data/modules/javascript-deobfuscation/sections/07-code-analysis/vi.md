# Code Analysis (Phân tích code)


Giờ đã deobfuscate được code, ta có thể bắt đầu đọc qua nó:

```javascript
'use strict';
function generateSerial() {
  ...SNIP...
  var xhr = new XMLHttpRequest;
  var url = "/serial.php";
  xhr.open("POST", url, true);
  xhr.send(null);
};
```

Ta thấy file `secret.js` chỉ chứa một hàm duy nhất là `generateSerial`.

---
## HTTP Requests

Hãy xem xét từng dòng của hàm `generateSerial`.

#### Các biến trong code

Hàm bắt đầu bằng việc định nghĩa biến `xhr`, biến này tạo một object `XMLHttpRequest`. Vì có thể ta không biết chính xác `XMLHttpRequest` làm gì trong JavaScript, hãy Google `XMLHttpRequest` để xem nó được dùng vào việc gì.  
Sau khi đọc về nó, ta thấy đây là một hàm JavaScript dùng để xử lý các web request.

Biến thứ hai được định nghĩa là biến `URL`, chứa URL tới `/serial.php` — file này hẳn nằm trên cùng domain, vì không có domain nào được chỉ định.

#### Các hàm trong code

Tiếp theo, ta thấy `xhr.open` được dùng với `"POST"` và `URL`. Ta có thể Google hàm này thêm lần nữa, và thấy rằng nó mở HTTP request theo phương thức được chỉ định ('`GET` hoặc `POST`') tới `URL`, rồi dòng tiếp theo `xhr.send` sẽ gửi request đi.

Vậy, tất cả những gì `generateSerial` làm chỉ là gửi một request `POST` tới `/serial.php`, không kèm dữ liệu `POST` nào và cũng không nhận lại gì.

Có thể developer đã triển khai hàm này để dùng mỗi khi cần tạo serial, ví dụ như khi bấm vào một nút `Generate Serial` nào đó. Tuy nhiên, vì ta không thấy phần tử HTML nào tương tự dùng để tạo serial, hẳn là developer chưa dùng tới hàm này và giữ lại để dùng sau.

Nhờ deobfuscate và phân tích code, ta đã phát hiện ra hàm này. Giờ ta có thể thử tái hiện chức năng của nó để xem khi gửi request `POST` thì phía server có xử lý hay không. Nếu hàm được bật và được xử lý ở phía server, ta có thể khám phá ra một chức năng chưa phát hành — loại chức năng thường hay chứa bug và lỗ hổng.
