# Preview all emails at http://localhost:3000/rails/mailers/instructor_mailer
class InstructorMailerPreview < ActionMailer::Preview
    def inform_new_account
        ::InstructorMailer.with(instructor: Instructor.first, random_password: 'random_password').inform_new_account
    end
end
