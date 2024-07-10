json.extract! user, :id, :name, :title, :introduction, :location

if user.avatar.attached?
    json.avatar user.avatar.blob.attributes
                    .slice('filename', 'byte_size')
                    .merge(url: url_for(user.avatar))
                    .tap { |attrs| attrs['name'] = attrs.delete('filename') }
end

json.social_links user.social_links || []
json.skills []
json.certificates []
