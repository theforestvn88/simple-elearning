json.extract! instructor, :id, :name, :title, :location, :introduction, :rank, :social_links
json.partial! 'api/v1/shared/cover', cover: instructor.avatar, name: 'avatar'
