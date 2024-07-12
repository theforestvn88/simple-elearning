json.extract! @session, :token, :token_expire_at

if user = @session.user
    json.user do
        json.id user.id
        json.name user.name
        if user.avatar.attached?
            json.avatar do
                json.url url_for(user.avatar)
            end
        end
    end
end
