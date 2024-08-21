# frozen_string_literal: true

class Milestone < ApplicationRecord
  include Assignable

  belongs_to :course
  belongs_to :instructor
  has_many :lessons, dependent: :destroy

  validates :name, presence: true
  validates :estimated_minutes, numericality: { greater_than_or_equal_to: 0, only_integer: true, allow_nil: true }

  include PositionalOrdering
  set_position_scope :course_id
end
