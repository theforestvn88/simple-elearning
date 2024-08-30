json.extract! course, :id, :name, :summary
json.last_update_time time_ago_in_words(course.updated_at)
json.partial! 'api/v1/shared/cover', cover: course.cover
