class AssignmentMailer < ApplicationMailer
    def inform_new_assignment
        @assignment = params[:assignment]
        @assignee = @assignment.assignee

        mail to: @assignee.email, subject: 'Inform New Assignment'
    end

    def inform_cancel_assignment
        @assignment = params[:assignment]
        @assignee = @assignment.assignee

        mail to: @assignee.email, subject: 'Inform Cancel Assignment'
    end
end
