json.extract! @lesson, *@lesson.previous_changes.except(:updated_at, :created_at).keys
if @lesson.rich_text_content && @lesson.rich_text_content.body_previously_changed?
    json.content @lesson.content.to_s
end
