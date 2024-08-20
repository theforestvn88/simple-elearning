# frozen_string_literal: true

module AsAssignee
    extend ActiveSupport::Concern

    included do
        has_many :assignments, as: :assignee
    end
end
