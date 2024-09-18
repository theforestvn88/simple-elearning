json.assignees do
    json.array! assignable.assignees do |assignee|
        json.id assignee.id
        json.name assignee.name
        json.partial! 'api/v1/shared/cover', cover: assignee.avatar, name: 'avatar'
    end
end
