class InstructorMailer < ApplicationMailer
    def inform_new_account
        @instructor = params[:instructor]
        @random_password = params[:random_password]

        mail to: @instructor.email, subject: 'Inform New Account'
    end
end
