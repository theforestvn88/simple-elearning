class Course < ApplicationRecord
    has_one_attached :cover
    belongs_to :instructor
end
