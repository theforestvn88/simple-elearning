module Api
    module V1
        module Instructor
            class DirectUploadController < ::Api::V1::DirectUploadController
                include ::Api::Auth::SubjectInstructor
            end
        end
    end
end
