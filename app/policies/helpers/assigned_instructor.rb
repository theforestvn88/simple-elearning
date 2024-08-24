# frozen_string_literal: true

module Helpers
    module AssignedInstructor
        extend ActiveSupport::Concern

        def course_assigned_instructor?(course)
            @course_assigned ||= Assignment.find_by(assignee: @user, assignable: course).present?
        end

        def milestone_assigned_instructor?(milestone)
            @milestone_assigned ||= Assignment.find_by(assignee: @user, assignable: milestone).present?
        end

        def lesson_assigned_instructor?(lesson)
            @lesson_assigned ||= Assignment.find_by(assignee: @user, assignable: lesson).present?
        end

        def course_level_permission?(course)
            course_assigned_instructor?(course) || partner_admin?
        end

        def milestone_level_permission?(milestone)
            milestone_assigned_instructor?(milestone) || course_level_permission?(milestone.course)
        end

        def lesson_level_permission?(lesson)
            lesson_assigned_instructor?(lesson) || milestone_level_permission?(lesson.milestone)
        end
    end
end
