# frozen_string_literal: true

module Assignable
    extend ActiveSupport::Concern

    included do
        has_many :assignments, as: :assignable
    end
end
