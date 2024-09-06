json.extract! @session, :token, :token_expire_at

if user = @session.user
    json.user do
        json.id user.id
        json.name user.name
        json.partial! 'api/v1/shared/cover', cover: user.avatar, name: 'avatar', only_url: true
    end
end
