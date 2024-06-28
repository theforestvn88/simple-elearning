module Api
    module Auth
        class SessionsController < ::ApiController
            before_action :authenticate!, except: [:create]

            def create
                if auth_info = ::TokenBaseAuthService.new.login(params[:email], params[:password])
                    render json: { message: 'Logged in Successfully', **auth_info }
                else
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end

            def destroy
                ::TokenBaseAuthService.new.logout(@token)
                render json: { message: 'Logged out Successfully' }
            end

            def refresh
                if auth_info = ::TokenBaseAuthService.new.refresh_token(@token, @current_user)
                    render json: { **auth_info }
                else
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end
        end
    end
end
