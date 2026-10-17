# Threat Hunting Fundamentals (Kiến thức nền tảng về Threat Hunting)


## Định nghĩa Threat Hunting

Khoảng thời gian trung vị giữa lúc một vụ xâm phạm bảo mật thực sự xảy ra và lúc nó bị phát hiện, còn gọi là "dwell time" (thời gian lưu trú), thường kéo dài vài tuần, thậm chí vài tháng. Điều này có nghĩa là kẻ tấn công có thể đã hiện diện trong mạng suốt gần ba tuần — một khoảng thời gian có thể gây tác động rất nghiêm trọng.

Thực tế đáng báo động này cho thấy các chiến thuật an ninh mạng truyền thống, thiên về phòng thủ, ngày càng kém hiệu quả. Để đối phó, chúng ta ủng hộ việc chuyển đổi tư duy sang một chiến lược chủ động, mang tính tấn công — tức là bắt đầu thực hiện threat hunting.

`Threat hunting` là một hoạt động chủ động, do con người dẫn dắt và thường dựa trên giả thuyết (hypothesis-driven), rà soát dữ liệu mạng một cách có hệ thống để nhận diện các mối đe doạ tinh vi, ẩn mình, vốn lọt qua được các giải pháp bảo mật hiện có. Bước chuyển chiến lược này, thoát khỏi thế phản ứng (reactive) truyền thống, giúp ta phát hiện những mối đe doạ âm thầm mà các hệ thống phát hiện tự động hoặc các bên bên ngoài như cơ quan thực thi pháp luật có thể không nhận ra.

Mục tiêu chính của threat hunting là giảm đáng kể dwell time bằng cách nhận diện các thực thể độc hại ở giai đoạn sớm nhất của cyber kill chain. Thế chủ động này có khả năng ngăn threat actor bám rễ sâu vào hạ tầng của chúng ta và vô hiệu hoá chúng nhanh chóng.

Quy trình threat hunting bắt đầu bằng việc xác định các tài sản (asset) — hệ thống hoặc dữ liệu — có thể là mục tiêu giá trị cao đối với threat actor. Tiếp theo, ta phân tích các TTP (Tactics, Techniques, and Procedures) mà những kẻ tấn công này nhiều khả năng sẽ sử dụng, dựa trên threat intelligence hiện có. Sau đó, ta cố gắng chủ động phát hiện, cô lập và xác thực mọi artifact liên quan đến các TTP nói trên, cũng như mọi hoạt động bất thường lệch khỏi chuẩn baseline đã thiết lập.

Trong quá trình hunting, ta thường xuyên sử dụng Threat Intelligence — một thành phần quan trọng giúp xây dựng các giả thuyết hunting hiệu quả, phát triển các chiến thuật đối phó và thực thi các biện pháp bảo vệ nhằm ngăn hệ thống bị xâm nhập.

Các khía cạnh chính của threat hunting gồm:

- Một chiến lược mang tính tấn công, `proactive` (chủ động), ưu tiên dự đoán mối đe doạ hơn là phản ứng, dựa trên giả thuyết, TTP của kẻ tấn công và intelligence.
- Một phản ứng mang tính tấn công, `reactive` (bị động/phản ứng), tìm kiếm trên toàn mạng các artifact liên quan đến một sự cố đã được `verified` (xác minh), dựa trên bằng chứng và intelligence.
- Hiểu biết vững chắc, thực tế về bức tranh mối đe doạ (threat landscape), các mối đe doạ mạng, TTP của kẻ tấn công và cyber kill chain.
- Khả năng đồng cảm nhận thức (cognitive empathy) với kẻ tấn công, giúp hiểu được tư duy của đối phương.
- Kiến thức sâu sắc về môi trường IT, topology mạng, tài sản số và hoạt động bình thường của tổ chức.
- Sử dụng dữ liệu có độ tin cậy cao (high-fidelity) và phân tích chiến thuật, đồng thời tận dụng các công cụ và nền tảng threat hunting tiên tiến.

