# SOC Definition & Fundamentals (Định nghĩa và kiến thức nền tảng về SOC)


## SOC là gì?

Security Operations Center (SOC – trung tâm điều hành an ninh) là một bộ phận thiết yếu, nơi tập hợp một đội ngũ chuyên gia bảo mật thông tin chịu trách nhiệm liên tục giám sát và đánh giá tình trạng bảo mật của một tổ chức. Mục tiêu chính của đội SOC là nhận diện, phân tích và xử lý các sự cố an ninh mạng bằng cách kết hợp các giải pháp công nghệ với một bộ quy trình toàn diện.

Đội SOC thường gồm các security analyst, engineer giỏi và các manager giám sát hoạt động bảo mật. Họ phối hợp chặt chẽ với các đội incident response (ứng phó sự cố) của tổ chức để đảm bảo các vấn đề bảo mật được phát hiện và giải quyết kịp thời.

Đội SOC sử dụng nhiều giải pháp công nghệ khác nhau, chẳng hạn hệ thống Security Information and Event Management (SIEM), Intrusion Detection and Prevention Systems (IDS/IPS) và các công cụ Endpoint Detection and Response (EDR), để giám sát và nhận diện các mối đe doạ bảo mật. Họ cũng tận dụng threat intelligence và tham gia các hoạt động threat hunting (săn tìm mối đe doạ) để chủ động phát hiện các mối đe doạ và lỗ hổng tiềm ẩn.

Bên cạnh việc sử dụng các giải pháp công nghệ, đội SOC tuân theo một loạt quy trình được định nghĩa rõ ràng để xử lý các security incident. Các quy trình này bao gồm triage (phân loại) sự cố, containment (ngăn chặn), loại bỏ (elimination) và khôi phục (recovery). Đội SOC phối hợp chặt chẽ với đội incident response để đảm bảo các security incident được xử lý đúng cách, bảo vệ tình trạng bảo mật của tổ chức.

Tóm lại, SOC là một thành phần sống còn trong chiến lược an ninh mạng của một tổ chức. Nó cung cấp khả năng giám sát và phản ứng liên tục, giúp tổ chức phát hiện và xử lý kịp thời các security incident, giảm thiểu hậu quả của một vụ vi phạm bảo mật và giảm khả năng xảy ra các cuộc tấn công trong tương lai.

---

## SOC hoạt động như thế nào?

Chức năng chính của đội SOC là quản lý khía cạnh vận hành liên tục của bảo mật thông tin doanh nghiệp, thay vì tập trung vào việc xây dựng chiến lược bảo mật, thiết kế kiến trúc bảo mật hay triển khai các biện pháp bảo vệ.

Đội SOC chủ yếu gồm các security analyst cùng làm việc để phát hiện, đánh giá, phản ứng, báo cáo và ngăn chặn các sự cố an ninh mạng.

Bên cạnh các trách nhiệm chính của một đội SOC, một số SOC có thể sở hữu các năng lực nâng cao như phân tích forensic (điều tra số) và phân tích malware. Những năng lực này cho phép đội SOC điều tra chuyên sâu các security incident và tìm hiểu nguyên nhân gốc rễ (root cause) của sự cố để ngăn chặn các cuộc tấn công trong tương lai.

Như đã đề cập, đội SOC cũng phối hợp chặt chẽ với đội incident response để đảm bảo các security incident được xử lý đúng cách và duy trì tình trạng bảo mật (security posture) của tổ chức.

---

## Các vai trò trong một SOC

Một đội SOC gồm nhiều vai trò khác nhau, chịu trách nhiệm xử lý khía cạnh vận hành liên tục của bảo mật thông tin doanh nghiệp. Các vai trò này có thể bao gồm:

- `SOC Director`: Chịu trách nhiệm quản lý tổng thể và hoạch định chiến lược cho SOC, bao gồm ngân sách, nhân sự và việc bám sát các mục tiêu bảo mật của tổ chức.

- `SOC Manager`: Giám sát hoạt động hằng ngày, quản lý đội, điều phối các nỗ lực incident response và đảm bảo phối hợp trơn tru với các phòng ban khác.

