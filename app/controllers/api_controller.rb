class ApiController < ActionController::API
    include TokenBaseAuth
    include Pundit::Authorization
    include Pagy::Backend

    rescue_from Pundit::NotAuthorizedError, with: :response_unauthorized
end
