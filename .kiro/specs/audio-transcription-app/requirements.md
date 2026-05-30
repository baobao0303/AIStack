# Requirements Document

## Introduction

Audio Transcription App là một ứng dụng web cho phép người dùng đăng nhập, mua gói trả phí để nhận credits, tải lên các tệp âm thanh của riêng họ, và nhận lại bản ghi văn bản (transcript) được trích xuất bằng mô hình ngôn ngữ lớn (LLM). Ứng dụng được xây dựng bằng Next.js với thư viện giao diện ShadCN/ui, triển khai trên Vercel, sử dụng Clerk cho xác thực và Clerk Billing (Stripe) cho thanh toán, và sử dụng Vercel AI SDK với Google Provider (model `gemini-2.5-flash`) để thực hiện trích xuất transcript.

Tài liệu này đặc tả các yêu cầu chức năng và phi chức năng cho ứng dụng theo chuẩn EARS, làm nền tảng cho giai đoạn thiết kế (design) và lập kế hoạch triển khai (tasks).

## Glossary

- **Auth_System**: Thành phần xác thực và quản lý phiên đăng nhập, được cung cấp bởi Clerk.
- **Billing_System**: Thành phần quản lý gói sản phẩm và thanh toán, sử dụng Clerk Billing tích hợp Stripe.
- **Credit_Ledger**: Thành phần quản lý số dư credit của người dùng, ghi nhận việc cấp, trừ và hoàn credit.
- **Upload_Service**: Thành phần nhận và lưu trữ tệp âm thanh do người dùng tải lên (lưu trên Vercel Blob).
- **Transcription_Service**: Thành phần gọi Vercel AI SDK với Google Provider (model `gemini-2.5-flash`) để trích xuất transcript từ tệp âm thanh.
- **Transcript_Store**: Cơ sở dữ liệu (Postgres trên Vercel Postgres/Neon) lưu transcript và metadata.
- **Dashboard**: Trang quản trị ứng dụng (app dashboard) nơi người dùng tải lên audio, xem và quản lý transcript.
- **System**: Toàn bộ ứng dụng Audio Transcription App khi không chỉ định thành phần cụ thể.
- **Credit**: Đơn vị tiêu dùng nội bộ. 1 credit tương ứng 1 phút âm thanh (làm tròn lên).
- **Free_Plan**: Gói miễn phí, cấp 5 credits dùng thử.
- **Pro_Plan**: Gói trả phí giá $10 (thanh toán một lần), cấp 100 credits.
- **Audio_File**: Tệp âm thanh do người dùng tải lên với định dạng và giới hạn được quy định.
- **Transcript**: Văn bản kết quả được trích xuất từ một Audio_File.
- **Owner**: Người dùng đã tạo và sở hữu một Transcript hoặc Audio_File cụ thể.

## Requirements

### Requirement 1: Xác thực người dùng

**User Story:** As a người dùng, I want đăng nhập an toàn, so that chỉ tôi mới truy cập được các tính năng và dữ liệu của riêng tôi.

#### Acceptance Criteria

1. WHEN một người dùng chưa đăng nhập truy cập một route được bảo vệ, THE Auth_System SHALL chuyển hướng người dùng đến trang đăng nhập.
2. WHEN một người dùng cung cấp thông tin đăng nhập hợp lệ qua Clerk, THE Auth_System SHALL tạo một phiên đăng nhập và cấp quyền truy cập các route được bảo vệ.
3. WHEN một người dùng mới hoàn tất đăng ký, THE System SHALL khởi tạo tài khoản với Free_Plan và cấp 5 credits.
4. WHEN một người dùng đã đăng nhập chọn đăng xuất, THE Auth_System SHALL kết thúc phiên đăng nhập và chuyển hướng đến trang công khai.
5. IF một yêu cầu đến route được bảo vệ không có phiên hợp lệ, THEN THE Auth_System SHALL từ chối yêu cầu với mã trạng thái 401.

### Requirement 2: Trang Billing và mua gói

**User Story:** As a người dùng, I want xem và mua gói trên trang billing, so that tôi nhận được credits để sử dụng dịch vụ transcribe.

#### Acceptance Criteria

