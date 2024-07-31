class TokenCacheStore < TokenStore
    def save(token, user, expires_at:)
        Rails.cache.write(token_cache_key(token), true, expires_at: expires_at)
        redis_save_to_user_tokens_list(user, token)
    end

    def exist?(token)
        Rails.cache.exist?(token_cache_key(token))
    end

    def delete(token)
        Rails.cache.delete(token_cache_key(token))
    end

    def clear_tokens_by_user(user)
        redis_delete_user_tokens_list(user)
    end

    private

        def token_cache_key(token)
            token
        end

        def user_tokens_list_key(user)
            "#{user.class.name}-#{user.id}-tokens"
        end

        def redis_save_to_user_tokens_list(user, token)
            k = user_tokens_list_key(user)
            Rails.cache.redis&.then { |redis| redis.lpush(k, token) }
        end

        def redis_delete_user_tokens_list(user)
            k = user_tokens_list_key(user)
            Rails.cache.redis&.then { |redis| 
                user_tokens = []
                redis.pipelined do |pipeline|
                    user_tokens = pipeline.lrange(k, 0, -1)
                    pipeline.del(k)
                end

                redis.multi do |multi|
                    user_tokens.value.each do |token|
                        multi.del(token)
                    end
                end
            }
        end
end
