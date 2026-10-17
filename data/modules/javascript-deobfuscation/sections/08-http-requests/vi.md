# HTTP Requests


Ở phần trước, ta đã phát hiện hàm chính của `secret.js` đang gửi một request `POST` rỗng tới `/serial.php`. Trong phần này, ta sẽ thử làm điều tương tự bằng `cURL` để gửi request `POST` tới `/serial.php`. Để tìm hiểu thêm về `cURL` và web request, bạn có thể tham khảo module [Web Requests](https://academy.hackthebox.com/module/details/35).

---
## cURL

`cURL` là một công cụ dòng lệnh mạnh mẽ được dùng trên các bản phân phối Linux, macOS và cả các phiên bản Windows PowerShell mới nhất. Ta có thể request tới bất kỳ website nào chỉ bằng cách cung cấp URL của nó, và sẽ nhận được nội dung ở dạng text, như sau:

```shell-session
[!bash!]$ curl http://SERVER_IP:PORT/

</html>
<!DOCTYPE html>

<head>
    <title>Secret Serial Generator</title>
    <style>
        *,
        html {
            margin: 0;
            padding: 0;
            border: 0;
...SNIP...
        <h1>Secret Serial Generator</h1>
        <p>This page generates secret serials!</p>
    </div>
</body>

</html>
```

Đây chính là đoạn `HTML` mà ta đã xem khi kiểm tra source code ở phần đầu tiên.

---
## POST Request

Để gửi request `POST`, ta thêm flag `-X POST` vào lệnh, và lệnh sẽ gửi đi một request `POST`:

```shell-session
[!bash!]$ curl -s http://SERVER_IP:PORT/ -X POST
```

<div class="card bg-light">
    <div class="card-body">
        <p class="mb-0">Mẹo: Ta thêm flag "-s" để response không bị lộn xộn bởi những dữ liệu không cần thiết</p>
    </div>
</div>

Tuy nhiên, request `POST` thường chứa dữ liệu `POST`. Để gửi dữ liệu, ta có thể dùng flag "`-d "param1=sample"`" và đưa vào dữ liệu cho từng tham số, như sau:

```shell-session
[!bash!]$ curl -s http://SERVER_IP:PORT/ -X POST -d "param1=sample"
```

Giờ đã biết cách dùng `cURL` để gửi các request `POST` cơ bản, trong phần tiếp theo ta sẽ dùng nó để tái hiện những gì `server.js` đang làm, nhằm hiểu rõ hơn mục đích của nó.
