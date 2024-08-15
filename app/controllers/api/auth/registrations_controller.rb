module Api
    module Auth
        class RegistrationsController < ::ApiController
            def create
                if @session = ::TokenBaseAuthService.new.register(register_params)
                    UserMailer.with(user: @session.user).account_verification.deliver_later
                else
                    render json: { error: 'Invalid credentials' }, status: :bad_request
                end
            end

            private

                def register_params
                    params.permit(:email, :password, :password_confirmation, :name)
                end
        end
    end
end