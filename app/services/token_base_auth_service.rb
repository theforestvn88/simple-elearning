class TokenBaseAuthService
    def login(email, password)
        user = User.find_by(email: email)
        if user && user.authenticate(password)
            generate_token(user).merge(user_info_response(user))
        end
    end

    def logout(token)
        ::TokenCacheStore.new.delete(token)
    end

    def register(user_params)
        user = User.new(user_params)
        if user.save
            return user, generate_token(user).merge(user_info_response(user))
        end
    end

    def authorized_user(token)
        return nil unless ::TokenCacheStore.new.exist?(token)

        payload = ::TokenService.new.decode(token)
        if Time.parse(payload[:expire]) >= Time.now.utc
            return User.find_by(id: payload[:user_id])
        end
    end

    def refresh_token(token, user)
        # TODO: validate user ???
        auth_info = generate_token(user)
        # should delete old-token ???
        ::TokenCacheStore.new.delete(token)
        auth_info
    end

    private

        TOKEN_LIFE_TIME = 1.day.freeze
        def generate_payload(user)
            {
                user_id: user.id,
                expire: TOKEN_LIFE_TIME.from_now.utc
            }
        end

        def generate_token(user)
            payload = generate_payload(user)
            token = ::TokenService.new.encode(payload)
            ::TokenCacheStore.new.save(token, expires_at: payload[:expire])

            return { token: token, token_expire_at: payload[:expire] }
        end

        def user_info_response(user)
            {
                user: {
                    id: user.id,
                    name: user.name
                }
            }
        end
end
