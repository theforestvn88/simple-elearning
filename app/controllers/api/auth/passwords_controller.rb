module Api
    module Auth
        class PasswordsController < ApiController
            before_action :authenticate!

            def update
                if current_user.update(update_password_params)
                    auth_service.clear_user_tokens(current_user)
                    head :ok
                else
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end

            private

                def update_password_params
                    params.permit(:password_challenge, :password, :password_confirmation)
                end
        end
    end
end
