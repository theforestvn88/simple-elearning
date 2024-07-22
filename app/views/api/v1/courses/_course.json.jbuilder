json.extract! course, :id, :name, :summary, :created_at, :updated_at
json.url api_v1_course_url(course, format: :json)

if course.cover.attached?
    json.cover course.cover.blob.attributes
                    .slice('filename', 'byte_size')
                    .merge(url: url_for(course.cover))
                    .tap { |attrs| attrs['name'] = attrs.delete('filename') }
end
