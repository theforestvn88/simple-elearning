json.extract! course, :id, :name, :created_at, :updated_at
json.url api_v1_course_url(course, format: :json)
