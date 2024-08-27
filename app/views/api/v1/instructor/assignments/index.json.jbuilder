json.assignments do
    json.array! @assignments, partial: 'api/v1/instructor/assignments/assignment', as: :assignment
end

json.pagination do
    json.pages @pagination[:series]
    json.total @pagination[:pages]
end
