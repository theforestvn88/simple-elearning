module Api
    module Auth
        class SessionsController < ::ApiController
            before_action :authenticate!, except: [:create]

            def create
                unless @session = ::TokenBaseAuthService.new.login(params[:email], params[:password])
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end

            def destroy
                ::TokenBaseAuthService.new.logout(@token)
                render json: { message: 'Logged out Successfully' }
            end

            def refresh
                unless @session = ::TokenBaseAuthService.new.refresh_token(@token, @current_user)
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end
        end
    end
end
