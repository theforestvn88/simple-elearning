class TokenStore
    def save(token, expire)
        raise NotImplementedError
    end

    def exist?(token)
        raise NotImplementedError
    end

    def delete(token)
        raise NotImplementedError
    end
end
