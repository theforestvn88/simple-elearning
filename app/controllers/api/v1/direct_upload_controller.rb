module Api
    module V1
        class DirectUploadController < ::ActiveStorage::DirectUploadsController
            include TokenBaseAuth
            before_action :authenticate!
        end
    end
end
