# frozen_string_literal: true

class Instructor < ApplicationRecord
    include AsAccount
    include AsActor
    include AsAssignee

    belongs_to :partner
    has_many :courses, -> { order(updated_at: :desc) }, dependent: :nullify
    has_many :partner_courses, :through => :partner, source: :courses

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

    def title
        info&.dig('title')
    end

    def location
        info&.dig('location')
    end

    def social_links
        info&.dig('social_links')
    end

    def rank_name
        ::Instructor.ranks[self.rank]
    end
end
