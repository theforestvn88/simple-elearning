module Api
    module V1
        module Partner
            class DirectUploadController < ::Api::V1::DirectUploadController
                include ::Api::Auth::SubjectInstructor
            end
        end
    end
end
