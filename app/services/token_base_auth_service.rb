class TokenBaseAuthService
    def initialize(subject_clazz = User, cache_store: nil)
        @subject_clazz = subject_clazz
        @cache_store = cache_store
    end

    def login(email, password)
        subject = @subject_clazz.find_by(email: email)
        if subject && subject.authenticate(password)
            generate_session(subject)
        end
    end

    def logout(subject, token)
        clear_user_tokens(subject)
    end

    def register(subject_params)
        subject = @subject_clazz.new(subject_params)
        if subject.save
            generate_session(subject)
        end
    end

    def authorized_user(token)
        return nil unless @cache_store.nil? || @cache_store.exist?(token)

        payload = ::TokenService.new.decode(token)
        if payload && @subject_clazz.name == payload[:user_type] && Time.parse(payload[:expire]) >= Time.now.utc
            return @subject_clazz.find_by(id: payload[:user_id])
        end
    end

    def refresh_token(token, subject)
        # TODO: validate user ???
        auth_info = generate_token(subject)
        @cache_store&.delete(token)
        Session.new(**auth_info)
    end

    def clear_user_tokens(subject)
        @cache_store&.clear_tokens_by_user(subject)
    end

    private

        TOKEN_LIFE_TIME = 1.day.freeze
        def generate_payload(subject)
            {
                user_id: subject.id,
                user_type: subject.class.name,
                expire: TOKEN_LIFE_TIME.from_now.utc
            }
        end

        def generate_token(subject)
            payload = generate_payload(subject)
            token = ::TokenService.new.encode(payload)
            @cache_store&.save(token, subject, expires_at: payload[:expire])

            return { token: token, token_expire_at: payload[:expire] }
        end

        def generate_session(subject)
            Session.new(**generate_token(subject).merge({user: subject}))
        end
end
