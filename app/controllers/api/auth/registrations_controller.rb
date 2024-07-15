module Api
    module Auth
        class RegistrationsController < ::ApiController
            def create
                if @session = ::TokenBaseAuthService.new.register(register_params)
                    ::AccountVerificationService.new.send_account_verification_email_to_user(@session.user)
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