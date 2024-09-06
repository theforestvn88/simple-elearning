json.extract! user, :id, :name, :title, :introduction, :location
json.partial! 'api/v1/shared/cover', cover: user.avatar, name: 'avatar'
json.social_links user.social_links || []
json.skills []
json.certificates []
