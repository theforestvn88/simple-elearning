# frozen_string_literal: true

class Assignment < ApplicationRecord
    belongs_to :assignable, polymorphic: true
    belongs_to :assignee, polymorphic: true

    scope :recently_updated, -> { order(updated_at: :desc) }
    scope :includes_assignables, ->(*assignable_types) { includes(:assignable => assignable_types) }
end
