module Api
    module V1
        class DirectUploadController < ::ActiveStorage::DirectUploadsController
            include TokenBaseAuth
            include ::Api::Auth::SubjectUser

            before_action :authenticate!

            private

                def auth_service
                    @auth_service ||= ::TokenBaseAuthService.new(subject_clazz)
                end
        end
    end
end
