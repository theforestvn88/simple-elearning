require "test_helper"

class UserMailerTest < ActionMailer::TestCase
    setup do
        @user = create(:user)
    end

    test 'email account verification' do
        mail = UserMailer.with(user: @user).account_verification
        assert_equal mail.subject, 'Verify Account'
        assert_equal mail.to, [@user.email]
    end
end
