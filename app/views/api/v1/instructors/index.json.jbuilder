json.array! @instructors do |instructor|
    json.extract! instructor, :id, :email, :name
    json.rank instructor.rank_name
    json.partial! 'api/v1/shared/cover', cover: instructor.avatar, name: 'avatar', only_url: true
end
