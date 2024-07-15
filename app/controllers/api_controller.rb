class ApiController < ActionController::API
    include TokenBaseAuth
    include Pundit::Authorization

    rescue_from Pundit::NotAuthorizedError, with: :response_unauthorized
end