1. WHEN một người dùng đã đăng nhập mở trang billing, THE Billing_System SHALL hiển thị hai sản phẩm: Free_Plan và Pro_Plan với giá $10 cho Pro_Plan.
2. WHEN một người dùng chọn mua Pro_Plan, THE Billing_System SHALL khởi tạo phiên thanh toán Stripe thông qua Clerk Billing.
3. WHEN một giao dịch thanh toán Pro_Plan hoàn tất thành công, THE Credit_Ledger SHALL cộng 100 credits vào số dư của người dùng.
4. WHEN một giao dịch thanh toán Pro_Plan hoàn tất thành công, THE System SHALL chuyển hướng người dùng đến Dashboard.
5. IF một giao dịch thanh toán thất bại hoặc bị hủy, THEN THE Billing_System SHALL giữ nguyên số dư credit và hiển thị thông báo trạng thái thanh toán thất bại.
6. WHEN Billing_System nhận một sự kiện webhook thanh toán từ Stripe, THE Billing_System SHALL xác minh chữ ký webhook trước khi cập nhật số dư credit.
7. IF một sự kiện webhook thanh toán trùng lặp với sự kiện đã xử lý, THEN THE Credit_Ledger SHALL bỏ qua sự kiện trùng lặp và giữ nguyên số dư credit.

### Requirement 3: Quản lý credit

**User Story:** As a người dùng, I want hệ thống theo dõi số dư credit của tôi, so that tôi biết mình còn bao nhiêu lượt sử dụng và bị trừ chính xác.

#### Acceptance Criteria

1. THE Credit_Ledger SHALL hiển thị số dư credit hiện tại của người dùng trên Dashboard.
2. WHEN một Audio_File được gửi để transcribe, THE Credit_Ledger SHALL tính số credit cần dùng bằng thời lượng audio tính theo phút, làm tròn lên số nguyên gần nhất.
3. WHEN một yêu cầu transcribe được chấp nhận xử lý, THE Credit_Ledger SHALL trừ số credit đã tính trước khi gọi Transcription_Service.
4. IF số dư credit của người dùng nhỏ hơn số credit cần dùng cho một Audio_File, THEN THE System SHALL từ chối yêu cầu transcribe và hiển thị thông báo kèm liên kết đến trang billing.
5. WHEN một yêu cầu transcribe thất bại sau khi credit đã bị trừ, THE Credit_Ledger SHALL hoàn lại đúng số credit đã trừ cho người dùng.
6. THE Credit_Ledger SHALL duy trì số dư credit không nhỏ hơn 0 sau mọi thao tác trừ và hoàn.

### Requirement 4: Tải lên tệp âm thanh

**User Story:** As a người dùng, I want tải lên tệp âm thanh của tôi trên Dashboard, so that tôi có thể yêu cầu trích xuất transcript.

#### Acceptance Criteria

1. WHEN một người dùng đã đăng nhập chọn một Audio_File để tải lên trên Dashboard, THE Upload_Service SHALL chấp nhận các định dạng mp3, wav, m4a, webm và ogg.
2. IF một tệp được tải lên có định dạng ngoài danh sách cho phép, THEN THE Upload_Service SHALL từ chối tệp và hiển thị thông báo về định dạng được hỗ trợ.
3. IF một Audio_File có kích thước vượt quá 25 MB, THEN THE Upload_Service SHALL từ chối tệp và hiển thị thông báo về giới hạn kích thước.
4. IF một Audio_File có thời lượng vượt quá 30 phút, THEN THE Upload_Service SHALL từ chối tệp và hiển thị thông báo về giới hạn thời lượng.
5. WHEN một Audio_File hợp lệ được tải lên thành công, THE Upload_Service SHALL lưu tệp vào Vercel Blob và liên kết tệp với Owner.

### Requirement 5: Trích xuất transcript bằng LLM

**User Story:** As a người dùng, I want hệ thống trích xuất transcript từ audio của tôi bằng LLM, so that tôi nhận được văn bản từ nội dung âm thanh.

#### Acceptance Criteria

