json.partial! 'api/v1/courses/course', course: @course
json.extract! @course, :estimated_minutes, :lessons_count, :description
json.milestones do
    json.array! @course.milestones do |milestone|
        json.extract! milestone, :id, :name
        json.lessons do
            json.array! milestone.lessons do |lesson|
                json.extract! lesson, :id, :name
            end
        end
    end
end
