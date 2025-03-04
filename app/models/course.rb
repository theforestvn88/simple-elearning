# frozen_string_literal: true

class Course < ApplicationRecord
    include Trackable
    include Assignable

    belongs_to :instructor
    belongs_to :partner
    has_many :assignees, through: :assignments, source_type: "Instructor"
    has_many :milestones, dependent: :destroy # TODO: soft delete
    has_many :lessons, dependent: :destroy # TODO: soft delete

    has_one_attached :cover
    
    validates :name, :summary, presence: true, on: :create

    scope :recently_updated, -> { order(updated_at: :desc) }
    scope :includes_cover, lambda { includes({ cover_attachment: [:blob] }) }
    scope :includes_partner, lambda { includes({partner: { logo_attachment: [:blob] }}) }
end
