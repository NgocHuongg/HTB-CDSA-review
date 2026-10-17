# Decoding (Giải mã)


Sau khi làm bài tập ở phần trước, ta nhận được một khối text lạ trông như đã bị encode:

```shell-session
[!bash!]$ curl http://SERVER_IP:PORT/serial.php -X POST -d "param1=sample"

ZG8gdGhlIGV4ZXJjaXNlLCBkb24ndCBjb3B5IGFuZCBwYXN0ZSA7KQo=
```

Đây là một khía cạnh quan trọng khác của obfuscation mà ta đã nhắc tới trong mục `More Obfuscation` của phần `Advanced Obfuscation`. Nhiều kỹ thuật có thể obfuscate code thêm nữa, khiến con người khó đọc hơn và hệ thống khó phát hiện hơn. Vì thế, bạn sẽ rất thường gặp code bị obfuscate chứa các khối text đã bị encode, được decode khi thực thi. Ta sẽ đề cập 3 phương pháp encode text phổ biến nhất:

- `base64`
- `hex`
- `rot13`

---
## Base64

Encoding `base64` thường được dùng để hạn chế việc dùng ký tự đặc biệt, vì mọi ký tự khi encode bằng `base64` sẽ được biểu diễn bằng các ký tự chữ và số (alpha-numeric), cộng thêm duy nhất `+` và `/`. Bất kể input là gì, kể cả ở dạng nhị phân (binary), chuỗi base64 kết quả cũng chỉ dùng các ký tự này.

#### Nhận diện Base64
Các chuỗi encode bằng `base64` rất dễ nhận ra vì chúng chỉ chứa ký tự chữ và số. Tuy nhiên, đặc điểm dễ nhận biết nhất của `base64` là phần padding (đệm) bằng ký tự `=`. Độ dài chuỗi encode `base64` phải là bội số của 4. Ví dụ, nếu output chỉ dài 3 ký tự, một ký tự `=` sẽ được thêm vào làm padding, và cứ thế.

#### Base64 Encode
Để encode bất kỳ text nào sang `base64` trên Linux, ta có thể echo nó rồi pipe bằng '`|`' sang `base64`:

```shell-session
[!bash!]$ echo https://www.hackthebox.eu/ | base64

aHR0cHM6Ly93d3cuaGFja3RoZWJveC5ldS8K
```

#### Base64 Decode

Nếu muốn decode bất kỳ chuỗi nào đã encode `base64`, ta có thể dùng `base64 -d`, như sau:
```shell-session
[!bash!]$ echo aHR0cHM6Ly93d3cuaGFja3RoZWJveC5ldS8K | base64 -d

https://www.hackthebox.eu/
```

---
## Hex

Một phương pháp encode phổ biến khác là encode `hex`, tức encode mỗi ký tự thành thứ tự `hex` của nó trong bảng `ASCII`. Ví dụ, `a` là `61` trong hex, `b` là `62`, `c` là `63`, và cứ thế. Bạn có thể xem toàn bộ bảng `ASCII` trên Linux bằng lệnh `man ascii`.

#### Nhận diện Hex
Mọi chuỗi encode `hex` chỉ gồm các ký tự hex, tức chỉ có 16 ký tự: 0-9 và a-f. Điều đó khiến việc nhận diện chuỗi encode `hex` cũng dễ như nhận diện chuỗi encode `base64`.

#### Hex Encode
Để encode bất kỳ chuỗi nào sang `hex` trên Linux, ta có thể dùng lệnh `xxd -p`:
```shell-session
[!bash!]$ echo https://www.hackthebox.eu/ | xxd -p

68747470733a2f2f7777772e6861636b746865626f782e65752f0a
```

#### Hex Decode
Để decode một chuỗi đã encode `hex`, ta có thể dùng lệnh `xxd -p -r`:
```shell-session
[!bash!]$ echo 68747470733a2f2f7777772e6861636b746865626f782e65752f0a | xxd -p -r

https://www.hackthebox.eu/
```

---
## Caesar/Rot13

Một kỹ thuật encode phổ biến khác — và rất cũ — là mật mã Caesar (Caesar cipher), dịch chuyển mỗi chữ cái đi một số vị trí cố định. Ví dụ, dịch 1 ký tự thì `a` trở thành `b`, `b` trở thành `c`, và cứ thế. Nhiều biến thể của mật mã Caesar dùng số bước dịch khác nhau, phổ biến nhất là `rot13`, dịch mỗi ký tự về phía trước 13 vị trí.

#### Nhận diện Caesar/Rot13

Dù phương pháp encode này khiến text trông như ngẫu nhiên, vẫn có thể nhận ra nó vì mỗi ký tự được ánh xạ tới một ký tự cụ thể. Ví dụ, trong `rot13`, `http://www` trở thành `uggc://jjj`, vẫn còn giữ một số nét tương đồng và có thể được nhận ra.

#### Rot13 Encode
Trên Linux không có lệnh riêng nào để encode `rot13`. Tuy nhiên, khá dễ để tự tạo lệnh thực hiện việc dịch chuyển ký tự:

```shell-session
[!bash!]$ echo https://www.hackthebox.eu/ | tr 'A-Za-z' 'N-ZA-Mn-za-m'

uggcf://jjj.unpxgurobk.rh/
```

#### Rot13 Decode
Ta cũng có thể dùng chính lệnh trước đó để decode rot13:
```shell-session
[!bash!]$ echo uggcf://jjj.unpxgurobk.rh/ | tr 'A-Za-z' 'N-ZA-Mn-za-m'

https://www.hackthebox.eu/
```

Một lựa chọn khác để encode/decode rot13 là dùng công cụ online, như [rot13](https://rot13.com/).

---
## Các kiểu encoding khác

Có hàng trăm phương pháp encode khác mà ta có thể tìm thấy trên mạng. Dù các phương pháp trên là phổ biến nhất, đôi khi ta sẽ gặp các phương pháp encode khác, có thể cần chút kinh nghiệm để nhận diện và decode.

`If you face any similar types of encoding, first try to determine the type of encoding, and then look for online tools to decode it.` (Nếu gặp bất kỳ kiểu encoding tương tự nào, trước hết hãy xác định loại encoding, rồi tìm công cụ online để decode nó.)

Một số công cụ có thể giúp ta tự động xác định loại encoding, như [Cipher Identifier](https://www.boxentriq.com/code-breaking/cipher-identifier). Hãy thử các chuỗi đã encode ở trên với [Cipher Identifier](https://www.boxentriq.com/code-breaking/cipher-identifier) để xem nó có xác định đúng phương pháp encode hay không.

Ngoài encoding, nhiều công cụ obfuscation còn dùng encryption (mã hoá) — tức là encode một chuỗi bằng một key — điều này có thể khiến code bị obfuscate rất khó reverse engineer và deobfuscate, đặc biệt nếu key giải mã không được lưu ngay trong script.