- `Tier 1 Analyst`: Giám sát các security alert và event, triage các sự cố tiềm ẩn và escalate (chuyển cấp) chúng lên các tier cao hơn để điều tra thêm.

- `Tier 2 Analyst`: Phân tích chuyên sâu các sự cố đã được escalate, nhận diện các mẫu (pattern) và xu hướng, đồng thời xây dựng chiến lược giảm thiểu (mitigation) để xử lý các mối đe doạ bảo mật.

- `Tier 3 Analyst`: Cung cấp chuyên môn nâng cao trong việc xử lý các security incident phức tạp, thực hiện các hoạt động threat hunting và phối hợp với các đội khác để cải thiện tình trạng bảo mật của tổ chức.

- `Detection Engineer`: Detection Engineer chịu trách nhiệm xây dựng, triển khai và duy trì các detection rule và signature cho các công cụ giám sát bảo mật như SIEM, IDS/IPS và các giải pháp EDR. Họ làm việc chặt chẽ với security analyst để tìm ra các lỗ hổng trong độ bao phủ phát hiện (detection coverage) và liên tục cải thiện khả năng phát hiện và phản ứng với mối đe doạ của tổ chức.

- `Incident Responder`: Đảm nhận các security incident đang diễn ra, thực hiện digital forensics chuyên sâu cùng các nỗ lực containment và khắc phục (remediation), đồng thời phối hợp với các đội khác để khôi phục các hệ thống bị ảnh hưởng và ngăn chặn sự cố tái diễn.

- `Threat Intelligence Analyst`: Thu thập, phân tích và phổ biến dữ liệu threat intelligence để giúp các thành viên đội SOC hiểu rõ hơn bối cảnh mối đe doạ (threat landscape) và chủ động phòng thủ trước các rủi ro mới nổi.

- `Security Engineer`: Xây dựng, triển khai và duy trì các công cụ, công nghệ và hạ tầng bảo mật, đồng thời cung cấp chuyên môn kỹ thuật cho đội SOC.

- `Compliance and Governance Specialist`: Đảm bảo các hoạt động và quy trình bảo mật của tổ chức tuân thủ các tiêu chuẩn ngành, quy định và best practice liên quan, đồng thời hỗ trợ các yêu cầu về kiểm toán (audit) và báo cáo.

- `Security Awareness and Training Coordinator`: Xây dựng và triển khai các chương trình đào tạo và nâng cao nhận thức bảo mật để hướng dẫn nhân viên về các best practice an ninh mạng và thúc đẩy văn hoá bảo mật trong tổ chức.

---

Cần lưu ý rằng các vai trò và trách nhiệm cụ thể trong mỗi tier có thể khác nhau tuỳ theo quy mô, ngành nghề và các yêu cầu bảo mật cụ thể của tổ chức.

Nhìn chung, cấu trúc phân tầng (tier) có thể được mô tả như sau:

- `Tier 1 Analysts`: Còn được gọi là "first responders" (người phản ứng đầu tiên), các analyst này giám sát security event và alert, thực hiện triage ban đầu và escalate các sự cố tiềm ẩn lên các tier cao hơn để điều tra thêm. Mục tiêu chính của họ là nhanh chóng nhận diện và sắp xếp mức độ ưu tiên cho các security incident.

- `Tier 2 Analysts`: Các analyst này có nhiều kinh nghiệm hơn và thực hiện phân tích sâu hơn các sự cố đã được escalate. Họ nhận diện các mẫu và xu hướng, xây dựng chiến lược giảm thiểu, và đôi khi hỗ trợ các nỗ lực incident response. Họ cũng có thể chịu trách nhiệm tinh chỉnh (tuning) các công cụ giám sát bảo mật để giảm false positive và cải thiện khả năng phát hiện.

- `Tier 3 Analysts`: Thường được xem là những analyst giàu kinh nghiệm và hiểu biết nhất trong đội, analyst Tier 3 xử lý các security incident phức tạp và nghiêm trọng nhất. Họ cũng có thể tham gia threat hunting chủ động, xây dựng các chiến lược phát hiện và phòng ngừa nâng cao, và phối hợp với các đội khác để cải thiện tình trạng bảo mật tổng thể của tổ chức.

