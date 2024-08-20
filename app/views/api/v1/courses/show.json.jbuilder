json.partial! 'api/v1/courses/course', course: @course
json.extract! @course, :estimated_minutes, :lessons_count, :description
