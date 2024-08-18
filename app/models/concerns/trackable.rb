module Trackable
    extend ActiveSupport::Concern

    included do
        has_many :activities, lambda { order(created_at: :desc) }, as: :trackable
    end
end
