json.extract! instructor, :id, :name, :title, :location, :introduction, :social_links
json.rank instructor.rank_name
json.partial! 'api/v1/shared/cover', cover: instructor.avatar, name: 'avatar'
