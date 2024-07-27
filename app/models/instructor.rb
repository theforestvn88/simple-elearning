class Instructor < ApplicationRecord
    include AsAccount

    has_many :courses, dependent: :nullify
    belongs_to :partner

    enum rank: { 
        lecturer: 'Lecturer', 
        assistant_professor: 'Assistant Professor', 
        associate_professor: 'Associate Professor', 
        professor: 'Professor', 
        administrator: 'President'
    }

    def self.default_rank
        self.ranks.values.first
    end

    def self.admin_rank
        self.ranks[:administrator]
    end
end
