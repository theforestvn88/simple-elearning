# frozen_string_literal: true

class MilestonePolicy < CoursePolicy
    def create?
        course_level_assigned?
    end

    def update?
        milestone_level_assigned?
    end

    def destroy?
        course_level_assigned?
    end

    private

        def belong_to_same_partner?
            @user&.partner_id == @record.course.partner_id
        end

        def course_level_assigned?
            course_assigned_instructor?(@record.course) || partner_admin?
        end

        def milestone_level_assigned?
            milestone_assigned_instructor?(@record) || course_level_assigned?
        end
end
