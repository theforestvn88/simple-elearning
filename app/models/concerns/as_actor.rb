module AsActor
    extend ActiveSupport::Concern

    included do
        has_many :activities, lambda { order(created_at: :desc) }, as: :actor
    end
end
