# frozen_string_literal: true

class AssignmentPolicy < ApplicationPolicy
    include Helpers::InstructorUser
    include Helpers::AssignedInstructor

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
                    @record.assignable.course
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

        def permitted?
            case @record.assignable
            when ::Course
                partner_admin?
            when ::Milestone
                course_assigned_instructor?(course) || partner_admin?
            when ::Lesson
                milestone_assigned_instructor?(milestone) || course_assigned_instructor?(course) || partner_admin?
            else
                false
            end
        end
end