require "test_helper"
require_relative "./shared/send_email_tests"

class UserMailerTest < ActionMailer::TestCase
    include ::Shared::SendEmailTests

    setup do
        @user = create(:user)
    end

    test 'email account verification' do
        mailer = UserMailer.with(user: @user).account_verification
        assert_send_email(from_mailer: mailer, to: [@user.email], with_subject: 'Verify Account')
    end
end
