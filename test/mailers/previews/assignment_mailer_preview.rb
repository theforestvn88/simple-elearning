# Preview all emails at http://localhost:3000/rails/mailers/assignment_mailer
class AssignmentMailerPreview < ActionMailer::Preview
    def inform_new_assignment
        ::AssignmentMailer.with(assignment: Assignment.first).inform_new_assignment
    end

    def inform_cancel_assignment
        ::AssignmentMailer.with(assignment: Assignment.first).inform_cancel_assignment
    end
end