---

## Mối quan hệ giữa Incident Handling & Threat Hunting

Vậy threat hunting giao thoa với các giai đoạn của Incident Handling (xử lý sự cố) như thế nào?

- Ở giai đoạn `Preparation` của incident handling, đội threat hunting phải thiết lập các quy tắc tác chiến (rules of engagement) chặt chẽ, rõ ràng. Cần xây dựng các quy trình vận hành, nêu rõ khi nào và can thiệp như thế nào, hướng xử lý trong từng tình huống cụ thể, v.v. Tổ chức có thể chọn lồng ghép threat hunting vào các chính sách và quy trình incident handling hiện có, khi đó không cần chính sách và quy trình threat hunting riêng.

- Trong giai đoạn `Detection & Analysis` của incident handling, sự nhạy bén của threat hunter là không thể thiếu. Họ có thể bổ trợ cho quá trình điều tra, xác định xem các indicator of compromise (IoC) quan sát được có thực sự là dấu hiệu của một sự cố hay không, và hơn nữa, tư duy của kẻ tấn công mà họ có có thể giúp phát hiện thêm các artifact hoặc IoC có thể đã bị bỏ sót lúc đầu.

- Ở giai đoạn `Containment, Eradication, and Recovery` của incident handling, vai trò của hunter có thể rất đa dạng. Một số tổ chức có thể kỳ vọng hunter thực hiện các công việc trong các bước Containment, Eradication và Recovery. Tuy nhiên, đây không phải là thông lệ được áp dụng ở mọi nơi. Vai trò và trách nhiệm cụ thể của đội hunting sẽ được quy định trong các tài liệu quy trình và chính sách bảo mật.

- Đối với giai đoạn `Post-Incident Activity` của incident handling, hunter — với chuyên môn sâu rộng trải dài nhiều lĩnh vực IT và IT Security — có thể đóng góp đáng kể. Họ có thể đưa ra các khuyến nghị nhằm củng cố tình trạng bảo mật (security posture) tổng thể của tổ chức.

Chúng ta đã cố gắng làm rõ mối quan hệ cộng sinh giữa incident handling và threat hunting. Việc hai quy trình này nên được tích hợp hay hoạt động độc lập là một quyết định chiến lược, tuỳ thuộc vào bức tranh mối đe doạ, rủi ro, v.v. riêng của từng tổ chức.

---

## Cơ cấu của một đội Threat Hunting

Xây dựng một đội threat hunting là một quá trình mang tính chiến lược, được lên kế hoạch tỉ mỉ, đòi hỏi sự đa dạng về kỹ năng, chuyên môn và góc nhìn. Điều quan trọng là mỗi thành viên trong đội mang đến một bộ năng lực riêng, để khi kết hợp lại sẽ tạo thành một cách tiếp cận toàn diện, đầy đủ trong việc nhận diện, giảm thiểu và loại bỏ mối đe doạ.

Một đội threat hunting lý tưởng thường gồm các vai trò sau:

- `Threat Hunter`: Vai trò cốt lõi của đội. Threat hunter là chuyên gia an ninh mạng hiểu sâu về bức tranh mối đe doạ, Tactics, Techniques, and Procedures (TTP) của kẻ tấn công và các phương pháp phát hiện mối đe doạ tinh vi. Họ chủ động tìm kiếm Indicators of Compromise (IoC) và thành thạo nhiều công cụ, nền tảng threat hunting khác nhau.

- `Threat Intelligence Analyst`: Những người này chịu trách nhiệm thu thập và phân tích dữ liệu từ nhiều nguồn, gồm open-source intelligence, dark web intelligence, báo cáo ngành và threat feed. Công việc của họ là hiểu bức tranh mối đe doạ hiện tại và dự đoán xu hướng tương lai, cung cấp những thông tin giá trị cho threat hunter.

