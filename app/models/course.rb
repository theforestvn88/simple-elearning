class Course < ApplicationRecord
    belongs_to :instructor
    belongs_to :partner
    
    has_one_attached :cover
    
    validates :name, :summary, presence: true, on: :create
end
