class TokenCacheStore < TokenStore
    def save(token, expires_at:)
        Rails.cache.write(token_cache_key(token), true, expires_at: expires_at)
    end

    def exist?(token)
        Rails.cache.exist?(token_cache_key(token))
    end

    def delete(token)
        Rails.cache.delete(token_cache_key(token))
    end

    private

        def token_cache_key(token)
            token
        end
end
