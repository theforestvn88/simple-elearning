class ApiController < ActionController::API
    include TokenBaseAuth
    include Pundit::Authorization
    include Pagy::Backend

    rescue_from Pundit::NotAuthorizedError, with: :response_unauthorized

    private

        def auth_service
            @auth_service ||= ::TokenBaseAuthService.new(subject_clazz)
        end
end
