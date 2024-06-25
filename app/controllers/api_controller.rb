class ApiController < ActionController::API
    include TokenBaseAuthHelper

    private
        def authenticate!
            token = extract_token_from_header
            unless @current_user = ::TokenBaseAuthService.new.authorized_user(token)
                render json: {}, status: :unauthorized
            end
        end

        def current_user
            @current_user
        end
end
