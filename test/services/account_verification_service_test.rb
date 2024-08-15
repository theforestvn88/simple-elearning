require 'test_helper'

class AccountVerificationServiceTest < ActiveSupport::TestCase
    setup do
        @user = create(:user)
        @subject = ::AccountVerificationService.new
    end

    test 'verify user' do
        token = @user.generate_token_for(:email_verification)
        @subject.call(token)
        assert @user.reload.verified
    end
end
