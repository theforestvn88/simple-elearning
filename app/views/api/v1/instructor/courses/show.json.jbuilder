json.partial! 'api/v1/instructor/courses/course', course: @course
json.extract! @course, :estimated_minutes, :lessons_count, :description
json.assigned true if policy.course_assigned_instructor?(@course)
json.partial! 'api/v1/instructor/assignments/assignees', assignable: @course
json.can_edit policy.course_level_permission?(@course)
json.can_delete policy.partner_admin?
json.milestones do
    json.array! @course.milestones do |milestone|
        json.extract! milestone, :id, :name
        json.assigned true if policy.milestone_assigned_instructor?(milestone)
        json.can_edit policy.milestone_level_permission?(milestone)
        json.can_delete policy.course_level_permission?(@course)
        json.partial! 'api/v1/instructor/assignments/assignees', assignable: milestone
        json.lessons do
            json.array! milestone.lessons do |lesson|
                json.extract! lesson, :id, :name
                json.assigned true if policy.lesson_assigned_instructor?(lesson)
                json.can_edit policy.lesson_level_permission?(lesson)
                json.can_delete policy.milestone_level_permission?(milestone)
                json.partial! 'api/v1/instructor/assignments/assignees', assignable: lesson
            end
        end
    end
end
