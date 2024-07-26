class TokenService
    def encode(payload)
        JWT.encode(payload, serect_key, algorithm)
    end

    def decode(token)
        JWT.decode(token, serect_key, true, algorithm: algorithm).first.symbolize_keys
    rescue StandardError
    end

    private

        def serect_key
            ENV['TOKEN_SERECT_KEY']
        end

        def algorithm
            ENV['TOKEN_ALGORITHM']
        end
end
