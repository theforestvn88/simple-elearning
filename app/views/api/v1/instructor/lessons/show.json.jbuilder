json.partial! 'api/v1/lessons/lesson', lesson: @lesson
json.assigned true if policy.lesson_assigned_instructor?(@lesson)
json.can_edit policy.lesson_level_permission?(@lesson)
json.can_delete policy.milestone_level_permission?(@lesson.milestone)