json.extract! @lesson, *@lesson.previous_changes.except(:updated_at, :created_at).keys
