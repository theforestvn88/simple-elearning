class AccountVerificationService
    def send_account_verification_email_to_user(user)
        UserMailer.with(user: user).account_verification.deliver_later
    end

    def verify_user(token)
        @user = User.find_by_token_for!(:email_verification, token)
        @user.update!(verified: true)
    end
end
