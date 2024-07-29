module Partners
    class HomeController < ApplicationController
        layout "partners/application"

        def index
            p params
        end
    end
end
