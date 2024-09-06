json.extract! course, :id, :name, :summary
json.last_update_time time_ago_in_words(course.updated_at)
json.partial! 'api/v1/shared/cover', cover: course.cover

json.partner do
    json.id course.partner.id
    json.name course.partner.name
    json.partial! 'api/v1/shared/cover', cover: course.partner.logo, name: 'avatar', only_url: true
end
