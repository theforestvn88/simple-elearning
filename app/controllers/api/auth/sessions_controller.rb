module Api
    module Auth
        class SessionsController < ::ApiController
            before_action :authenticate!, except: [:create]

            def create
                unless @session = auth_service.login(params[:email], params[:password])
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end

            def destroy
                auth_service.logout(@token)
                render json: { message: 'Logged out Successfully' }
            end

            def refresh
                unless @session = auth_service.refresh_token(@token, @current_user)
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end

            private

                def auth_service
                    @auth_service ||= ::TokenBaseAuthService.new(subject_clazz)
                end

                def subject_clazz
                    User
                end
        end
    end
end
