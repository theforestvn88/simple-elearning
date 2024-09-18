json.assignee do
    json.id @assignee.id
    json.name @assignee.name
    json.partial! 'api/v1/shared/cover', cover: @assignee.avatar, name: 'avatar'
end