- `Incident Responders`: Khi threat hunter xác định được mối đe doạ tiềm tàng, incident responder sẽ vào cuộc để xử lý tình huống. Họ điều tra sự cố kỹ lưỡng, đồng thời chịu trách nhiệm các hành động containment, eradication và recovery, đảm bảo tổ chức có thể nhanh chóng trở lại hoạt động bình thường.

- `Forensics Experts`: Đây là những thành viên đi sâu vào chi tiết kỹ thuật của sự cố. Họ thành thạo digital forensics and incident response (DFIR), có khả năng phân tích malware, reverse engineering các cuộc tấn công và cung cấp báo cáo sự cố chi tiết.

- `Data Analysts/Scientists`: Họ đóng vai trò then chốt trong việc phân tích các tập dữ liệu lớn, sử dụng mô hình thống kê, thuật toán machine learning và kỹ thuật data mining để phát hiện các mẫu (pattern), mối tương quan và xu hướng, từ đó đưa ra những insight có thể hành động được cho threat hunter.

- `Security Engineers/Architects`: Security engineer chịu trách nhiệm thiết kế tổng thể hạ tầng bảo mật của tổ chức. Họ đảm bảo mọi hệ thống, ứng dụng và mạng đều được thiết kế với yếu tố bảo mật ngay từ đầu, và thường phối hợp chặt chẽ với threat hunter để triển khai các công cụ và kỹ thuật hỗ trợ threat hunting, cũng như các lớp phòng thủ theo kill chain.

- `Network Security Analyst`: Những chuyên gia này chuyên về hành vi mạng và các mẫu lưu lượng (traffic pattern). Họ hiểu nhịp lên xuống bình thường của hoạt động mạng và có thể nhanh chóng nhận ra các bất thường báo hiệu một vụ xâm phạm bảo mật tiềm tàng.

- `SOC Manager`: Quản lý Security Operations Center (SOC) giám sát hoạt động của đội threat hunting, đảm bảo sự phối hợp nhịp nhàng giữa các thành viên và giao tiếp hiệu quả với phần còn lại của tổ chức.

---

## Khi nào nên Hunt?

Trong lĩnh vực an ninh mạng, threat hunting không nên được xem là một hoạt động rời rạc hay chỉ mang tính phản ứng, mà là một hoạt động liên tục, có tầm nhìn xa. Tuy nhiên, có những trường hợp cụ thể đòi hỏi phải tiến hành threat hunting ngay lập tức và với cường độ cao. Dưới đây là phân tích chi tiết hơn về những trường hợp này:

- `When New Information on an Adversary or Vulnerability Comes to Light` (Khi xuất hiện thông tin mới về một kẻ tấn công hoặc lỗ hổng): Bức tranh an ninh mạng luôn thay đổi, với thông tin mới về các mối đe doạ tiềm tàng và lỗ hổng hệ thống được phát hiện thường xuyên. Nếu có một kẻ tấn công mới được phát hiện, hoặc một lỗ hổng liên quan đến ứng dụng mà mạng của ta đang dùng, điều này đòi hỏi một đợt threat hunting ngay lập tức. Cần phải giải mã phương thức hoạt động (modus operandi) của kẻ tấn công và xem xét kỹ lỗ hổng để đánh giá rủi ro có thể xảy ra với hệ thống của ta. Ví dụ, nếu ta tình cờ phát hiện một lỗ hổng chưa từng được biết đến trong một ứng dụng được dùng rộng rãi, ta sẽ lập tức khởi động một đợt threat hunting để tìm mọi dấu hiệu khai thác.

- `When New Indicators are Associated with a Known Adversary` (Khi có indicator mới gắn với một kẻ tấn công đã biết): Các nguồn intelligence an ninh mạng thường công bố các Indicators of Compromise (IoC) mới gắn với những kẻ tấn công cụ thể. Nếu các indicator này gắn với một kẻ tấn công nổi tiếng là nhắm vào các mạng tương tự mạng của ta, hoặc nếu ta từng là mục tiêu của chính kẻ tấn công đó, ta cần khởi động một đợt threat hunting. Việc này giúp phát hiện mọi dấu vết hoạt động của kẻ tấn công trong hệ thống, cho phép ta ngăn chặn các vụ xâm phạm tiềm tàng.

