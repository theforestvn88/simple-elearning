class UserMailer < ApplicationMailer
    def account_verification
        @user = params[:user]
        @token = @user.generate_token_for(:email_verification)
    
        mail to: @user.email, subject: "Verify Account"
    end
end
