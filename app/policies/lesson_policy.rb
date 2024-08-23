# frozen_string_literal: true

class LessonPolicy < MilestonePolicy
    def show?
        lesson_level_assigned?
    end

    def create?
        milestone_level_assigned?
    end

    def update?
        lesson_level_assigned?
    end

    def destroy?
        milestone_level_assigned?
    end

    private

        def milestone_level_assigned?
            milestone_assigned_instructor?(@record.milestone) ||
            course_assigned_instructor?(@record.course) ||
            partner_admin?
        end

        def lesson_level_assigned?
            lesson_assigned_instructor?(@record) ||
            milestone_level_assigned?
        end
end
