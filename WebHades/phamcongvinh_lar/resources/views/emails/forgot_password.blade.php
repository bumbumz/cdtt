<p>Chào {{ $user->name }},</p>
<p>Bạn đã yêu cầu đặt lại mật khẩu của mình. Vui lòng nhấn vào liên kết dưới đây để đặt lại mật khẩu:</p>
<p><a href="{{ url('/reset-password?token=' . $token) }}">Đặt lại mật khẩu</a></p>
<p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
<p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
