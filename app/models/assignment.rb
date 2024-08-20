# frozen_string_literal: true

class Assignment < ApplicationRecord
    belongs_to :assignable, polymorphic: true
    belongs_to :assignee, polymorphic: true
end
