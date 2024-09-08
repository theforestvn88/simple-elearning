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

    scope :by_partner, -> (partner_id) { where(partner_id: partner_id) }
    scope :search_by, -> (search_params) { search_params.empty? ? self : where(**search_params) }
    scope :order_by_rank, -> { order(rank: :desc) }

    def self.default_rank
        self.ranks.values.first
    end

    def self.admin_rank
        self.ranks[:administrator]
    end

    def rank_name
        ::Instructor.ranks[self.rank]
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
end
