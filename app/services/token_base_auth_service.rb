class TokenBaseAuthService
    def login(email, password)
        user = User.find_by(email: email)
        if user && user.authenticate(password)
            generate_token(user)
        end
    end

    def logout(token)
        ::TokenCacheStore.new.delete(token)
    end

    def register(user_params)
        user = User.new(user_params)
        if user.save
            return { token: generate_token(user), user: user }
        end
    end

    def authorized_user(token)
        return nil unless ::TokenCacheStore.new.exist?(token)

        payload = ::TokenService.new.decode(token)
        if Time.parse(payload[:expire]) >= Time.now.utc
            return User.find_by(id: payload[:user_id])
        end
    end

    private

        TOKEN_LIFE_TIME = 1.day.freeze

        def generate_token(user)
            payload = generate_payload(user)
            ::TokenService.new.encode(payload).tap do |token|
                ::TokenCacheStore.new.save(token, expires_at: payload[:expire])
            end
        end

        def generate_payload(user)
            {
                user_id: user.id,
                expire: TOKEN_LIFE_TIME.from_now.utc
            }
        end
end