---

## Các giai đoạn phát triển của SOC

Security Operations Center (SOC) đã phát triển đáng kể kể từ những ngày đầu khi còn là các Network Operation Center tập trung chủ yếu vào an ninh mạng. Ở thế hệ đầu tiên, gọi là SOC 1.0, các tổ chức đầu tư vào một số lớp bảo mật nhất định như nền tảng security intelligence hay hệ thống quản lý danh tính (identity management). Tuy nhiên, việc thiếu tích hợp đúng cách dẫn đến các alert không được tương quan với nhau và công việc dồn ứ trên nhiều nền tảng. Giai đoạn này có đặc điểm là chú trọng vào bảo mật mạng và bảo mật vành đai (perimeter), ngay cả khi các mối đe doạ đã bắt đầu khai thác những vector khác. Đáng ngạc nhiên là một số tổ chức vẫn tiếp tục dựa vào cách tiếp cận lỗi thời này, như thể đang chờ một vụ vi phạm lớn xảy ra.

Sự xuất hiện của các mối đe doạ tinh vi, bao gồm các cuộc tấn công đa vector (multi-vector), dai dẳng (persistent) và bất đồng bộ (asynchronous) với các indicator of compromise được che giấu, đã thúc đẩy quá trình chuyển đổi sang SOC 2.0. Malware, bao gồm cả các biến thể trên thiết bị di động, và botnet là những phương thức phát tán chính của các cuộc tấn công này. Tuổi thọ, hành vi thay đổi liên tục và sự phát triển của botnet theo thời gian đã trở thành trọng tâm của threat intelligence. SOC 2.0 được xây dựng dựa trên intelligence, tích hợp security telemetry, threat intelligence, phân tích network flow và các kỹ thuật phát hiện bất thường (anomaly detection) khác. Ngoài ra, ở giai đoạn này còn áp dụng phân tích layer-7 để nhận diện các cuộc tấn công "low and slow" (chậm và âm thầm) cùng các mối đe doạ ẩn khác. Cách tiếp cận hướng tới tương lai trong nghiên cứu mối đe doạ và sự hợp tác giữa các SOC, dù trong cùng ngành hay ở cấp quốc gia, là yếu tố then chốt cho thành công của SOC 2.0. Trọng tâm được đặt vào nhận thức tình huống (situational awareness) toàn diện, sự chuẩn bị trước sự kiện thông qua quản lý lỗ hổng (vulnerability management), quản lý cấu hình (configuration management) và quản lý rủi ro động (dynamic risk management), cũng như phân tích và rút kinh nghiệm sau sự kiện thông qua incident response và forensics chuyên sâu. Việc tinh chỉnh các rule security intelligence và triển khai các biện pháp đối phó (countermeasure) cũng rất quan trọng ở giai đoạn này.

Cognitive SOC (SOC nhận thức), hay SOC thế hệ tiếp theo, hướng tới việc khắc phục những thiếu sót còn lại của SOC 2.0. Dù SOC 2.0 có đầy đủ các hệ thống con thiết yếu, nó thường thiếu kinh nghiệm vận hành và sự phối hợp hiệu quả giữa đội nghiệp vụ và đội bảo mật để tạo ra các rule phát hiện những mối đe doạ đặc thù cho các quy trình và hệ thống nghiệp vụ. Hơn nữa, nhiều tổ chức vẫn còn thiếu các quy trình incident response và khôi phục được chuẩn hoá.

Cognitive SOC hướng tới giải quyết các vấn đề này bằng cách tích hợp các hệ thống học (learning system) để bù đắp những khoảng trống kinh nghiệm trong việc ra quyết định bảo mật. Dù tỷ lệ thành công của cách tiếp cận này có thể chưa hoàn hảo trong mọi trường hợp, nó được kỳ vọng sẽ cải thiện theo thời gian.

[Tham khảo: https://www.linkedin.com/pulse/evolution-security-operations-center-20-beyond-krishnan-jagannathan/](https://www.linkedin.com/pulse/evolution-security-operations-center-20-beyond-krishnan-jagannathan/)
