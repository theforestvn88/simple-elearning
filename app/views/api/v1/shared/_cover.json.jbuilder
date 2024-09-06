if cover.attached?
    json.set! (name || 'cover'), \
        if defined?(only_url) && only_url
            {url: url_for(cover)}
        else
            cover.blob.attributes
                .slice('filename', 'byte_size')
                .merge(url: url_for(cover))
                .tap { |attrs| attrs['name'] = attrs.delete('filename') }
        end
end
