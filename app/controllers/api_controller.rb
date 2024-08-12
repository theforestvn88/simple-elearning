class ApiController < ActionController::API
    include TokenBaseAuth
    include ::Api::Auth::SubjectUser
    include Pundit::Authorization
    include Pagy::Backend

    rescue_from Pundit::NotAuthorizedError, with: :response_unauthorized

    private

        def auth_service
            @auth_service ||= ::TokenBaseAuthService.new(subject_clazz, cache_store: cache_store)
        end
end
