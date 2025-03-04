json.extract! lesson, :id, :name, :position, :estimated_minutes, :course_id, :milestone_id
json.content lesson.content.to_s

if lesson.instructor
    json.instructor do
        json.extract! lesson.instructor, :id, :name
        json.partial! 'api/v1/shared/cover', cover: lesson.instructor.avatar, name: 'avatar', only_url: true
    end
end
