# frozen_string_literal: true

module Helpers
    module AssignedInstructor
        extend ActiveSupport::Concern

        def course_assigned_instructor?(course)
            Assignment.find_by(assignee: @user, assignable: course).present?
        end

        def milestone_assigned_instructor?(milestone)
            Assignment.find_by(assignee: @user, assignable: milestone).present?
        end

        def lesson_assigned_instructor?(lesson)
            Assignment.find_by(assignee: @user, assignable: lesson).present?
        end
    end
end
