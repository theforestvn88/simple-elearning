class Instructor < ApplicationRecord
    include AsAccount

    has_many :courses
end
