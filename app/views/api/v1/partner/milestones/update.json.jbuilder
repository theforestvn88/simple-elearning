json.extract! @milestone, *@milestone.previous_changes.except(:updated_at, :created_at).keys
