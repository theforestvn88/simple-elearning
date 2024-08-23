# frozen_string_literal: true

class CoursePolicy < ApplicationPolicy
    include Helpers::InstructorUser
    include Helpers::AssignedInstructor

    def create?
        partner_admin?
    end

    def show?
        assigned_instructor?
    end

    def update?
        assigned_instructor?
    end

    def destroy?
        partner_admin?
    end

    private

        def assigned_instructor?
            course_assigned_instructor?(@record) || partner_admin?
        end
end
