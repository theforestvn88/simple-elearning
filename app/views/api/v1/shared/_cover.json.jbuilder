if cover.attached?
    json.cover cover.blob.attributes
        .slice('filename', 'byte_size')
        .merge(url: url_for(cover))
        .tap { |attrs| attrs['name'] = attrs.delete('filename') }
end
