module Api
    module Auth
        class InstructorPasswordsController < PasswordsController
            include SubjectInstructor
        end
    end
end
