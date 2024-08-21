class LessonPolicy < MilestonePolicy
    def show?
        can_modify_course?
    end
end
