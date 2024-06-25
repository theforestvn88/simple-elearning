module AsAccount
    extend ActiveSupport::Concern

    included do
        has_secure_password

        validates :email, presence: true, on: :create
        validates :name, presence: true, on: :create
        validates :password, presence: true, length: { minimum: 10 }, on: :create
        validates :password_confirmation, presence: true, length: { minimum: 10 }, on: :create
    
        normalizes :email, with: -> { _1.strip.downcase }
        
        EMAIL_VERIFICATION_EXPIRE_TIME = 1.day
        generates_token_for :email_verification, expires_in: EMAIL_VERIFICATION_EXPIRE_TIME do
            email
        end
    end
end
