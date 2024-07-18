module AsAccount
    extend ActiveSupport::Concern

    included do
        has_secure_password
        has_one_attached :avatar

        validates :email, presence: true, on: :create
        validates :name, presence: true, on: :create
        validates :password, presence: true, length: { minimum: 10 }, if: -> { new_record? || password_digest_changed? }
        validates :password_confirmation, presence: true, length: { minimum: 10 }, if: -> { new_record? || password_digest_changed? }
    
        normalizes :email, with: -> { _1.strip.downcase }
        
        EMAIL_VERIFICATION_EXPIRE_TIME = 1.day
        generates_token_for :email_verification, expires_in: EMAIL_VERIFICATION_EXPIRE_TIME do
            email
        end
    end
end
