class Instructor < ApplicationRecord
    include AsAccount

    has_many :courses, dependent: :nullify

    enum rank: { 
        lecturer: 'Lecturer', 
        assistant_professor: "Assistant Professor", 
        associate_professor: "Associate Professor", 
        professor: "Professor", 
        administrator: "President"
    }
end
