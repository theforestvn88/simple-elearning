class Partner < ApplicationRecord
    has_many :instructors, dependent: :destroy
    has_many :courses, dependent: :nullify

    has_one_attached :logo

    validates :email, presence: true
    validates :name, presence: true
    validates :slug, presence: true
end
