class Lesson < ApplicationRecord
  belongs_to :milestone
  belongs_to :course
  belongs_to :instructor

  validates :name, presence: true
  validates :estimated_minutes, numericality: { greater_than_or_equal_to: 1, only_integer: true, allow_nil: false }
end
