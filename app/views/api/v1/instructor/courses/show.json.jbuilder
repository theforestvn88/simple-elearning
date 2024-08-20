json.partial! 'api/v1/courses/course', course: @course
json.extract! @course, :estimated_minutes, :lessons_count, :description
json.milestones do
    json.array! @course.milestones do |milestone|
        json.extract! milestone, :id, :name
    end
end
