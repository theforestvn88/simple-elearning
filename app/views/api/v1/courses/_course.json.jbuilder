json.extract! course, :id, :name, :summary
json.last_update_time time_ago_in_words(course.updated_at)

if course.cover.attached?
    json.cover course.cover.blob.attributes
                    .slice('filename', 'byte_size')
                    .merge(url: url_for(course.cover))
                    .tap { |attrs| attrs['name'] = attrs.delete('filename') }
end

json.partner do
    json.id course.partner.id
    json.name course.partner.name
    if course.partner.logo.attached?
        json.avatar do
            json.url url_for(course.partner.logo)
        end
    end
end
