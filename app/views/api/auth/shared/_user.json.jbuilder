json.user do
    json.id user.id
    json.name user.name
    json.rank user.rank
    json.partial! 'api/v1/shared/cover', cover: user.avatar, name: 'avatar', only_url: true
end
