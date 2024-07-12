json.extract! @session, :token, :token_expire_at

if user = @session.user
    json.user do
        json.id user.id
        json.name user.name
    end
end
