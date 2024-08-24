# frozen_string_literal: true

class LessonPolicy < MilestonePolicy
    def show?
        partner_instructor?
    end

    def create?
        milestone_level_permission?(@record.milestone)
    end

    def update?
        lesson_level_permission?(@record)
    end

    def destroy?
        milestone_level_permission?(@record.milestone)
    end
end
