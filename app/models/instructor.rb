# frozen_string_literal: true

class Instructor < ApplicationRecord
    include AsAccount
    include AsActor
    include AsAssignee

    has_many :courses, -> { order(updated_at: :desc) }, dependent: :nullify
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