- `When Multiple Network Anomalies are Detected` (Khi phát hiện nhiều bất thường trên mạng): Đôi khi các bất thường trên mạng có thể vô hại, do lỗi hệ thống hoặc các thay đổi hợp lệ gây ra. Tuy nhiên, nhiều bất thường xuất hiện cùng lúc hoặc trong một khoảng thời gian ngắn có thể gợi ý một vấn đề mang tính hệ thống hoặc một cuộc tấn công có tổ chức. Trong những trường hợp như vậy, việc tiến hành threat hunting là rất quan trọng để xác định nguyên nhân gốc rễ (root cause) của các bất thường này và xử lý mọi mối đe doạ có thể có. Ví dụ, nếu ta quan sát thấy hành vi lưu lượng mạng lạ hoặc các hoạt động hệ thống không mong đợi, ta sẽ khởi động threat hunting để điều tra các bất thường này.

- `During an Incident Response Activity` (Trong quá trình ứng phó sự cố): Khi phát hiện một sự cố bảo mật đã được xác nhận, đội Incident Response (IR) sẽ tập trung vào containment, eradication và recovery. Tuy vậy, trong lúc quy trình IR đang diễn ra, điều quan trọng là đồng thời tiến hành threat hunting trên toàn mạng. Điều này giúp ta phơi bày mọi mối đe doạ liên quan có thể chưa lộ diện ngay, hiểu được toàn bộ mức độ xâm nhập và ngăn chặn thiệt hại thêm. Ví dụ, trong một vụ malware xâm nhập đã được xác nhận, trong khi đội IR đang xử lý hệ thống bị nhiễm, threat hunting có thể giúp xác định các hệ thống khác có khả năng cũng đã bị xâm nhập.

- `Periodic Proactive Actions` (Các hoạt động chủ động định kỳ): Ngoài các tình huống nêu trên, cần lưu ý rằng threat hunting không nên chỉ là một nhiệm vụ phản ứng. Các đợt threat hunting chủ động, đều đặn là chìa khoá để phát hiện các mối đe doạ tiềm ẩn có thể đã lọt qua lớp phòng thủ bảo mật của ta. Điều này đảm bảo một chiến lược giám sát liên tục, củng cố tình trạng bảo mật tổng thể và giảm thiểu tác động tiềm tàng của một cuộc tấn công.

Tóm lại, thời điểm lý tưởng để threat hunting luôn là ngay bây giờ. Một thế chủ động trong threat hunting giúp ta phát hiện và vô hiệu hoá mối đe doạ trước khi chúng kịp gây thiệt hại đáng kể.

---

## Mối quan hệ giữa Risk Assessment & Threat Hunting

Risk assessment (đánh giá rủi ro), với tư cách là một khía cạnh thiết yếu của an ninh mạng, giúp hiểu toàn diện về các lỗ hổng tiềm tàng và các vector tấn công (threat vector) trong một tổ chức. Trong bối cảnh threat hunting, risk assessment đóng vai trò là yếu tố hỗ trợ then chốt, cho phép ta ưu tiên các hoạt động hunting và tập trung công sức vào những khu vực có tác động tiềm tàng lớn nhất.

Trước hết, risk assessment là một quy trình có hệ thống nhằm xác định và đánh giá rủi ro dựa trên các nguồn đe doạ tiềm tàng, các lỗ hổng hiện có và tác động tiềm tàng nếu các lỗ hổng này bị khai thác. Quy trình này gồm một loạt bước: xác định tài sản, xác định mối đe doạ, xác định lỗ hổng, xác định mức độ rủi ro, và cuối cùng là xây dựng chiến lược giảm thiểu rủi ro.

