# frozen_string_literal: true

class AssignmentPolicy < ApplicationPolicy
    def create?
        permitted?
    end

    def destroy?
        permitted?
    end

    private

        def course
            @course ||= \
                case @record.assignable
                when ::Course
                    @record.assignable
                when ::Milestone
                    @record.assignable.course
                when ::Lesson
                    @record.assignable.milestone.course
                end
        end

        def milestone
            @milestone ||= \
                case @record.assignable
                when ::Milestone
                    @record.assignable
                when ::Lesson
                    @record.assignable.milestone
                end
        end

        def belong_to_same_partner?
            @user&.partner_id == course.partner_id
        end

        def instructor?
            @user.is_a?(::Instructor)
        end

        def administrator?
            @user.administrator?
        end

        def partner_admin?
            instructor? && administrator? && belong_to_same_partner?
        end

        def course_assigned_instructor?
            Assignment.find_by(assignee: @user, assignable: course).present?
        end

        def milestone_assigned_instructor?
            Assignment.find_by(assignee: @user, assignable: milestone).present?
        end

        def permitted?
            case @record.assignable
            when ::Course
                partner_admin?
            when ::Milestone
                course_assigned_instructor? || partner_admin?
            when ::Lesson
                milestone_assigned_instructor? || course_assigned_instructor? || partner_admin?
            else
                false
            end
        end
end