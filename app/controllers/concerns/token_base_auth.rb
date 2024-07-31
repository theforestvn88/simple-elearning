module TokenBaseAuth
    private
        TOKEN_HEADER = 'X-Auth-Token'.freeze

        def extract_token_from_header
            request.headers[TOKEN_HEADER]&.split(' ')&.last
        end

        def try_authenticate
            @token = extract_token_from_header
            return if @token.nil?

            @current_user = auth_service.authorized_user(@token)
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
