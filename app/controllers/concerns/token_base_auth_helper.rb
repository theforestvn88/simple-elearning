module TokenBaseAuthHelper
    private
        TOKEN_HEADER = 'X-Auth-Token'.freeze

        def extract_token_from_header
            request.headers[TOKEN_HEADER]&.split(' ')&.last
        end
end
