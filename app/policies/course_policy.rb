# frozen_string_literal: true

class CoursePolicy < ApplicationPolicy
    include Helpers::InstructorUser
    include Helpers::AssignedInstructor

    def create?
        partner_admin?
    end

    def show?
        partner_instructor?
    end

    def update?
        course_level_permission?(@record)
    end

    def destroy?
        partner_admin?
    end
end
