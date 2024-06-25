module Api
    module Auth
        class SessionsController < ::ApiController
            before_action :authenticate!, except: [:create]

            def create
                if token = ::TokenBaseAuthService.new.login(params[:email], params[:password])
                    render json: { message: 'Logged in Successfully', token: token }
                else
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end

            def destroy
                ::TokenBaseAuthService.new.logout(extract_token_from_header)
                render json: { message: 'Logged out Successfully' }
            end
        end
    end
end
