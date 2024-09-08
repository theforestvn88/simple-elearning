class User < ApplicationRecord
    include AsAccount

    def rank
        'user'
        # TODO: by on payment subscription ?
    end
end
