# frozen_string_literal: true

module AssignmentHelper
    def assignment_path(assignable)
        case assignable
        when ::Course
            "courses/#{assignable.id}"
        when ::Milestone
            "courses/#{assignable.course_id}/milestones/#{assignable.id}"
        when ::Lesson
            "courses/#{assignable.course_id}/milestones/#{assignable.milestone_id}/lessons/#{assignable.id}"
        else
        end
    end
end
