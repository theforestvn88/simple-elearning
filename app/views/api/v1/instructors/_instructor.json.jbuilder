json.extract! instructor, :id, :name, :title, :location, :introduction, :rank, :social_links

if instructor.avatar.attached?
    json.avatar instructor.avatar.blob.attributes
                    .slice('filename', 'byte_size')
                    .merge(url: url_for(instructor.avatar))
                    .tap { |attrs| attrs['name'] = attrs.delete('filename') }
end
