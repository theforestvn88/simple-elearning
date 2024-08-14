class Course < ApplicationRecord
    belongs_to :instructor
    belongs_to :partner
    has_many :milestones
    
    has_one_attached :cover
    
    validates :name, :summary, presence: true, on: :create

    scope :includes_cover, lambda { includes({ cover_attachment: [:blob] }) }
    scope :includes_partner, lambda { includes({partner: { logo_attachment: [:blob] }}) }
end
