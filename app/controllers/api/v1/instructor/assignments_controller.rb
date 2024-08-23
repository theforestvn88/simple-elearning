# frozen_string_literal: true

module Api
    module V1
        module Instructor
            class AssignmentsController < ::InstructorApiController
                before_action :authenticate!

                def create
                    assignable = assigment_params[:assignable_type].classify.constantize.find(assigment_params[:assignable_id])
                    assignee = assigment_params[:assignee_type].classify.constantize.find(assigment_params[:assignee_id])
                    assignment = Assignment.new(assignable: assignable, assignee: assignee)
                    
                    authorize assignment
                    
                    if assignment.save
                        head :created
                    else
                        render json: assignment.errors, status: :unprocessable_entity
                    end
                rescue Pundit::NotAuthorizedError
                    response_unauthorized
                rescue => e
                    head :bad_request
                end

                def destroy
                    assignment = Assignment.find(params[:id])
                    authorize assignment

                    assignment.destroy
                end

                private

                    def assigment_params
                        params.require(:assignment).permit(:assignable_id, :assignable_type, :assignee_id, :assignee_type)
                    end
            end
        end
    end
end
