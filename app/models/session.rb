class Session
    attr_reader :token, :token_expire_at, :user

    def initialize(token:, token_expire_at:, user: nil)
        @token = token
        @token_expire_at = token_expire_at
        @user = user
    end
end
