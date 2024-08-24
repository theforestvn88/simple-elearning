# frozen_string_literal: true

class MilestonePolicy < CoursePolicy
    def create?
        course_level_permission?(@record.course)
    end

    def update?
        milestone_level_permission?(@record)
    end

    def destroy?
        course_level_permission?(@record.course)
    end

    private

        def belong_to_same_partner?
            @user&.partner_id == @record.course.partner_id
        end
end
