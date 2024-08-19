json.extract! lesson, :id, :name, :estimated_minutes

if lesson.instructor
    json.instructor do
        json.extract! lesson.instructor, :id, :name
        if lesson.instructor.avatar.attached?
            json.avatar url_for(lesson.instructor.avatar)
        end
    end
end
