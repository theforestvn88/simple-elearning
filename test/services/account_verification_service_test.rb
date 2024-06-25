require 'test_helper'

class AccountVerificationServiceTest < ActiveSupport::TestCase
    setup do
        @user = create(:user)
        @subject = ::AccountVerificationService.new
    end

    test 'send verify email' do
        mock_user_mailer = Minitest::Mock.new
        mock_user_mailer.expect :account_verification, mock_user_mailer, []
        mock_user_mailer.expect :deliver_later, nil, []
        
        ::UserMailer.stub :with, mock_user_mailer do
            @subject.send_account_verification_email_to_user(@user)
        end

        mock_user_mailer.verify
    end

    test 'verify user' do
        token = @user.generate_token_for(:email_verification)
        @subject.verify_user(token)
        assert @user.reload.verified
    end
end
