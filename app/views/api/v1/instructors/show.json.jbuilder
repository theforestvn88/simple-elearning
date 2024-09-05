json.partial! 'api/v1/instructors/instructor', instructor: @instructor
if @instructor_policy ||= InstructorPolicy.new(@current_user, @instructor)
    json.can_edit true if @instructor_policy.update?
    json.can_delete true if @instructor_policy.destroy?
end