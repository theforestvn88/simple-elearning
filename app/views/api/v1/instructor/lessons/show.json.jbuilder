json.partial! 'api/v1/lessons/lesson', lesson: @lesson
json.created_time time_ago_in_words(@lesson.created_at)
json.updated_time time_ago_in_words(@lesson.updated_at)
json.assigned true if policy.lesson_assigned_instructor?(@lesson)
json.can_edit policy.lesson_level_permission?(@lesson)
json.can_delete policy.milestone_level_permission?(@lesson.milestone)
json.partial! 'api/v1/instructor/assignments/assignees', assignable: @lesson