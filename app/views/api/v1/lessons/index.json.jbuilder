json.array! @lessons do |lesson|
    json.extract! lesson, :id, :name, :estimated_minutes
end
