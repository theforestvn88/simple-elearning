# frozen_string_literal: true

module Api
    module V1
        module Partner
            class AssignmentsController < ::PartnerApiController
                helper AssignmentHelper
                before_action :authenticate!

                def index
                    @pagy, @assignments = pagy(current_user.assignments.includes_assignables(:course, :milestone, :lesson).recently_updated)
                    @pagination = pagy_metadata(@pagy).extract!(:series, :pages)
                end

                def create
                    @assignable = assigment_params[:assignable_type].classify.constantize.find(assigment_params[:assignable_id])
                    @assignee = assigment_params[:assignee_type].classify.constantize.find(assigment_params[:assignee_id])
                    @assignment = Assignment.new(assignable: @assignable, assignee: @assignee)
                    
                    authorize @assignment
                    
                    if @assignment.save
                        ::AssignmentMailer.with(assignment: @assignment).inform_new_assignment.deliver_later
                    else
                        render json: @assignment.errors, status: :unprocessable_entity
                    end
                rescue Pundit::NotAuthorizedError
                    response_unauthorized
                rescue => e
                    head :bad_request
                end

                def destroy
                    @assignment = Assignment.find(params[:id])
                    authorize @assignment

                    cancel_assignment(@assignment)
                end

                def cancel
                    @assignment = Assignment.find_by!(assigment_params)
                    authorize @assignment

                    cancel_assignment(@assignment)
                    render :destroy
                end

                private

                    def assigment_params
                        params.require(:assignment).permit(:assignable_id, :assignable_type, :assignee_id, :assignee_type)
                    end

                    def cancel_assignment(assignment)
                        assignment.destroy
                        ::AssignmentMailer.with(assignment: assignment).inform_cancel_assignment.deliver_later
                    end
            end
        end
    end
end
