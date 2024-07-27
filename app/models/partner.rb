class Partner < ApplicationRecord
    has_many :instructors, dependent: :destroy

    has_one_attached :logo

    validates :email, presence: true
    validates :name, presence: true
end
