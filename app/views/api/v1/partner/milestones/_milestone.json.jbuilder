json.extract! @milestone, :id, :name, :position, :estimated_minutes, :lessons_count
json.assigned true if policy.milestone_assigned_instructor?(@milestone)
json.can_edit policy.milestone_level_permission?(@milestone)
json.can_delete policy.course_level_permission?(@milestone.course)