1. WHEN một Audio_File hợp lệ đã được tải lên và đủ credit, THE Transcription_Service SHALL gửi Audio_File đến Vercel AI SDK với Google Provider sử dụng model `gemini-2.5-flash`.
2. WHEN Transcription_Service nhận kết quả transcript thành công, THE Transcript_Store SHALL lưu Transcript cùng metadata gồm Owner, tên tệp gốc, thời lượng audio, số credit đã dùng và thời điểm tạo.
3. WHILE một yêu cầu transcribe đang được xử lý, THE Dashboard SHALL hiển thị trạng thái đang xử lý cho yêu cầu đó.
4. WHEN một Transcript được tạo thành công, THE System SHALL phát hiện ngôn ngữ của transcript và lưu mã ngôn ngữ cùng Transcript.
5. IF Transcription_Service nhận lỗi từ nhà cung cấp LLM, THEN THE System SHALL đánh dấu yêu cầu là thất bại, hoàn lại credit và hiển thị thông báo lỗi.
6. IF một yêu cầu transcribe vượt quá thời gian xử lý tối đa cho phép, THEN THE System SHALL đánh dấu yêu cầu là thất bại, hoàn lại credit và hiển thị thông báo lỗi quá thời gian.

### Requirement 6: Xem và quản lý transcript

**User Story:** As a người dùng, I want xem, tải xuống và xóa các transcript của tôi, so that tôi quản lý được lịch sử công việc của mình.

#### Acceptance Criteria

1. WHEN một người dùng đã đăng nhập mở Dashboard, THE Dashboard SHALL hiển thị danh sách các Transcript thuộc về người dùng đó kèm tên tệp gốc và thời điểm tạo.
2. WHEN một người dùng chọn một Transcript trong danh sách, THE Dashboard SHALL hiển thị nội dung văn bản đầy đủ của Transcript đó.
3. WHEN một người dùng chọn tải xuống một Transcript, THE System SHALL cung cấp nội dung Transcript dưới dạng tệp văn bản .txt.
4. WHEN một người dùng chọn xóa một Transcript thuộc về mình, THE Transcript_Store SHALL xóa Transcript đó và Audio_File liên quan.
5. IF một người dùng yêu cầu xem hoặc xóa một Transcript không thuộc về mình, THEN THE System SHALL từ chối yêu cầu với mã trạng thái 403.

### Requirement 7: Round-trip lưu trữ và truy xuất transcript

**User Story:** As a người dùng, I want transcript của tôi được lưu và hiển thị nguyên vẹn, so that nội dung tôi xem lại đúng với kết quả gốc.

#### Acceptance Criteria

1. WHEN một Transcript được lưu vào Transcript_Store rồi được truy xuất, THE Transcript_Store SHALL trả về nội dung văn bản giống hệt nội dung đã lưu (thuộc tính round-trip).
2. WHEN một Transcript được tải xuống dưới dạng .txt, THE System SHALL bảo toàn nội dung văn bản giống hệt nội dung được lưu trong Transcript_Store.

### Requirement 8: Bảo mật và kiểm soát truy cập (Non-functional)

**User Story:** As a người dùng, I want dữ liệu của tôi được bảo vệ, so that không ai khác truy cập được audio và transcript của tôi.

#### Acceptance Criteria

1. THE System SHALL giới hạn quyền truy cập mỗi Audio_File và mỗi Transcript chỉ cho Owner tương ứng.
2. WHERE một endpoint API thao tác trên dữ liệu người dùng, THE System SHALL yêu cầu một phiên Clerk hợp lệ trước khi xử lý yêu cầu.
3. WHEN một người dùng gửi nhiều hơn 10 yêu cầu transcribe trong vòng 60 giây, THE System SHALL từ chối các yêu cầu vượt mức với mã trạng thái 429.
4. IF một webhook thanh toán đến mà không có chữ ký Stripe hợp lệ, THEN THE Billing_System SHALL từ chối yêu cầu với mã trạng thái 400.

### Requirement 9: Hiệu năng và phản hồi (Non-functional)

**User Story:** As a người dùng, I want ứng dụng phản hồi kịp thời, so that tôi có trải nghiệm sử dụng mượt mà.

#### Acceptance Criteria

1. WHEN một người dùng gửi một Audio_File hợp lệ để transcribe, THE System SHALL xác nhận đã nhận yêu cầu và hiển thị trạng thái đang xử lý trong vòng 2 giây.
2. WHEN một người dùng mở Dashboard, THE System SHALL hiển thị danh sách Transcript trong vòng 3 giây với tối đa 100 mục.
