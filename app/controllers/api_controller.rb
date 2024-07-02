class ApiController < ActionController::API
    include TokenBaseAuthHelper
    include Pundit::Authorization

    rescue_from Pundit::NotAuthorizedError, with: :response_unauthorized

    private

        def try_authenticate
            @token = extract_token_from_header
            return if @token.nil?

            @current_user = ::TokenBaseAuthService.new.authorized_user(@token)
        end

        def authenticate!
            response_unauthorized unless try_authenticate
        end

        def response_unauthorized
            render json: {}, status: :unauthorized
        end

        def current_user
            @current_user
        end
end
