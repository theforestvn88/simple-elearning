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
            Rails.application.credentials.dig(:token, :serect_key)
        end

        def algorithm
            Rails.application.credentials.dig(:token, :algorithm)
        end
end
