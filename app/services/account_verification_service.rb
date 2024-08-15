class AccountVerificationService
    def call(token)
        @user = User.find_by_token_for!(:email_verification, token)
        @user.update!(verified: true)
    end
end
