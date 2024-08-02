json.courses do
    json.array! @courses, partial: 'api/v1/courses/course', as: :course
end

json.pagination do
    json.pages @pagination[:series]
    json.total @pagination[:pages]
end