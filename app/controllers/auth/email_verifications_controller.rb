module Auth
    class EmailVerificationsController < ApplicationController
        def verify
            ::AccountVerificationService.new.call(params[:token])
            redirect_to root_path
        rescue StandardError
            render plain: "Invalid Email Verification", status: :bad_request
        end
    end
end