Trong quy trình threat hunting, thông tin thu được từ một đợt risk assessment kỹ lưỡng có thể định hướng hoạt động của ta theo nhiều cách:

- `Prioritizing Hunting Efforts` (Ưu tiên công sức hunting): Bằng cách nhận diện các tài sản quan trọng nhất (thường gọi là 'crown jewels' — "báu vật") và các rủi ro liên quan, ta có thể ưu tiên công sức threat hunting vào những khu vực này. Tài sản có thể bao gồm các kho dữ liệu nhạy cảm, các ứng dụng trọng yếu (mission-critical) hoặc hạ tầng mạng then chốt.

- `Understanding Threat Landscape` (Hiểu bức tranh mối đe doạ): Bước xác định mối đe doạ trong risk assessment giúp ta hiểu rõ hơn bức tranh mối đe doạ, bao gồm các Tactics, Techniques, and Procedures (TTP) mà các threat actor tiềm tàng sử dụng. Hiểu biết này hỗ trợ ta xây dựng các giả thuyết hunting — yếu tố thiết yếu cho threat hunting chủ động.

- `Highlighting Vulnerabilities` (Làm nổi bật các lỗ hổng): Risk assessment giúp làm nổi bật các lỗ hổng trong hệ thống, ứng dụng và quy trình của ta. Biết được những điểm yếu này cho phép ta tìm kiếm các dấu hiệu khai thác ở những khu vực đó. Ví dụ, nếu ta biết một ứng dụng cụ thể có lỗ hổng cho phép privilege escalation, ta có thể tìm kiếm các bất thường trong mức quyền của người dùng.

- `Informing the Use of Threat Intelligence` (Định hướng việc sử dụng Threat Intelligence): Threat intelligence thường được dùng trong threat hunting để nhận diện các mẫu hành vi độc hại. Risk assessment giúp định hướng việc áp dụng threat intelligence bằng cách xác định những threat actor có khả năng cao nhất và các phương thức tấn công ưa thích của chúng.

- `Refining Incident Response Plans` (Hoàn thiện kế hoạch ứng phó sự cố): Risk assessment cũng đóng vai trò quan trọng trong việc hoàn thiện các kế hoạch Incident Response (IR). Hiểu được các rủi ro có khả năng xảy ra giúp ta dự đoán và lên kế hoạch cho các vụ xâm phạm tiềm tàng, đảm bảo phản ứng nhanh chóng và hiệu quả.

- `Enhancing Cybersecurity Controls` (Tăng cường các biện pháp kiểm soát an ninh mạng): Cuối cùng, các chiến lược giảm thiểu rủi ro rút ra từ risk assessment có thể trực tiếp góp phần tăng cường các biện pháp kiểm soát và lớp phòng thủ an ninh mạng hiện có, củng cố thêm tình trạng bảo mật của tổ chức.

Về mặt kỹ thuật, việc áp dụng risk assessment cho threat hunting bao gồm việc sử dụng các công cụ và kỹ thuật tiên tiến, từ các công cụ quét lỗ hổng tự động và công cụ kiểm thử xâm nhập (penetration testing) cho đến các nền tảng threat intelligence tinh vi. Ví dụ, hệ thống SIEM (Security Information and Event Management) có thể được dùng để tổng hợp và tương quan (correlate) event từ nhiều nguồn khác nhau, cung cấp cái nhìn toàn diện về tình trạng bảo mật của tổ chức và hỗ trợ threat hunting.

Về bản chất, risk assessment và threat hunting gắn bó chặt chẽ với nhau, mỗi bên bổ trợ cho bên kia để tạo nên một tình trạng an ninh mạng vững chắc và bền bỉ hơn. Bằng cách thường xuyên tiến hành risk assessment toàn diện, ta có thể tập trung tốt hơn các hoạt động threat hunting, từ đó giảm dwell time, giảm thiểu thiệt hại tiềm tàng và tăng cường khả năng phòng thủ an ninh mạng tổng thể.
